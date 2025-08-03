import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.send("{{SERVICE_NAME}} is running");
});

let server = app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});

// Graceful shutdown handler
const gracefulShutdown = () => {
  console.log("beginning graceful shutdown...");

  server.close((err) => {
    if (err) {
      console.error("error during graceful shutdown:", err);
      process.exit(1);
    }
    console.log("server closed, exiting process.");
    process.exit(0);
  });

  // force after 15s
  setTimeout(() => {
    console.warn("force exiting after timeout");
    process.exit(1);
  }, 15000);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
