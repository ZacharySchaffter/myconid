import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { z } from "zod";
import multer from "multer";
import Myconid from "./services/myconid";

dotenv.config();

const upload = multer();
const app = express();
const PORT = process.env.PORT || 3000;

async function verifySession(req: Request) {
  // TODO: integrate with auth service
  return {
    userId: "fake-id-123",
    isValid: true,
  };
}

/**
 * ---------------------
 * LIST IMAGES
 * ---------------------
 */
const listImagesSearchSchema = z.object({
  user: z.string().optional(),
  exclude: z.boolean().optional().default(false),
});
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

  const images = await Myconid.listImages(userId).catch((err) => {
    console.error(
      `error: failed to retrieve images (user id: ${userId}, exclude: ${exclude}):`,
      err
    );
    return res.status(500).send({ error: "error retrieving images" });
  });

  return res.send({ images });
});

/**
 * ---------------------
 * GET IMAGE BY ID
 * ---------------------
 */
app.get("/images/:id", async (req: Request, res: Response) => {
  const { userId, isValid } = await verifySession(req);

  if (!isValid) {
    return res.status(401).json({ error: "not authenticated" });
  }

  const id = req.params.id;

  let image;
  try {
    image = Myconid.getImage(id);
  } catch (err) {
    return res
      .status(500)
      .send({ error: `unexpected error retrieving image with id ${id}` });
  }

  if (!image) {
    res.status(404).send({ error: "image not found" });
  }

  res.send({ image });
});

/**
 * ---------------------
 * UPLOAD IMAGE
 * ---------------------
 */
app.post(
  "/images",
  upload.single("file"),
  async (req: Request, res: Response) => {
    const { userId, isValid } = await verifySession(req);

    if (!isValid) {
      return res.status(401).json({ error: "not authenticated" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "missing file" });
    }

    const file = req.file;
    const buffer = file.buffer;

    const image = await Myconid.createImage(
      userId,
      file.originalname,
      file.mimetype,
      buffer
    );

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
