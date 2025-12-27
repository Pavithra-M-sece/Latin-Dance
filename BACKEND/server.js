import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db-connect/db.js';
import { errorHandler, requestLogger } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/authRoutes.js';
import classRoutes from './routes/classRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';

const app = express();

// Middleware
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5174',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/attendance', attendanceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Test route for debugging
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
