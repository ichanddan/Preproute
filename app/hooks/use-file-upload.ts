"use client";

import {
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
  useCallback,
  useId,
  useRef,
  useState,
} from "react";

export type FileMetadata = {
  name: string;
  size: number;
  type: string;
  url: string;
  id: string;
};

export type FileWithPreview = {
  file: File | FileMetadata;
  id: string;
  preview?: string;
};

export type FileUploadOptions = {
  /** Maximum number of files allowed. */
  maxFiles?: number;
  /** Maximum size per file, in bytes. Defaults to 10 MB. */
  maxSize?: number;
  /** `accept` attribute forwarded to the input (e.g. `"image/*"`). */
  accept?: string;
  /** Allow selecting more than one file. Defaults to `false`. */
  multiple?: boolean;
  /** Files present before any user interaction. */
  initialFiles?: FileMetadata[];
  /** Called whenever the selected file set changes. */
  onFilesChange?: (files: FileWithPreview[]) => void;
};

export type FileUploadState = {
  files: FileWithPreview[];
  isDragging: boolean;
  errors: string[];
};

export type FileUploadActions = {
  addFiles: (files: FileList | File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  clearErrors: () => void;
  handleDragEnter: (e: DragEvent<HTMLElement>) => void;
  handleDragLeave: (e: DragEvent<HTMLElement>) => void;
  handleDragOver: (e: DragEvent<HTMLElement>) => void;
  handleDrop: (e: DragEvent<HTMLElement>) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  openFileDialog: () => void;
  getInputProps: (
    props?: InputHTMLAttributes<HTMLInputElement>,
  ) => InputHTMLAttributes<HTMLInputElement> & {
    ref: React.Ref<HTMLInputElement>;
  };
};

/** Human-readable byte size, e.g. `formatBytes(1536)` → `"1.5 KB"`. */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

function fileKey(file: File | FileMetadata): string {
  return file instanceof File
    ? `${file.name}-${file.size}-${file.lastModified}`
    : file.id;
}

/**
 * Headless file-upload state: handles selection (click + drag/drop),
 * validation (size, count, accepted types), object-URL previews for images,
 * and cleanup. UI is left to the caller (see `~/components/forms/file-upload`).
 */
export function useFileUpload(
  options: FileUploadOptions = {},
): [FileUploadState, FileUploadActions] {
  const {
    maxFiles = Number.POSITIVE_INFINITY,
    maxSize = 10 * 1024 * 1024,
    accept = "*",
    multiple = false,
    initialFiles = [],
    onFilesChange,
  } = options;

  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const counterRef = useRef(0);

  const [state, setState] = useState<FileUploadState>({
    files: initialFiles.map((file) => ({ file, id: file.id })),
    isDragging: false,
    errors: [],
  });

  const nextId = useCallback(() => {
    counterRef.current += 1;
    return `${generatedId}-${counterRef.current}`;
  }, [generatedId]);

  const validateFile = useCallback(
    (file: File | FileMetadata): string | null => {
      const size = file instanceof File ? file.size : file.size;
      if (size > maxSize) {
        return `File "${file.name}" exceeds the maximum size of ${formatBytes(maxSize)}.`;
      }
      if (accept !== "*") {
        const type = file instanceof File ? file.type : file.type;
        const name = file.name;
        const accepted = accept.split(",").map((s) => s.trim());
        const allowed = accepted.some((rule) => {
          if (rule.startsWith(".")) {
            return name.toLowerCase().endsWith(rule.toLowerCase());
          }
          if (rule.endsWith("/*")) {
            return type.startsWith(rule.slice(0, rule.indexOf("/*") + 1));
          }
          return type === rule;
        });
        if (!allowed) {
          return `File "${file.name}" is not an accepted file type.`;
        }
      }
      return null;
    },
    [accept, maxSize],
  );

  const emit = useCallback(
    (files: FileWithPreview[]) => onFilesChange?.(files),
    [onFilesChange],
  );

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const list = Array.from(incoming);
      if (list.length === 0) return;

      setState((prev) => {
        const errors: string[] = [];
        const existingKeys = new Set(prev.files.map((f) => fileKey(f.file)));
        let accepted: FileWithPreview[] = [];

        for (const file of list) {
          if (existingKeys.has(fileKey(file))) continue;

          const error = validateFile(file);
          if (error) {
            errors.push(error);
            continue;
          }
          accepted.push({
            file,
            id: nextId(),
            preview: file.type.startsWith("image/")
              ? URL.createObjectURL(file)
              : undefined,
          });
          existingKeys.add(fileKey(file));
        }

        // Single-file mode keeps only the latest selection.
        let combined = multiple ? [...prev.files, ...accepted] : accepted;

        if (combined.length > maxFiles) {
          errors.push(
            `You can upload at most ${maxFiles} file${maxFiles === 1 ? "" : "s"}.`,
          );
          // Revoke previews for the overflow we are dropping.
          combined
            .slice(maxFiles)
            .forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
          combined = combined.slice(0, maxFiles);
        }

        if (!multiple) {
          // Revoke any previous single-file preview being replaced.
          prev.files.forEach(
            (f) => f.preview && URL.revokeObjectURL(f.preview),
          );
        }

        emit(combined);
        return { ...prev, files: combined, errors };
      });
    },
    [emit, maxFiles, multiple, nextId, validateFile],
  );

  const removeFile = useCallback(
    (id: string) => {
      setState((prev) => {
        const removed = prev.files.find((f) => f.id === id);
        if (removed?.preview) URL.revokeObjectURL(removed.preview);
        const files = prev.files.filter((f) => f.id !== id);
        emit(files);
        return { ...prev, files, errors: [] };
      });
    },
    [emit],
  );

  const clearFiles = useCallback(() => {
    setState((prev) => {
      prev.files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
      if (inputRef.current) inputRef.current.value = "";
      emit([]);
      return { ...prev, files: [], errors: [] };
    });
  }, [emit]);

  const clearErrors = useCallback(() => {
    setState((prev) => ({ ...prev, errors: [] }));
  }, []);

  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setState((prev) => ({ ...prev, isDragging: false }));
      if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) addFiles(e.target.files);
      // Reset so selecting the same file again re-fires change.
      e.target.value = "";
    },
    [addFiles],
  );

  const openFileDialog = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const getInputProps = useCallback(
    (props: InputHTMLAttributes<HTMLInputElement> = {}) => ({
      type: "file" as const,
      accept,
      multiple,
      ...props,
      ref: inputRef,
      onChange: handleFileChange,
    }),
    [accept, handleFileChange, multiple],
  );

  return [
    state,
    {
      addFiles,
      removeFile,
      clearFiles,
      clearErrors,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      handleFileChange,
      openFileDialog,
      getInputProps,
    },
  ];
}
