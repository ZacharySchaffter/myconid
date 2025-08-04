"use client";

import { type Image } from "@myconid/store/types";
import dayjs from "dayjs";
import { CircleAlert, CircleCheck } from "lucide-react";
import Link from "next/link";

type Props = {
  image: Image;
};

const ImageCard: React.FC<Props> = ({ image }) => {
  const { name, isMushroom } = image?.analysis || {};
  const createdAt = dayjs(image.createdAt).format("YYYY-MM-DD");
  const imageUrl = `${process.env.NEXT_PUBLIC_MEDIA_SERVICE_BASE_URL}/${image.id}/url`;
  const title = name || "Unidentified";
  const confidence = isMushroom?.binary
    ? (isMushroom?.confidence * 100).toFixed(0)
    : null;

  return (
    <div className="bg-white rounded shadow-md overflow-hidden flex flex-col">
      <div className="relative aspect-square w-full">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 right-2 bg-white bg-opacity-80 p-1 rounded-full">
          {confidence ? (
            <CircleCheck className="text-gray-700" />
          ) : (
            <CircleAlert className="text-gray-700" />
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <p className="text-xs text-gray-500">{createdAt}</p>
        <h2 className="text-sm font-medium">
          {title}{" "}
          {confidence && <span className="text-gray-500">({confidence}%)</span>}
        </h2>
        <Link
          href={`/images/${image.id}`}
          className="mt-2 inline-block text-blue-600 text-sm hover:underline"
        >
          View details
        </Link>
      </div>
    </div>
  );
};

export default ImageCard;
