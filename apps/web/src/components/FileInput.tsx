import React from "react";
import clsx from "clsx";
import {
  Accept,
  useDropzone,
  DropzoneOptions,
  FileRejection,
  ErrorCode,
} from "react-dropzone";

type Props = {
  onSelectFiles: (files: File[], rejections: FileRejection[]) => void;
  /* Max file size in bytes */
  maxFileSize?: number;
  accept?: Accept;
  validator?: DropzoneOptions["validator"];
  /* Whether to allow multiple files */
  multiple?: boolean;
};

const FileDropInput: React.FC<Props> = ({
  onSelectFiles,
  maxFileSize,
  accept,
  validator,
  multiple = false,
}) => {
  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop: onSelectFiles,
    maxSize: maxFileSize,
    accept,
    validator,
    multiple,
    useFsAccessApi: false,
  });

  const acceptedFiletypesStr = Object.values(accept || [])
    .map((extensions) => extensions[0].slice(1))
    .join(", ")
    .toUpperCase();

  return (
    <>
      <div
        {...getRootProps()}
        className={clsx(
          "relative border-2 border-dashed border-gray-300 transition-colors rounded-md min-h-32 w-full cursor-pointer py-8 px-3",
          "hover:bg-atticus-blue-default/[.02]",
          { "bg-atticus-blue-default/[.06]": isDragAccept },
          { "bg-rose-400/[.06] border-red-500": isDragReject }
        )}
      >
        {/* Drop area input - fades when the items are invalid */}
        <div
          className={clsx("flex flex-col items-center justify-center", {
            "opacity-0": isDragReject,
          })}
        >
          <input {...getInputProps()}>Test Input</input>
          <div className="mb-2 text-sm text-center text-gray-600">
            <span
              className="text-atticus-blue-default"
              data-testid="upload-a-file-btn"
            >
              {multiple ? "Upload files" : "Upload a file"}
            </span>
            {" or drag and drop."}
          </div>
          {(acceptedFiletypesStr || maxFileSize !== undefined) && (
            <div className="text-center text-xs text-gray-400">
              {acceptedFiletypesStr || "Files"}
              {maxFileSize !== undefined &&
                ` up to ${maxFileSize / 1000000}MB${multiple ? " each" : ""}`}
            </div>
          )}
        </div>

        {isDragReject && (
          <div className="absolute inset-x-0 inset-y-0 w-full h-full flex flex-col gap-4 items-center justify-center text-red-500">
            <span>X</span>
            <div>Invalid files selected</div>
          </div>
        )}
      </div>
      {fileRejections && (
        <div className="mt-2">
          {fileRejections.map((r, i) => {
            const error = r.errors?.[0];
            let message = error.message;
            switch (error.code) {
              case ErrorCode.FileInvalidType: {
                message = `${
                  r.file.name
                } is not an accepted file type (supported file types: ${acceptedFiletypesStr.toLowerCase()}).`;
                break;
              }
              case ErrorCode.FileTooLarge: {
                const maxSizeMb = maxFileSize ? maxFileSize / 1000000 : 0;
                message = `${r.file.name} is too large to be uploaded. Please reduce the file size to below ${maxSizeMb}MB and try again.`;
              }
            }

            return (
              <div key={i} className="text-red-500 mb-2 text-xs">
                {message}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default FileDropInput;
