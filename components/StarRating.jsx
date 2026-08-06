"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function StarRating({ onSubmit, disabled }) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  async function handleClick(value) {
    if (disabled || submitted) return;
    setSelected(value);
    setSubmitted(true);
    await onSubmit(value);
  }

  if (submitted) {
    return (
      <p className="text-sm text-gilt">Thanks — your rating was recorded.</p>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          disabled={disabled}
          onMouseEnter={() => setHovered(value)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => handleClick(value)}
          aria-label={`Rate ${value} out of 5`}
          className="transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Star
            className="h-6 w-6"
            strokeWidth={1.5}
            fill={(hovered || selected) >= value ? "#C9A24B" : "none"}
            stroke={(hovered || selected) >= value ? "#C9A24B" : "#5C5852"}
          />
        </button>
      ))}
    </div>
  );
}
