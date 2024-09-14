const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');
const Repository = require('../models/Repository');
const mime = require('mime-types');
const chokidar = require('chokidar');
const { watchRepository } = require('./watcher');

exports.uploadFile = async (req, res) => {
  const { repoId, filePath } = req.body;
  const file = req.file; // Assuming you're using multer for file handling
  const userId = req.user.id;

  try {
      const repo = await Repository.findById(repoId);
      if (!repo) return res.status(404).json({ msg: 'Repository not found' });

      const repoPath = path.join(process.env.GIT_REPO_PATH, userId, repo.name);
      const fullFilePath = path.join(repoPath, filePath, file.originalname);

      // Ensure directory exists
      fs.mkdirSync(path.dirname(fullFilePath), { recursive: true });

      // Save the file to disk
      fs.writeFileSync(fullFilePath, file.buffer);

      // Log the full file path for debugging
    //   console.log(`File saved to: ${fullFilePath}`);

      // Update database
      const fileMetadata = {
          name: file.originalname,
          path: path.join(filePath, file.originalname),
          type: 'file',
          size: file.size,
      };

      repo.files.push(fileMetadata);
      await repo.save();
      watchRepository(repoPath, repo);

      res.json({ msg: 'File uploaded successfully', file: fileMetadata });
  } catch (err) {
      console.error('Upload File Error:', err);
      res.status(500).json({ msg: 'Server error' });
  }
};

