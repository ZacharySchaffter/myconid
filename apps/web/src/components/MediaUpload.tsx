import React, { useState, useCallback } from "react";
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

const MediaUpload: React.FC<Props> = ({
  onSelectFiles,
  maxFileSize = 4000,
  accept,
  validator,
  multiple = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);

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
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  return (
    <>
      {isDragging && (
        <div
          {...getRootProps()}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px dashed #999",
            pointerEvents: "auto",
          }}
        >
          <input {...getInputProps()} />
          <p>Drop your files anywhere</p>
        </div>
      )}
    </>
  );
};

export default MediaUpload;
