import 'dotenv/config';
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

/* ---------------- Database ---------------- */

connectDB();

/* ---------------- Routes ---------------- */

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

/* ---------------- Test Route ---------------- */

app.get("/", (req, res) => {
  res.json({
    message: "Backend API Running",
    status: "OK",
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
  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;