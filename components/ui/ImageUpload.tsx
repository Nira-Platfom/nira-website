"use client";
import { useRef, useState } from "react";
import { Camera, ImageOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  imageUrl?: string | null;
  onUpload: (file: File) => Promise<void>;
  disabled?: boolean;
  disabledHint?: string;
  className?: string;
}

export default function ImageUpload({ imageUrl, onUpload, disabled, disabledHint, className }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("relative", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <button
        type="button"
        disabled={disabled || uploading}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "group relative w-full h-32 rounded-lg overflow-hidden border transition-colors",
          imageUrl ? "border-slate-200" : "border-2 border-dashed border-slate-200 hover:border-coral",
          disabled && "cursor-not-allowed opacity-60",
          !disabled && "cursor-pointer"
        )}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
        ) : disabled ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-page">
            <ImageOff size={20} className="text-slate-300" />
            <span className="text-[12px] text-slate-400">No photo yet</span>
          </div>
        ) : (
          <div className="w-full h-full bg-page" />
        )}

        {!disabled && (
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-charcoal/0 transition-all",
              imageUrl ? "group-hover:bg-charcoal/50 opacity-0 group-hover:opacity-100" : "opacity-100"
            )}
          >
            {uploading ? (
              <Loader2 size={20} className={cn("animate-spin", imageUrl ? "text-white" : "text-coral")} />
            ) : (
              <>
                <Camera size={18} className={imageUrl ? "text-white" : "text-coral"} />
                <span className={cn("text-[12px] font-medium", imageUrl ? "text-white" : "text-coral")}>
                  {imageUrl ? "Change photo" : "Add photo"}
                </span>
              </>
            )}
          </div>
        )}
      </button>
      {disabled && disabledHint && <p className="text-[11px] text-slate-400 mt-1.5">{disabledHint}</p>}
      {!disabled && !imageUrl && <p className="text-[11px] text-slate-400 mt-1.5">Optional — customers see this in WhatsApp when they ask about it.</p>}
    </div>
  );
}
