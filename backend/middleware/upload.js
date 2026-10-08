const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `acoustic-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File Filter (Audio Only)
const fileFilter = (req, file, cb) => {
  const isAudioMime = file.mimetype.startsWith('audio/') || file.mimetype === 'application/octet-stream';
  const isAudioExt = /\.(mp3|wav|m4a|ogg)\$/i.test(file.originalname);

  if (isAudioMime || isAudioExt) {
    cb(null, true);
  } else {
    cb(new Error('⚡ [ACOUSTIC REJECTION]: Only sound frequency files (MP3, WAV, M4A, OGG) are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB max size
});

module.exports = upload;