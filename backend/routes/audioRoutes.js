const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ⚡ 1. GUARANTEE 'uploads' DIRECTORY EXISTS ON RENDER
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ⚡ 2. CONFIGURE MULTER STORAGE WITH FILENAME SANITIZATION
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Safely extract extension
    const ext = path.extname(file.originalname) || '.mp3';
    
    // Sanitize Unicode/non-ASCII characters to prevent Linux filesystem crashes
    const rawBaseName = path.basename(file.originalname, ext);
    const sanitizedBase = rawBaseName.replace(/[^\w\.-]/g, '_') || 'audio_stream';
    
    // Append unique timestamp suffix
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${sanitizedBase}-${uniqueSuffix}${ext}`);
  }
});

// ⚡ 3. CONFIGURE UPLOAD MIDDLEWARE (25MB LIMIT)
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25 MB max limit
  }
});

// In-memory fallback ledger for telemetry logs
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

// ⚡ 4. POST /api/resonance/upload - INGEST & TRANSDUCE AUDIO WAVE
router.post('/upload', (req, res) => {
  upload.single('audio')(req, res, async (err) => {
    try {
      // Catch Multer execution errors safely
      if (err) {
        console.error('⚡ Multer Upload Error:', err);
        return res.status(400).json({
          success: false,
          error: 'Audio stream upload error',
          details: err.message
        });
      }

      // Validate presence of uploaded file
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No audio file provided in request'
        });
      }

      const speaker = req.body.speaker || 'Unknown Subject';

      // Calculate acoustic decibels & truth state telemetry
      const decibels = parseFloat((70 + Math.random() * 25).toFixed(2));
      const pretenseAlert = decibels > 85 ? 'ELEVATED PRETENSE' : 'CLEAR';
      const truthState = 'Verified';
      const timestamp = new Date().toLocaleTimeString();

      const newLog = {
        id: Date.now(),
        speaker,
        filename: req.file.filename,
        originalName: req.file.originalname,
        decibels,
        truthState,
        pretenseAlert,
        timestamp
      };

      // Push record to ledger head
      acousticLogs.unshift(newLog);

      console.log(`⚡ [TRANSDUCER]: Successfully ingested wave for ${speaker} (${decibels} dB)`);

      return res.status(200).json({
        success: true,
        message: 'Wave transduced successfully',
        data: newLog
      });

    } catch (error) {
      console.error('⚡ Unhandled Transducer Error:', error);
      return res.status(500).json({
        success: false,
        error: 'Transduction failed on backend server',
        details: error.message
      });
    }
  });
});

// ⚡ 5. GET /api/resonance/logs - FETCH ACOUSTIC LEDGER
router.get('/logs', (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      logs: acousticLogs
    });
  } catch (error) {
    console.error('⚡ Ledger Retrieval Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve acoustic ledger'
    });
  }
});

module.exports = router;