"use server-only";

import { firestore } from "../lib/firestore.server";

import { MediaService } from "./media";

interface Image {
  user_id: string;
  media_id: string;
  created_at: FirebaseFirestore.Timestamp;
  deleted_at: FirebaseFirestore.Timestamp | null;
}

class MyconidCoreService {
  Media: MediaService = new MediaService();
  constructor() {}

  async getImagesByUserID(userId: string): Promise<Image[]> {
    const imagesRef = firestore.collection("images");
    const querySnapshot = await imagesRef.where("user_id", "==", userId).get();

    const images: Image[] = querySnapshot.docs.map(
      (doc) => doc.data() as Image
    );

    return images;
  }

  async createImage(
    userId: string,
    fileName: string,
    mimeType: string,
    buffer: Buffer
  ): Promise<void> {
    // add media to file storage
    const mediaUrl = await this.Media.createMedia(
      userId,
      fileName,
      mimeType,
      buffer
    );

    // create record in firestore
  }
}

export default new MyconidCoreService();
