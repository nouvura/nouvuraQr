"use client";

import { Plus, Trash2 } from "lucide-react";
import { detectPlatform } from "@/lib/platformDetect";
import PlatformIcon from "./PlatformIcon";

export default function LinkInput({ links, onChange }) {
  function updateLink(index, field, value) {
    const next = [...links];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  }

  function addLink() {
    onChange([...links, { url: "", platform: "" }]);
  }

  function removeLink(index) {
    onChange(links.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {links.map((link, index) => {
        const resolvedPlatform = link.platform || detectPlatform(link.url);
        return (
          <div
            key={index}
            className="flex items-center gap-2 rounded-lg border border-void-line bg-void-elevated/60 px-3 py-2"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-void-soft text-gilt">
              <PlatformIcon platform={resolvedPlatform} className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="https://instagram.com/yourbrand"
              value={link.url}
              onChange={(e) => updateLink(index, "url", e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm text-bone placeholder:text-bone-faint focus:outline-none"
            />
            <input
              type="text"
              placeholder={resolvedPlatform}
              value={link.platform}
              onChange={(e) => updateLink(index, "platform", e.target.value)}
              className="w-28 shrink-0 border-l border-void-line bg-transparent pl-2 text-xs text-bone-dim placeholder:text-bone-faint focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeLink(index)}
              aria-label="Remove link"
              className="shrink-0 text-bone-faint transition hover:text-oxblood-bright"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      })}
      <button
        type="button"
        onClick={addLink}
        className="flex items-center gap-2 text-xs uppercase tracking-widest text-gilt transition hover:text-gilt-bright"
      >
        <Plus className="h-3.5 w-3.5" /> Add another link
      </button>
    </div>
  );
}
