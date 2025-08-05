import admin from "firebase-admin";
import { v7 as uuidv7 } from "uuid";
import { Image, ImageRecord } from "./types.js";

export * as Types from "./types.js";

export class Store {
  private firestore: admin.firestore.Firestore;

  constructor(firebaseCredentials: string) {
    if (!firebaseCredentials) {
      console.error("ERROR: firebase credentials are required.");
      process.exit(1);
    }

    if (!admin.apps.length) {
      const serviceAccount = JSON.parse(
        Buffer.from(firebaseCredentials, "base64").toString("utf-8")
      );

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    this.firestore = admin.firestore();
  }

  async getImage(id: string): Promise<Image | null> {
    const doc = await this.firestore.collection("images").doc(id).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data();

    return {
      ...data,
      id: doc.id,
      createdAt: data?.createdAt.toDate(),
      deletedAt: data?.deletedAt?.toDate(),
    } as Image;
  }

  async listImages(options?: {
    userId?: string;
    exclude?: boolean;
  }): Promise<Image[]> {
    const imagesRef = this.firestore.collection("images");

    let snapshot = await imagesRef.get();
    let docs = snapshot.docs;

    if (options?.userId) {
      docs = options.exclude
        ? docs.filter((doc) => doc.data().userId !== options.userId)
        : docs.filter((doc) => doc.data().userId === options.userId);
    }

    const images: Image[] = docs
      .map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt.toDate(),
          deletedAt: data.deletedAt?.toDate(),
        } as Image;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return images;
  }

  async createImage(
    data: Pick<ImageRecord, "userId" | "mediaPath" | "analysis">
  ): Promise<Image> {
    const docId = uuidv7();
    const docRef = this.firestore.collection("images").doc(docId);

    const imageData: ImageRecord = {
      createdAt: new Date(),
      deletedAt: null,
      ...data,
    };

    await docRef.set(imageData);

    return { id: docRef.id, ...imageData };
  }
}
