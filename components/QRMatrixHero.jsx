"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

// Deterministic pseudo-random matrix so the hero looks like a real QR code
// resolving into focus, without depending on client-only Math.random at SSR time.
function buildMatrix(size, seed) {
  let value = seed;
  const rand = () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
  const cells = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      // Bias the border into "finder pattern" style solid blocks like a real QR code
      const isCorner =
        (row < 6 && col < 6) ||
        (row < 6 && col > size - 7) ||
        (row > size - 7 && col < 6);
      const filled = isCorner ? (row === 0 || col === 0 || row === 5 || col === 5 || (row > 1 && row < 4 && col > 1 && col < 4) || (row > 1 && row < 4 && col > size - 5 && col < size - 2) || (row > size - 5 && row < size - 2 && col > 1 && col < 4)) : rand() > 0.58;
      cells.push(filled);
    }
  }
  return cells;
}

export default function QRMatrixHero({ size = 21 }) {
  const cells = useMemo(() => buildMatrix(size, 42), [size]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div
        className="grid h-full w-full gap-[2px] rounded-2xl border border-gilt-dim/40 bg-void-elevated/40 p-4 shadow-blood"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {cells.map((filled, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: filled ? 1 : 0.06 }}
            transition={{
              delay: (i % size) * 0.012 + Math.floor(i / size) * 0.012,
              duration: 0.5,
            }}
            className={filled ? "bg-gilt" : "bg-bone-faint"}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-oxblood-bright/25 to-transparent animate-scanline" />
      </div>
    </div>
  );
}
