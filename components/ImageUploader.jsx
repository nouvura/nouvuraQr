"use client";

import { useRef } from "react";
import { UploadCloud, X } from "lucide-react";

export function LogoUploader({ file, onChange }) {
  const inputRef = useRef(null);
  const previewUrl = file ? URL.createObjectURL(file) : null;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
      <div
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gilt-dim bg-void-elevated/60 text-bone-dim transition hover:border-gilt hover:text-gilt"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Logo preview"
            className="h-full w-full rounded-xl object-cover"
          />
        ) : (
          <>
            <UploadCloud className="h-6 w-6" />
            <span className="text-[10px] uppercase tracking-widest">Logo</span>
          </>
        )}
      </div>
      {file && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="mt-2 flex items-center gap-1 text-[11px] text-bone-faint hover:text-oxblood-bright"
        >
          <X className="h-3 w-3" /> Remove
        </button>
      )}
    </div>
  );
}

export function GalleryUploader({ files, onChange }) {
  const inputRef = useRef(null);

  function handleAdd(e) {
    const newFiles = Array.from(e.target.files || []);
    onChange([...files, ...newFiles]);
    e.target.value = "";
  }

  function removeAt(index) {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleAdd}
      />
      <div className="flex flex-wrap gap-3">
        {files.map((file, index) => (
          <div key={index} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-void-line">
            <img
              src={URL.createObjectURL(file)}
              alt={`Gallery upload ${index + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="absolute right-1 top-1 rounded-full bg-black/70 p-0.5 text-bone opacity-0 transition group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <div
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gilt-dim text-bone-dim transition hover:border-gilt hover:text-gilt"
        >
          <UploadCloud className="h-5 w-5" />
          <span className="text-[9px] uppercase tracking-widest">Add</span>
        </div>
      </div>
    </div>
  );
}
