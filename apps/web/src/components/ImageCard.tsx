"use client";

import { type Image } from "@myconid/store/types";
import dayjs from "dayjs";
import { CircleAlert, CircleCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

type Props = {
  image: Image;
};

const ImageCard: React.FC<Props> = ({ image }) => {
  const { name, confidence } = image?.analysis || {};
  const createdAt = dayjs(image.createdAt).format("YYYY-MM-DD");
  const imageUrl = `${process.env.NEXT_PUBLIC_MEDIA_SERVICE_BASE_URL}/${image.id}/url`;
  const title = name || "Unidentified";
  const confidenceFormatted = confidence ? (confidence * 100).toFixed(0) : 0;

  return (
    <div className="bg-white rounded flex flex-col h-full space-between">
      <Link
        href={`/images/${image.id}`}
        className="relative aspect-square w-full"
      >
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 bg-black p-1 rounded-full w-5 h-5">
          {confidenceFormatted ? (
            <CircleCheck className="text-white absolute inset-0 w-full h-full" />
          ) : (
            <CircleAlert className="text-white absolute inset-0 w-full h-full" />
          )}
        </div>
      </Link>

      <div className="flex flex-col gap-1 pt-1 grow">
        <p className="text-xs text-gray-500">{createdAt}</p>
        <h2 className="text-sm font-medium">
          {title}{" "}
          {confidenceFormatted && (
            <span className="text-gray-400 text-xs">
              ({confidenceFormatted}%)
            </span>
          )}
        </h2>
        <Link href={`/images/${image.id}`} className="mt-auto w-full">
          <Button size="sm" className="px-2 text-xs w-full">
            View details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ImageCard;
