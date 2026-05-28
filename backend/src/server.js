const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/error.middleware');

const authRoutes = require('./routes/auth.routes');
const uploadRoutes = require('./routes/upload.routes');
const extractionRoutes = require('./routes/extraction.routes');
const itineraryRoutes = require('./routes/itinerary.routes');
const shareRoutes = require('./routes/share.routes');

dotenv.config({ path: './.env' });

const app = express();

connectDB();

const uploadDirs = ['./uploads', './uploads/pdfs', './uploads/images'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// FIXED CORS - Allow all origins for development
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/extract', extractionRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/share', shareRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/test`);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection:', err.name, err.message);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.log('Uncaught exception:', err.name, err.message);
  process.exit(1);
});

module.exports = app;