const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadAudioRecording, getAcousticLogs } = require('../controllers/audioController');

router.post('/upload', upload.single('audio'), uploadAudioRecording);
router.get('/logs', getAcousticLogs);

module.exports = router;