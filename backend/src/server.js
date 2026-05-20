import dotenv from 'dotenv';

// Load .env for local development. On Vercel, env vars are injected automatically.
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

const app = express();

/* ---------------- CORS ---------------- */

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/* ---------------- Middleware ---------------- */

app.use(express.json());

/* ---------------- DB Connection Middleware ---------------- */
// On Vercel (serverless), each invocation needs to ensure DB is connected.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    return res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
});

/* ---------------- Routes ---------------- */

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

/* ---------------- Health / Test Route ---------------- */

app.get("/", (req, res) => {
  res.json({
    message: "Backend API Running",
    status: "OK",
    env: {
      mongoUri: !!process.env.MONGODB_URI,
      secretKey: !!process.env.SECRET_KEY,
    },
  });
});

/* ---------------- Error Handler ---------------- */

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

/* ---------------- Local Development ---------------- */

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;