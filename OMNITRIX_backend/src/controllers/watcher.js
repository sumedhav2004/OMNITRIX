const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const Repository = require('../models/Repository'); // Assuming you are using MongoDB

/**
 * Function to start watching a repository for changes and update the database accordingly.
 * @param {String} repoPath - The path to the local repository.
 * @param {Object} repo - The MongoDB repository document.
 */
 module.exports.watchRepository = (repoPath, repo) => {
    const watcher = chokidar.watch(repoPath, { persistent: true, ignoreInitial: true });

    watcher
        .on('add', async (filePath) => {
            console.log(`File added: ${filePath}`);
            const stats = fs.statSync(filePath);

            const fileMetadata = {
                name: path.basename(filePath),
                path: path.relative(repoPath, filePath),
                type: 'file',
                size: stats.size,
            };

            repo.files.push(fileMetadata);
            await repo.save(); // Save to the database
        })
        .on('addDir', async (dirPath) => {
            console.log(`Directory added: ${dirPath}`);

            const dirMetadata = {
                name: path.basename(dirPath),
                path: path.relative(repoPath, dirPath),
                type: 'directory',
                size: 0,
            };

            repo.files.push(dirMetadata);
            await repo.save(); // Save to the database
        })
        .on('unlink', async (filePath) => {
            console.log(`File removed: ${filePath}`);

            // Remove the file metadata from the database
            const relativePath = path.relative(repoPath, filePath);
            repo.files = repo.files.filter(file => file.path !== relativePath);
            await repo.save();
        })
        .on('unlinkDir', async (dirPath) => {
            console.log(`Directory removed: ${dirPath}`);

            // Remove the directory and its contents from the database
            const relativePath = path.relative(repoPath, dirPath);
            repo.files = repo.files.filter(file => !file.path.startsWith(relativePath));
            await repo.save();
        });

    watcher.on('error', (error) => console.error(`Watcher error: ${error}`));
};



