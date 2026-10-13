"use client";

import { useState } from "react";
import MediaLibraryModal from "@/components/MediaLibraryModal";
import { MediaFilter, MediaItem } from "@/lib/media";

type Props = {
  onSelect: (urls: string[], items: MediaItem[]) => void;
  multiple?: boolean;
  accept?: MediaFilter;
  label?: string;
  className?: string;
  disabled?: boolean;
};

export default function MediaPickerButton({ onSelect, multiple = false, accept = "image", label = "Choose from Library", className, disabled }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
        className={className ?? "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border border-meewa-red text-meewa-red bg-white hover:bg-red-50 disabled:opacity-50 whitespace-nowrap"}
      >
        {label}
      </button>
      {/* Mounted only while open so selection and filters start fresh each time */}
      {open && (
        <MediaLibraryModal
          open
          onClose={() => setOpen(false)}
          multiple={multiple}
          accept={accept}
          onSelect={items => onSelect(items.map(i => i.url), items)}
        />
      )}
    </>
  );
}
