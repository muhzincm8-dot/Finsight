import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

// NOTE: Do NOT call dotenv.config() here.
// Vercel injects environment variables directly into process.env.
// Calling dotenv with a missing .env file path on Vercel causes startup crashes.

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────────────
// `origin: true` reflects the requesting origin back, which is required when
// using `credentials: true`. Using `"*"` with credentials is forbidden by the
// CORS spec and will be rejected by browsers.
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle CORS preflight for all routes
app.options('*', cors({ origin: true, credentials: true }));

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Database ─────────────────────────────────────────────────────────────────
connectDB();

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running', status: 'ok' });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ msg: 'Internal server error', error: err.message });
});

// ─── Local dev only ───────────────────────────────────────────────────────────
// On Vercel, app.listen() must NOT be called — Vercel invokes the exported app
// directly as a serverless function. Calling listen() on Vercel causes
// FUNCTION_INVOCATION_FAILED crashes.
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
