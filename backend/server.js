const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/sessions');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', sessionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Wellness Platform API is running', timestamp: new Date().toISOString() });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});