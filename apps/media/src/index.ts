import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import multer from "multer";
import { LRUCache } from "lru-cache";
import { storage } from "./lib/firestore.js";
import { Store } from "@myconid/store";

/**
 * ---------------------
 * PARSE ENV
 * ---------------------
 */
dotenv.config();
const {
  PORT = 3000,
  ALLOWED_ORIGINS,
  FIREBASE_SERVICE_ACCOUNT_BASE64,
} = process.env;

/**
 * ---------------------
 * EXPRESS CONFIG
 * ---------------------
 */
const app = express();
const upload = multer();

// Middlewares
app.use(express.json());
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
 * CLIENTS/CACHE
 * ---------------------
 */
const store = new Store(FIREBASE_SERVICE_ACCOUNT_BASE64!);

const cache = new LRUCache<string, string>({
  max: 500,
  ttl: 1000 * 30, // 30 second expiry
});

/**
 * ---------------------
 * ENDPOINTS
 * ---------------------
 */
app.get("/", (req: Request, res: Response) => {
  res.send("media is running");
});

app.post(
  "/media",
  upload.single("file"),
  async (req: Request, res: Response) => {
    // parse file
    const file = req.file;
    const userId = req.body.user_id;
    if (!userId) {
      return res.status(400).json({ error: "user id is required" });
    }
    if (!file) {
      return res.status(400).json({ error: "file is required" });
    }

    const timestamp = Date.now();
    const filePath = `images/${userId}/${timestamp}-${file.originalname}`;

    const fileUpload = storage.file(filePath);

    // store media in firebase DB
    try {
      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
          customMetadata: {
            filename: file.originalname,
            uploader_id: userId,
          },
        },
        resumable: false,
      });
      res.send(filePath);
    } catch (err) {
      console.error("error saving media:", err);
      res.status(500).json({ error: "error saving media" });
    }
  }
);

// GET DOWNLOAD URL FOR MEDIA RECORD

app.get("/media/:id/url", async (req: Request, res: Response) => {
  const imageId = req.params.id;

  if (!imageId) {
    return res.status(400).json({ error: "image id is required" });
  }

  try {
    // check cache for image id
    const cachedUrl = cache.get(imageId);
    if (cachedUrl) {
      return res.redirect(cachedUrl);
    }

    // lookup image in firestore to get media path
    const image = await store.getImage(imageId);
    if (!image) {
      console.log(`image with id ${imageId} not found`);
      return res.status(404).json({ error: "image not found" });
    }

    const mediaPath = image?.mediaPath;
    if (!mediaPath) {
      console.log(`image with id ${imageId} had no media path`);
      return res.status(404).json({ error: "image has no media path" });
    }

    const file = storage.file(mediaPath);
    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 60 * 1000, // 1 minute expiry
    });

    console.log(`returning signed url for image with id ${imageId}...`);

    cache.set(imageId, signedUrl);
    res.redirect(signedUrl);
  } catch (err) {
    console.error("error getting url: ", err);
    res.status(500).json({ error: "error retrieving image url" });
  }
});

/**
 * ---------------------
 * START SERVER
 * ---------------------
 */
let server = app.listen(PORT, () => {
  console.log(`media server running at http://localhost:${PORT}`);
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
