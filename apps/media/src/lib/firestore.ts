import admin from "firebase-admin";
import dotenv from "dotenv";
import { Bucket } from "@google-cloud/storage";
dotenv.config();

if (!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
  console.error("FIREBASE_SERVICE_ACCOUNT_BASE64 not set and is required!");
}

if (!process.env.FIREBASE_STORAGE_BUCKET) {
  console.error("FIREBASE_STORAGE_BUCKET not set and is required!");
}

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    Buffer.from(
      process.env.FIREBASE_SERVICE_ACCOUNT_BASE64!,
      "base64"
    ).toString("utf-8")
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

// @ts-expect-error: turborepo is complaining about typing here
const storage: Bucket = admin.storage().bucket();

export { storage };
