"use server";

import { redirect } from "next/navigation";

import Heading from "@/components/Heading";
import MediaUpload from "@/components/MediaUpload";
import auth from "@/services/auth";
import myconid from "@/services/myconid";
import ImageGrid from "@/components/ImageGrid";

const AccountPage = async () => {
  const { userId } = await auth.verifySession();

  if (!userId) {
    redirect("/");
  }

  const [selfImagesPromise, otherImagesPromise] = await Promise.allSettled([
    myconid.listImages(userId),
    myconid.listImages(userId, true),
  ]);

  const selfImages =
    selfImagesPromise?.status === "fulfilled" ? selfImagesPromise?.value : [];
  const otherImages =
    otherImagesPromise?.status === "fulfilled" ? otherImagesPromise?.value : [];

  return (
    <div className="w-full max-w-2xl flex-grow">
      {/* TODO: add username from auth ctx */}

      <Heading level="h1" className="mb-4">
        Your Dashboard
      </Heading>

      {/* Drag and Drop Media Uploader */}
      <MediaUpload />

      {selfImages.length > 0 && (
        <ImageGrid title="Your collection" images={selfImages} />
      )}

      {otherImages.length > 0 && (
        <ImageGrid title="Uploaded by others" images={otherImages} />
      )}
    </div>
  );
};

export default AccountPage;
