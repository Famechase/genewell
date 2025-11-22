import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleRegister, handleLogin, handleGetProfile } from "./routes/auth";
import {
  handleDNAUpload,
  handleGetAnalysisResults,
  handleGenerateReport,
} from "./routes/dna";
import { handleSubmitQuiz, handleGetQuizResults } from "./routes/quiz";
import { handleGetDashboard, handleGetProgressStats } from "./routes/dashboard";
import {
  handleWellnessQuizSubmission,
  handleWellnessPayment,
  handleWellnessDownload,
  handleProductDownload,
} from "./routes/wellness";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/register", handleRegister);
  app.post("/api/auth/login", handleLogin);
  app.get("/api/auth/profile", handleGetProfile);

  // DNA processing routes
  app.post("/api/dna/upload", handleDNAUpload);
  app.get("/api/dna/results", handleGetAnalysisResults);
  app.get("/api/dna/report", handleGenerateReport);

  // Quiz routes
  app.post("/api/quiz/submit", handleSubmitQuiz);
  app.get("/api/quiz/results", handleGetQuizResults);

  // Dashboard routes
  app.get("/api/dashboard", handleGetDashboard);
  app.get("/api/dashboard/progress", handleGetProgressStats);

  // Wellness quiz routes
  app.post("/api/wellness/quiz", handleWellnessQuizSubmission);
  app.post("/api/wellness/payment", handleWellnessPayment);
  app.get("/api/wellness/download/:analysisId", handleWellnessDownload);

  // Product download routes
  app.get("/api/products/download/:productId", handleProductDownload);

  return app;
}
