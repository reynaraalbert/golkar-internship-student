"use client";

import React, { useRef, useState } from "react";
import { Upload, X, FileText, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react";

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  accept?: "image" | "document" | "all";
  label?: string;
  className?: string;
  /** Max file size in bytes. Defaults: image=2MB, document=5MB */
  maxSizeBytes?: number;
}

const IMAGE_MAX = 2 * 1024 * 1024;   // 2 MB → keeps base64 reasonable
const DOC_MAX   = 5 * 1024 * 1024;   // 5 MB

const ACCEPT_MAP = {
  image:    "image/jpeg,image/png,image/webp,image/gif",
  document: "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  all:      "image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

/** Compress image in-browser before base64 encoding. Target ~800px wide, quality 0.75. */
async function compressImage(file: File, maxWidth = 800, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale  = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = reject;
    img.src = url;
  });
}

/** Convert any file to a data-URL via FileReader. */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function FileUpload({
  value,
  onChange,
  accept = "image",
  label,
  className = "",
  maxSizeBytes,
}: FileUploadProps) {
  const inputRef   = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError  ] = useState<string | null>(null);

  const maxBytes = maxSizeBytes ?? (accept === "image" ? IMAGE_MAX : DOC_MAX);

  const handleFile = async (file: File) => {
    setError(null);

    if (file.size > maxBytes) {
      setError(`File terlalu besar (${(file.size / 1024 / 1024).toFixed(1)} MB). Maks. ${(maxBytes / 1024 / 1024).toFixed(0)} MB.`);
      return;
    }

    setLoading(true);
    try {
      let dataUrl: string;
      if (file.type.startsWith("image/")) {
        // Compress images before encoding to keep stored text size manageable
        dataUrl = await compressImage(file);
      } else {
        dataUrl = await fileToDataUrl(file);
      }
      onChange(dataUrl);
    } catch {
      setError("Gagal memproses file. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  // Detect previews: both remote URLs and local data-URLs
  const isImage = value && (
    /\.(jpg|jpeg|png|webp|gif|svg)/i.test(value) ||
    value.startsWith("data:image/")
  );
  const isPdf   = value && (
    /\.pdf/i.test(value) ||
    value.startsWith("data:application/pdf")
  );

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{label}</label>
      )}

      {value ? (
        <div className="relative border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Preview" className="w-full h-40 object-cover" />
          ) : isPdf ? (
            <div className="w-full h-40 flex items-center justify-center bg-slate-50 dark:bg-slate-800">
              <div className="text-center space-y-2">
                <FileText className="w-10 h-10 text-red-500 mx-auto" />
                <span className="text-xs text-slate-500 font-semibold">PDF Document</span>
              </div>
            </div>
          ) : (
            <div className="w-full h-40 flex items-center justify-center bg-slate-50 dark:bg-slate-800">
              <div className="text-center space-y-2">
                <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                <span className="text-xs text-slate-500 font-semibold">
                  {value.startsWith("data:") ? "Dokumen" : value.split("/").pop()}
                </span>
              </div>
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              type="button"
              onClick={() => { onChange(""); setError(null); }}
              className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="absolute bottom-2 left-2">
            <span className="px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-md">
              <CheckCircle2 className="w-3 h-3" /> Tersimpan
            </span>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => !loading && inputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
        >
          {loading ? (
            <div className="space-y-2">
              <Loader2 className="w-8 h-8 text-dpr-emerald dark:text-dpr-gold mx-auto animate-spin" />
              <p className="text-xs text-slate-500 font-semibold">Memproses gambar…</p>
            </div>
          ) : (
            <div className="space-y-2">
              {accept === "image" ? (
                <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 group-hover:text-dpr-emerald dark:group-hover:text-dpr-gold mx-auto transition-colors" />
              ) : (
                <Upload className="w-8 h-8 text-slate-300 dark:text-slate-600 group-hover:text-dpr-emerald dark:group-hover:text-dpr-gold mx-auto transition-colors" />
              )}
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Klik atau seret file ke sini
              </p>
              <p className="text-[10px] text-slate-400">
                {accept === "image"
                  ? `PNG, JPG, WEBP — maks. ${(maxBytes / 1024 / 1024).toFixed(0)} MB (dikompres otomatis)`
                  : accept === "document"
                  ? `PDF, DOCX, XLSX — maks. ${(maxBytes / 1024 / 1024).toFixed(0)} MB`
                  : `Gambar atau Dokumen — maks. ${(maxBytes / 1024 / 1024).toFixed(0)} MB`}
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-[11px] text-red-500 font-semibold">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_MAP[accept]}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
