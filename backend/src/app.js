

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const sendResponse = require('./utils/sendResponse');

const app = express();

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'User Management API is running 🚀'
  });
});

// Security & parsing
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// 404 handler
app.use((req, res) => sendResponse(res, 404, false, 'Route not found'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  sendResponse(res, 500, false, 'Internal server error');
});

module.exports = app;