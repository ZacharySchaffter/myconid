"use server-only";

import { storage } from "@/lib/firestore.server";

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
      },
      resumable: false,
    });

    return filePath;
  }

  async getSignedUrl(mediaId: string) {
    // check if ID exists
    throw new Error("not implemented");
  }
}
