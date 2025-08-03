"use server-only";

import { storage } from "../lib/firestore";

export class MediaService {
  async createMedia(
    userId: string,
    fileName: string,
    mimeType: string,
    buffer: Buffer
  ): Promise<string> {
    const timestamp = Date.now();
    const filePath = `images/${userId}/${timestamp}-${fileName}`;

    // upload the file buffer
    const fileUpload = storage.file(filePath);

    // store media in firebase DB
    await fileUpload.save(buffer, {
      metadata: {
        contentType: mimeType,
        customMetadata: {
          filename: fileName,
        },
      },
      resumable: false,
    });

    return filePath;
  }

  async getMediaSignedUrl(
    mediaPath: string,
    expiresAt?: number
  ): Promise<string> {
    const file = storage.file(mediaPath);
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: expiresAt || Date.now() + 10 * 1000,
    });

    return url;
  }
}

export default new MediaService();
