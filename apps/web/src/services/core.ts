"use server-only";

import { v7 as uuidv7 } from "uuid";
import { firestore } from "../lib/firestore.server";
import { MediaService } from "./media";

interface ImageRecord {
  userId: string;
  mediaPath: string;
  createdAt: Date;
  deletedAt?: Date | null;
}

interface Image extends ImageRecord {
  id: string;
}

class MyconidCoreService {
  Media: MediaService = new MediaService();
  constructor() {}

  async getImagesByUserID(userId: string): Promise<Image[]> {
    const imagesRef = firestore.collection("images");
    const querySnapshot = await imagesRef.where("userId", "==", userId).get();

    const images: Image[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt.toDate(),
        deletedAt: data.deletedAt?.toDate(),
      } as Image;
    });

    return images;
  }

  async createImage(
    userId: string,
    fileName: string,
    mimeType: string,
    buffer: Buffer
  ): Promise<Image> {
    // add media to file storage
    const mediaPath = await this.Media.createMedia(
      userId,
      fileName,
      mimeType,
      buffer
    );

    // create record in firestore
    const docId = uuidv7();
    const docRef = firestore.collection("images").doc(docId);

    const imageData: ImageRecord = {
      userId,
      mediaPath,
      createdAt: new Date(),
      deletedAt: null,
    };

    await docRef.set(imageData);

    return { id: docRef.id, ...imageData };
  }
}

export default new MyconidCoreService();
