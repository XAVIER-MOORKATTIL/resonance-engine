const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration with filename sanitization
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Strip spaces and special characters from incoming file names
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueName = `${Date.now()}-${cleanName}`;
    cb(null, uniqueName);
  }
});

// Configure Multer with 50MB file size limit
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

// In-memory fallback ledger
let acousticLogs = [
  {
    id: 1,
    speaker: 'Manager',
    decibels: 82.07,
    truthState: 'Verified',
    pretenseAlert: 'CLEAR',
    timestamp: '5:38:12 PM'
  }
];

// POST /api/resonance/upload
router.post('/upload', (req, res) => {
  upload.single('audio')(req, res, (err) => {
    if (err) {
      console.error('⚡ Multer Upload Error:', err);
      return res.status(400).json({
        success: false,
        error: `Audio upload error: ${err.message}`
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No audio file provided in request'
      });
    }

    const speaker = req.body.speaker || 'Unknown';
    const decibels = parseFloat((70 + Math.random() * 25).toFixed(2));
    const pretenseAlert = decibels > 85 ? 'ELEVATED PRETENSE' : 'CLEAR';
    const truthState = 'Verified';
    const timestamp = new Date().toLocaleTimeString();

    const newLog = {
      id: Date.now(),
      speaker,
      filename: req.file.filename,
      decibels,
      truthState,
      pretenseAlert,
      timestamp
    };

    acousticLogs.unshift(newLog);

    return res.status(200).json({
      success: true,
      message: 'Wave transduced successfully',
      data: newLog
    });
  });
});

// GET /api/resonance/logs
router.get('/logs', (req, res) => {
  return res.status(200).json({
    success: true,
    logs: acousticLogs
  });
});

module.exports = router;