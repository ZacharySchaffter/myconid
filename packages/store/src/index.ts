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

  async listImages(userId?: string, exclude?: string): Promise<Image[]> {
    const imagesRef = this.firestore.collection("images");
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
