"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";

export default function QRCodeDisplay({ url, filename = "nouvura-qr" }) {
  const canvasRef = useRef(null);
  const [svgMarkup, setSvgMarkup] = useState("");

  const qrOptions = {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 480,
    color: {
      dark: "#0b0b0d",
      light: "#EDEAE3",
    },
  };

  useEffect(() => {
    if (!url) return;
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, qrOptions).catch(console.error);
    }
    QRCode.toString(url, { ...qrOptions, type: "svg" })
      .then(setSvgMarkup)
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  function downloadPng() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function downloadSvg() {
    if (!svgMarkup) return;
    const blob = new Blob([svgMarkup], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.download = `${filename}.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="qr-frame rounded-2xl border border-gilt-dim bg-bone p-4 shadow-gilt">
        <canvas ref={canvasRef} className="block h-52 w-52" />
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={downloadPng}
          className="flex items-center gap-2 rounded-md border border-gilt-dim px-4 py-2 text-xs uppercase tracking-widest text-gilt transition hover:border-gilt hover:bg-gilt/10"
        >
          <Download className="h-3.5 w-3.5" /> PNG
        </button>
        <button
          type="button"
          onClick={downloadSvg}
          className="flex items-center gap-2 rounded-md border border-gilt-dim px-4 py-2 text-xs uppercase tracking-widest text-gilt transition hover:border-gilt hover:bg-gilt/10"
        >
          <Download className="h-3.5 w-3.5" /> SVG
        </button>
      </div>
    </div>
  );
}
