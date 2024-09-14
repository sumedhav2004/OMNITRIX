const express = require('express');
const { createRepository, commitChanges, revertRepository, uploadFile, createDirectory, getUserRepos, getRepoCommits,getRepositoryDetails,getFileContent, getCommitHistory } = require('../controllers/repoController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Routes with authentication
router.post('/create', auth, createRepository);
router.post('/commit', auth, commitChanges);
router.post('/revert', auth, revertRepository);
router.post('/upload', [auth, upload.single('file')], uploadFile);
router.post('/create-directory', auth, createDirectory);
router.get('/repos', auth, getUserRepos); 
router.get('/repos/:repoId/commits', auth, getCommitHistory);
router.get('/repos/:repoId/details',getRepositoryDetails);
router.get('/:repoId/files/:fileId', auth, getFileContent);


module.exports = router;


