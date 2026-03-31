import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// CORS – reflect any origin back (supports credentials, works on Vercel)
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight OPTIONS requests
app.options('*', cors({ origin: true, credentials: true }));

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running', status: 'ok' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ msg: 'Internal server error', error: err.message });
});

// if (!process.env.VERCEL) {
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// }
// Start server (Only runs in local development, Vercel handles this in prod)

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`server is running at port: ${PORT}`);
    });
}

export default app;
