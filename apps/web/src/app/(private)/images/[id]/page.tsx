import Link from "next/link";
import { notFound } from "next/navigation";
import dayjs from "dayjs";
import Heading from "@/components/Heading";
import Auth from "@/services/auth";
import Myconid from "@/services/myconid.server";
import { LucideArrowLeft } from "lucide-react";
import { Image } from "@myconid/store/types";
import AnalysisResults from "./AnalysisResults";

type PageParams = {
  id: string;
};

const ImageDetailPage = async ({ params }: { params: Promise<PageParams> }) => {
  const { id } = await params;
  const { userId, isValid } = await Auth.verifySession();
  if (!isValid) {
    return notFound();
  }

  console.log(`fetching image on the server... (id: ${id})`);
  let image: Image | null;
  try {
    image = await Myconid.getImage(id);
  } catch (err) {
    console.error("error retrieving image: ", err);
    return notFound();
  }

  if (!image) {
    return notFound();
  }

  // this doesn't belong to you...
  if (image?.userId !== userId) {
    // TODO: change state if it doesn't belong to them
  }

  return (
    <div className="max-w-lg w-full flex flex-col gap-y-2">
      <div className="mb-3">
        <Link
          href="/account"
          className="inline-flex items-center gap-1 text-sm"
        >
          <LucideArrowLeft width={"1rem"} /> <span>Back to dashboard</span>
        </Link>
      </div>
      <Heading level="h1" className="mb-4">
        Analysis Results
      </Heading>
      {/* Image */}
      <div className="relative border border-black aspect-square">
        <img
          src={`${process.env.NEXT_PUBLIC_MEDIA_SERVICE_BASE_URL}/${id}/url`}
          alt={`image id: ${id}`}
          className="block absolute left-0 top-0 right-0 bottom-0 w-full h-full object-cover object-center"
        />
      </div>
      {/* Info */}
      <div>
        <div className="text-sm my-2">
          Uploaded at: {dayjs(image.createdAt).format("YYYY-MM-DD")}
        </div>
        <AnalysisResults analysis={image?.analysis} />
      </div>
    </div>
  );
};

export default ImageDetailPage;
