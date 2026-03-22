require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { authenticateToken } = require('./middleware/auth');
const { initializeDatabase } = require('./config/schema');

const authRoutes = require('./routes/auth');
const icsRoutes = require('./routes/ics');

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// Initialize database
initializeDatabase().catch((error) => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});

// Routes
app.post('/api/auth/register', authRoutes.post);
app.post('/api/auth/login', authRoutes.post);

app.use('/api/auth', authRoutes);
app.use('/api/ics', authenticateToken, icsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
