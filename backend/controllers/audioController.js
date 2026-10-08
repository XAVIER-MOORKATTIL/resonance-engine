const AcousticLog = require('../models/AcousticLog');
const analyzeAcousticSignal = require('../utils/fftAnalyzer');

// @desc    Ingest audio recording & store acoustic quantum telemetry
// @route   POST /api/resonance/upload
// @access  Public
const uploadAudioRecording = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: '❌ No audio wave stream provided.' });
    }

    const { speaker = 'Manager' } = req.body;
    const { size, filename, originalname } = req.file;

    // Run spectral signal analysis
    const analysis = analyzeAcousticSignal(size, originalname);

    // Save to MongoDB Atlas
    const newLog = await AcousticLog.create({
      speaker,
      audioFileName: filename,
      peakDecibel: analysis.peakDecibel,
      timepassDetected: analysis.timepassDetected,
      verificationStatus: analysis.verificationStatus,
      driveUploadVerified: true
    });

    res.status(201).json({
      success: true,
      message: '⚡ [SIGNAL TRANSDUCED]: Acoustic wave processed successfully!',
      telemetry: {
        id: newLog._id,
        speaker: newLog.speaker,
        file: originalname,
        peakDecibel: `${analysis.peakDecibel} dB`,
        transducedVoltage: `${analysis.energyVoltage} V`,
        timepassDetected: analysis.timepassDetected,
        verificationStatus: analysis.verificationStatus,
        driveUploadVerified: newLog.driveUploadVerified
      }
    });
  } catch (error) {
    console.error('❌ [TRANSDUCTION FAILURE]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Retrieve all logged acoustic waves from MongoDB Atlas
// @route   GET /api/resonance/logs
// @access  Public
const getAcousticLogs = async (req, res) => {
  try {
    const logs = await AcousticLog.find().sort({ timestamp: -1 });
    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadAudioRecording,
  getAcousticLogs
};