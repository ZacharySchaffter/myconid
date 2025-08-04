import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { z } from "zod";
import multer from "multer";
import morgan from "morgan";
import { Store } from "@myconid/store";
import { MediaService } from "./services/media.js";
import { AnalysisService } from "./services/analysis.js";

// parse env
dotenv.config();
const {
  PORT = 3000,
  ALLOWED_ORIGINS,
  FIREBASE_SERVICE_ACCOUNT_BASE64,
  MEDIA_SERVICE_BASE_URL,
  ANALYSIS_SERVICE_BASE_URL,
} = process.env;

/**
 * ---------------------
 * EXPRESS CONFIG
 * ---------------------
 */
const upload = multer();
const app = express();

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
 * CLIENTS
 * ---------------------
 */

const store = new Store(FIREBASE_SERVICE_ACCOUNT_BASE64!);

const media = new MediaService();
const analysis = new AnalysisService();

async function verifySession(req: Request) {
  // TODO: integrate with auth service
  return {
    userId: "fake-id-123",
    isValid: true,
  };
}

/**
 * ---------------------
 * ENDPOINTS
 * ---------------------
 */

const listImagesSearchSchema = z.object({
  user: z.string().optional(),
  exclude: z.boolean().optional().default(false),
});

app.get("/", async (req: Request, res: Response) => {
  res.send("core api service is running");
});

// LIST IMAGES
app.get("/images", async (req: Request, res: Response) => {
  const { isValid } = await verifySession(req);

  if (!isValid) {
    return res.status(401).json({ error: "not authenticated" });
  }

  const result = listImagesSearchSchema.safeParse(req.query);
  if (!result.success) {
    console.log("invalid search params");
    return res.status(400).json({
      error: "invalid arguments",
      details: result.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`
      ),
    });
  }
  const { user: userId, exclude } = result.data;

  const images = await store.listImages(userId).catch((err: unknown) => {
    console.error(
      `error: failed to retrieve images (user id: ${userId}, exclude: ${exclude}):`,
      err
    );
    return res.status(500).json({ error: "error retrieving images" });
  });

  return res.json({ data: images, success: true });
});

// GET IMAGE
app.get("/images/:id", async (req: Request, res: Response) => {
  const { userId, isValid } = await verifySession(req);

  if (!isValid) {
    return res.status(401).json({ error: "not authenticated" });
  }

  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "image id is required" });
  }

  let image;
  try {
    image = await store.getImage(id);
  } catch (err) {
    return res
      .status(500)
      .send({ error: `unexpected error retrieving image with id ${id}` });
  }

  if (!image) {
    res.status(404).json({ error: "image not found" });
  }

  res.json({ data: image, success: true });
});

// UPLOAD IMAGE
app.post(
  "/images",
  upload.single("file"),
  async (req: Request, res: Response) => {
    const { userId, isValid } = await verifySession(req);

    if (!isValid) {
      return res.status(401).json({ error: "not authenticated" });
    }

    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({ error: "missing file" });
    }

    let mediaPath: string = "";
    try {
      mediaPath = await media.saveMedia(userId, imageFile);
    } catch (err) {
      console.error("error saving media");
      return res.status(500).json({ error: "error saving image file" });
    }

    // TODO: run analysis

    const image = await store.createImage({ userId, mediaPath });

    res.json({ success: true, data: image });
  }
);

// start server
let server = app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});

// Graceful shutdown handler
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
