const mongoose = require('mongoose');

const AcousticLogSchema = new mongoose.Schema({
  speaker: {
    type: String,
    required: true,
    enum: ['Manager', 'Sakshi', 'Nilesh', 'Xavier', 'Vinayak', 'System']
  },
  audioFileName: {
    type: String,
    required: true
  },
  peakDecibel: {
    type: Number,
    required: true
  },
  timepassDetected: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['Superficial Pretense', 'Verifiable Reality', 'Pending Verification'],
    default: 'Pending Verification'
  },
  driveUploadVerified: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AcousticLog', AcousticLogSchema);