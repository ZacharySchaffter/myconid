import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

/**
 * ---------------------
 * PARSE ENV
 * ---------------------
 */
dotenv.config();
const { PORT = 3000, ALLOWED_ORIGINS } = process.env;

/**
 * ---------------------
 * EXPRESS CONFIG
 * ---------------------
 */
const app = express();

// Middlewares
app.use(morgan("dev"));

const allowedOrigins = ALLOWED_ORIGINS?.split(",") ?? [];
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("origin isn't in allowlist"));
      }
    },
    credentials: true, // if you're sending cookies or Authorization headers
  })
);

/**
 * ---------------------
 * ENDPOINTS
 * ---------------------
 */
app.get("/", (req: Request, res: Response) => {
  res.send("{{SERVICE_NAME}} is running");
});

/**
 * ---------------------
 * START SERVER
 * ---------------------
 */
let server = app.listen(PORT, () => {
  console.log(`{{SERVICE_NAME}} server running at http://localhost:${PORT}`);
});

/**
 * ---------------------
 * GRACEFUL SHUTDOWN
 * ---------------------
 */
const gracefulShutdown = () => {
  console.log("beginning graceful shutdown...");

  // force after 15s
  const timeout = setTimeout(() => {
    console.warn("force exiting after timeout");
    process.exit(1);
  }, 15000);

  server.close((err) => {
    clearTimeout(timeout);
    if (err) {
      console.error("error during graceful shutdown:", err);
      process.exit(1);
    }
    console.log("server closed, exiting process.");
    process.exit(0);
  });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
