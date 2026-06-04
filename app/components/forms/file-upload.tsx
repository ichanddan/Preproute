"use client";

import {
  FileArchiveIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  TriangleAlertIcon,
  UploadIcon,
  VideoIcon,
  XIcon,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  type FileMetadata,
  type FileWithPreview,
  formatBytes,
  useFileUpload,
} from "~/hooks/use-file-upload";
import { cn } from "~/lib/utils";

function FileIcon({ file }: { file: File | FileMetadata }) {
  const type = file.type;
  const className = "size-4";
  if (type.startsWith("image/")) return <ImageIcon className={className} />;
  if (type.startsWith("video/")) return <VideoIcon className={className} />;
  if (type.startsWith("audio/"))
    return <HeadphonesIcon className={className} />;
  if (type.includes("excel") || type.includes("sheet"))
    return <FileSpreadsheetIcon className={className} />;
  if (type.includes("zip") || type.includes("rar"))
    return <FileArchiveIcon className={className} />;
  return <FileTextIcon className={className} />;
}

export function FileUpload({
  maxFiles,
  maxSize = 10 * 1024 * 1024,
  accept = "*",
  multiple = true,
  className,
  onChange,
}: {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  className?: string;
  /** Called with the currently selected real `File` objects. */
  onChange?: (files: File[]) => void;
}) {
  const [
    { files, isDragging, errors },
    {
      removeFile,
      openFileDialog,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
    },
  ] = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    multiple,
    onFilesChange: (next) =>
      onChange?.(
        next.map((f) => f.file).filter((f): f is File => f instanceof File),
      ),
  });

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <input {...getInputProps()} className="sr-only" />
      <button
        type="button"
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center gap-2 rounded-lg border border-dashed p-6 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
        )}
      >
        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
          <UploadIcon className="size-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">
          Drag &amp; drop files here, or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          Up to {formatBytes(maxSize)} each
          {maxFiles
            ? ` · max ${maxFiles} file${maxFiles === 1 ? "" : "s"}`
            : ""}
        </p>
      </button>

      {files.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {files.map((item: FileWithPreview) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-lg border bg-card p-2"
            >
              <div className="shrink-0">
                {item.preview && item.file.type.startsWith("image/") ? (
                  // biome-ignore lint/performance/noImgElement: local object-URL preview
                  <img
                    src={item.preview}
                    alt={item.file.name}
                    className="size-10 rounded-md border object-cover"
                  />
                ) : (
                  <div className="flex size-10 items-center justify-center rounded-md border text-muted-foreground">
                    <FileIcon file={item.file} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(item.file.size)}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remove ${item.file.name}`}
                className="size-7 text-muted-foreground"
                onClick={() => removeFile(item.id)}
              >
                <XIcon className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}

      {errors.length > 0 ? (
        <Alert variant="destructive">
          <TriangleAlertIcon className="size-4" />
          <AlertTitle>Couldn’t add some files</AlertTitle>
          <AlertDescription>
            {errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