exports.createDirectory = async (req, res) => {
    const { repoId, dirPath } = req.body;
    const userId = req.user.id;

    try {
        const repo = await Repository.findById(repoId);
        if (!repo) return res.status(404).json({ msg: 'Repository not found' });

        const fullDirPath = path.join(process.env.GIT_REPO_PATH, userId, repo.name, dirPath);
        fs.mkdirSync(fullDirPath, { recursive: true });

        const dirMetadata = {
            name: path.basename(dirPath),
            path: dirPath,
            type: 'directory',
        };

        repo.files.push(dirMetadata);
        await repo.save();

        res.json({ msg: 'Directory created successfully', directory: dirMetadata });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.commitChanges = async (req, res) => {
  const { repoId, message } = req.body;
//   console.log(message)
  const userId = req.user.id;

  try {
      const repo = await Repository.findById(repoId);
      if (!repo) return res.status(404).json({ msg: 'Repository not found' });

      const repoPath = path.join(process.env.GIT_REPO_PATH, userId, repo.name);
      const git = simpleGit(repoPath);

      // Ensure all files are staged
      await git.add('./*');
      await git.commit(message);
        console.log(message)
      // Update commit information in the database
      repo.commits.push({
          message,
          date: new Date()
      });
      await repo.save();
      watchRepository(repoPath, repo);
      
      res.json({ msg: 'Changes committed successfully' });
  } catch (err) {
      console.error('Commit Changes Error:', err);
      res.status(500).json({ msg: 'Server error' });
  }
};

exports.createRepository = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  try {
      const repoPath = path.join(process.env.GIT_REPO_PATH, userId, name);

      // Create repository directory
      fs.mkdirSync(repoPath, { recursive: true });

      // Initialize Git repository using simple-git
      const git = simpleGit(repoPath);
      await git.init();

      // Create repository document in MongoDB
      const newRepo = new Repository({
          user: userId,
          name,
          files: [],
          commits: []
      });
      await newRepo.save();

      res.json({ msg: 'Repository created successfully', repository: newRepo });
  } catch (err) {
      console.error('Create Repository Error:', err); // Log detailed error
      res.status(500).json({ msg: 'Server error' });
  }
};

exports.revertRepository = async (req, res) => {
  const { repoId, commitHash } = req.body;
  const userId = req.user.id;

  try {
      const repo = await Repository.findById(repoId);
      if (!repo) return res.status(404).json({ msg: 'Repository not found' });

      const repoPath = path.join(process.env.GIT_REPO_PATH, userId, repo.name);
      const git = simpleGit(repoPath);

      // Revert to the specified commit
      await git.checkout(commitHash);
      await git.reset('hard', commitHash);

      // Get the current commit history from the local repository
      const commitDetails = await git.log({ maxCount: 100 }); // Adjust maxCount as needed
      const newCommits = commitDetails.all.map(commit => ({
          hash: commit.hash,
          message: commit.message,
          date: commit.date,
      }));

      // Update commit history in the database
      repo.commits = newCommits;

      // Sync files after revert
      const currentFiles = await git.raw(['ls-tree', '--full-tree', '-r', 'HEAD']);
      const filePaths = currentFiles.split('\n').filter(line => line).map(line => {
          const parts = line.split(/\s+/);
          return parts[3]; // Extract file path
      });

      // Update files in the database
      const dbFilePaths = repo.files.map(file => file.path);
      const filesToRemove = dbFilePaths.filter(filePath => !filePaths.includes(filePath));
      repo.files = repo.files.filter(file => !filesToRemove.includes(file.path));

      for (const filePath of filePaths) {
          if (!dbFilePaths.includes(filePath)) {
              const stats = fs.statSync(path.join(repoPath, filePath));
              repo.files.push({
                  name: path.basename(filePath),
                  path: filePath,
                  type: stats.isDirectory() ? 'directory' : 'file',
                  size: stats.size,
              });
          }
      }

      await repo.save();

      res.json({
          msg: 'Repository reverted and commit history updated successfully',
          commits: repo.commits,
          files: repo.files,
      });
  } catch (err) {
      console.error('Revert Repository Error:', err);
      res.status(500).json({ msg: 'Server error' });
  }
};

exports.getCommitHistory = async (req, res) => {
    // const { repoId ,userId} = req.body;
    const {repoId} = req.params;
    // console.log("REPOID: ",repoId);
  
    try {
        const repo = await Repository.findById(repoId);
        const userId = repo.user.toString();
        console.log(userId)
        if (!repo) return res.status(404).json({ msg: 'Repository not found' });
  
        const repoPath = path.join(process.env.GIT_REPO_PATH, userId, repo.name);
        const git = simpleGit(repoPath);
  
        // Fetch the latest commit history
        const commitDetails = await git.log({ maxCount: 100 }); // You can adjust maxCount as needed
  
        const commitHistory = commitDetails.all.map(commit => ({
            hash: commit.hash,
            message: commit.message,
            date: commit.date,
        }));
  
        res.json({
            commits: commitHistory,
        });
    } catch (err) {
        console.error('Get Commit History Error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
  };
  

exports.getRepositoryDetails = async (req, res) => {
    try {
        const repoId = req.params.repoId; // Get the repository ID from the request parameters
        const directoryPath = req.query.directory || ''; // Get the directory path if passed in the query

        // Find the repository by ID
        const repository = await Repository.findById(repoId);

        if (!repository) {
            return res.status(404).json({ msg: 'Repository not found.' });
        }

        // Filter files by the directory path (handle both files and directories)
        const files = repository.files.filter(file => {
            return file.path.startsWith(directoryPath);
        });

        res.json({ name: repository.name, files });
    } catch (error) {
        console.error('Get Repository Details Error:', error.message);
        res.status(500).send('Server Error');
    }
};


exports.getUserRepos = async (req, res) => {
    try {
        const userId = req.user.id; // Use the authenticated user's ID
        const repositories = await Repository.find({ user: userId });

        if (!repositories || repositories.length === 0) {
            return res.status(404).json({ msg: 'No repositories found for this user.' });
        }

        res.json(repositories);
    } catch (error) {
        console.error('Get User Repos Error:', error);
        res.status(500).send('Server Error');
    }
};

// Get all commits for a specific repository
exports.getRepoCommits = async (req, res) => {
    try {
        const repoId = req.params.repoId;
        // console.log("Fetching commits for repoId:", repoId); // Log the repoId being fetched

        const repository = await Repository.findById(repoId).select('commits');
        if (!repository) {
            // console.log("Repository not found for repoId:", repoId);
            return res.status(404).json({ msg: 'Repository not found.' });
        }

        // console.log("Repository found:", repository);
        res.json(repository.commits);
    } catch (error) {
        console.error('Get Repo Commits Error:', error.message, error.stack);
        res.status(500).send('Server Error');
    }
};

exports.getFileContent = async (req, res) => {
    const { repoId, fileId } = req.params; 
    const userId = req.user.id;  

    try {
        const repo = await Repository.findById(repoId);
        if (!repo) return res.status(404).json({ msg: 'Repository not found.' });

        const file = await repo.files.id(fileId); 

        if (!file) return res.status(404).json({ msg: 'File not found.' });

        // Construct the full file path using the file's path stored in the database
        const fullFilePath = path.normalize(path.join(process.env.GIT_REPO_PATH, userId, repo.name, file.path));

        // Ensure the file path is valid (protect against directory traversal attacks)
        if (!fullFilePath.startsWith(path.join(process.env.GIT_REPO_PATH, userId, repo.name))) {
            return res.status(400).json({ msg: 'Invalid file path.' });
        }

        // Check if the file exists
        if (!fs.existsSync(fullFilePath)) {
            return res.status(404).json({ msg: 'File not found.' });
        }

        // Get the file's MIME type
        const mimeType = mime.lookup(fullFilePath) || 'application/octet-stream';
        
        // Read the file content
        const fileBuffer = fs.readFileSync(fullFilePath);
        
        // Return the file content in JSON format
        if (mimeType.startsWith('text/') || mimeType === 'application/json') {
            const fileContent = fileBuffer.toString('utf8');
            return res.json({ content: fileContent, mimeType });
        } else {
            // For non-text files, return Base64 encoded content
            const fileContentBase64 = fileBuffer.toString('base64');
            return res.json({ content: fileContentBase64, mimeType, encoding: 'base64' });
        }
    } catch (err) {
        console.error('Get File Content Error:', err);
        res.status(500).json({ msg: 'Server error.' });
    }
};


