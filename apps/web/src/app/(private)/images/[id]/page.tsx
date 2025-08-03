import Link from "next/link";
import { notFound } from "next/navigation";
import dayjs from "dayjs";
import Heading from "@/components/Heading";
import Auth from "@/services/auth";
import Myconid from "@/services/myconid";
import { LucideArrowLeft } from "lucide-react";

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
  const image = await Myconid.getImage(id);
  if (!image) {
    return notFound();
  }

  // this doesn't belong to you...
  if (image?.userId !== userId) {
    console.log("image doesn't belong to current user");
  }

  return (
    <div className="max-w-lg w-full">
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
          src={`/assets/images/${id}`}
          alt={`image id: ${image.id}`}
          className="block absolute left-0 top-0 right-0 bottom-0 w-full h-full object-cover object-center"
        />
      </div>
      {/* Info */}
      <div>
        <div className="text-sm my-2">
          Uploaded at: {dayjs(image.createdAt).format("YYYY-MM-DD")}
        </div>
        <Heading level="h1" tag="h2">
          <span className="block text-[.55em] font-medium">Genus Name</span>
          <span>Species Name (todo)</span>
        </Heading>

        {/* TODO: Fill in data here */}
      </div>
    </div>
  );
};

export default ImageDetailPage;
