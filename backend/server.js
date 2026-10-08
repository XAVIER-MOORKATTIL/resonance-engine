const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const audioRoutes = require('./routes/audioRoutes');

dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API Routes
app.use('/api/resonance', audioRoutes);

// Health Check Endpoint
app.get('/api/resonance/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    system: 'RESONANCE-O Acoustic-Quantum Transducer',
    message: 'Frequency channels clear and ready for soundwave ingestion.'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`⚡ [RESONANCE SERVER]: Transducer active on port ${PORT}`);
});