/**
 * Server-side upload validation helpers.
 *
 * Browsers can lie about MIME types, so we also inspect the file signature
 * ("magic bytes") before accepting a document.
 */
export const DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

const EXTENSIONS: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function extensionForMime(mime: string): string | null {
  return EXTENSIONS[mime] || null;
}

function startsWith(buffer: Buffer, bytes: number[]): boolean {
  if (buffer.length < bytes.length) return false;
  return bytes.every((b, i) => buffer[i] === b);
}

export function matchesMagicBytes(buffer: Buffer, mime: string): boolean {
  switch (mime) {
    case "application/pdf":
      return startsWith(buffer, [0x25, 0x50, 0x44, 0x46]); // %PDF
    case "image/jpeg":
      return startsWith(buffer, [0xff, 0xd8, 0xff]);
    case "image/png":
      return startsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case "image/gif":
      return startsWith(buffer, [0x47, 0x49, 0x46, 0x38]);
    case "image/webp":
      return (
        startsWith(buffer, [0x52, 0x49, 0x46, 0x46]) &&
        buffer.length > 11 &&
        buffer.toString("ascii", 8, 12) === "WEBP"
      );
    case "application/msword":
    case "application/vnd.ms-excel":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      // Legacy Office uses the OLE2 container; OOXML uses a ZIP container.
      return startsWith(buffer, [0xd0, 0xcf, 0x11, 0xe0]) || startsWith(buffer, [0x50, 0x4b]);
    default:
      return false;
  }
}

export function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    // Collapse any dot runs so ".." traversal sequences cannot survive.
    .replace(/\.{2,}/g, "_")
    .replace(/^[._]+/, "")
    .slice(0, 80) || "file";
}
