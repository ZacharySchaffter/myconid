import Auth from "@/services/auth";
import Myconid from "@/services/core";
import { notFound } from "next/navigation";

type PageParams = {
  id: string;
};

const ImageDetailPage = async ({ params }: { params: Promise<PageParams> }) => {
  const { id } = await params;
  const { userId, isValid } = await Auth.verifySession();
  if (!isValid) {
    return notFound();
  }

  console.log("Fetching image: ", id);
  const image = await Myconid.getImageByID(id);
  if (!image) {
    return notFound();
  }

  // this doesn't belong to you...
  if (image?.userId !== userId) {
    console.log("image doesn't belong to current user");
  }

  return (
    <div>
      <img src={`/assets/images/${id}`} />
    </div>
  );
};

export default ImageDetailPage;
