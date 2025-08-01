import clsx from "clsx";
import React, { useState, useCallback } from "react";
import { Accept, useDropzone, FileRejection, ErrorCode } from "react-dropzone";
import { Button } from "./ui/button";
import Modal from "./Modal";
import Overlay from "./Overlay";
import { useRouter } from "next/navigation";

const FILE_MAX_SIZE_MB = 4;

const ACCEPTED_FILE_TYPE_MAP: Accept = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
};

const formatRejectionMessage = (rejection: FileRejection): string => {
  const error = rejection.errors?.[0];
  const filename = rejection.file.name;

  switch (error.code) {
    case ErrorCode.FileInvalidType: {
      return `${
        filename
      } is not an accepted file type (supported file types: ${acceptedFileTypesStrList}).`;
      break;
    }
    case ErrorCode.FileTooLarge: {
      const maxSizeMb = FILE_MAX_SIZE_MB;
      return `${filename} is too large to be uploaded. Please reduce the file size to below ${maxSizeMb}MB and try again.`;
    }
    default: {
      return "";
    }
  }
};

const acceptedFileTypesStrList = Object.values(ACCEPTED_FILE_TYPE_MAP || [])
  .map((extensions) => extensions[0].slice(1))
  .join(", ")
  .toUpperCase();

const MediaUpload: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const router = useRouter();

  const uploadFile = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return fetch("/api/images", {
      method: "POST",
      body: formData,
    });
  }, []);

  const handleFileRejection = useCallback((rejection: FileRejection) => {
    console.error("file upload rejected: ", rejection);
    setError(formatRejectionMessage(rejection));
    setIsErrorModalOpen(true);
  }, []);

  const handleFileSelect = useCallback(
    (files: File[], rejections: FileRejection[]) => {
      setIsDragging(false);
      setError(null);
      if (rejections?.length) {
        handleFileRejection(rejections[0]);
        return;
      }

      setFile(files[0]);
      setIsUploading(true);

      uploadFile(files[0])
        .then(async (res) => {
          if (!res.ok) {
            throw new Error("upload received error response");
          }
          console.log("upload successful", res);
          const json = await res.json();
          router.push(`/images/${json.data.id}`);
        })
        .catch((err) => {
          console.error("error uploading file: ", err);
          setError(
            "Something went wrong uploading your file.  Please try again."
          );
          setIsErrorModalOpen(true);
        });

      setTimeout(() => {
        setIsUploading(false);
      }, 2000);
    },
    [router, handleFileRejection, uploadFile]
  );

  const {
    getRootProps,
    getInputProps,
    open: openFileInput,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    noClick: true, // disable click on root
    onDrop: handleFileSelect,
    maxSize: FILE_MAX_SIZE_MB * 1000000, // convert to bytes
    accept: ACCEPTED_FILE_TYPE_MAP,
    multiple: false,
    useFsAccessApi: false,
    onDragEnter: () => {
      setIsDragging(true);
    },
    onDragLeave: () => setIsDragging(false),
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div
        className={clsx(
          "relative border-2 border-dashed border-gray-300 transition-colors rounded-md min-h-32 w-full py-8 px-3",
          { "bg-gray-500/[.06]": isDragAccept },
          {
            "bg-rose-400/[.06] border-red-500":
              (isDragging && isDragReject) || isErrorModalOpen,
          }
        )}
      >
        {/* Drop area input - fades when the items are invalid */}
        <div className={clsx("flex flex-col items-center justify-center")}>
          <div className="mb-2 text-sm text-center text-gray-600 flex flex-col items-center gap-3">
            <div>To analyze an image, simply...</div>
            <div>
              <Button className="cursor-pointer" onClick={openFileInput}>
                Upload an image
              </Button>
            </div>
            <div> or drag and drop</div>
          </div>

          <div className="text-center text-xs text-gray-400">
            {acceptedFileTypesStrList} up to {FILE_MAX_SIZE_MB} MB
          </div>
        </div>
      </div>
      {/* Overlays */}
      <div
        {...getRootProps({ className: "fixed inset-0 pointer-events-none" })}
      >
        <input {...getInputProps()} />
        {/* Dragged file selection overlay */}
        {isDragging && (
          <Overlay>
            {isDragReject ? (
              <>Warning: Invalid file selected</>
            ) : (
              <>Drop your image anywhere to upload</>
            )}
          </Overlay>
        )}

        {/* File upload overlay */}
        {isUploading && (
          <Overlay>
            <p>
              Now processing
              <br />
              {file?.name || "your file"}
            </p>

            <p>This should only take a few seconds...</p>
          </Overlay>
        )}
      </div>

      {/* Rejection Warning Modal */}
      <Modal
        open={isErrorModalOpen}
        onOpenChange={setIsErrorModalOpen}
        title={"Invalid file"}
      >
        {error || "Something unexpected went wrong, please try again."}
      </Modal>
    </div>
  );
};

export default MediaUpload;
