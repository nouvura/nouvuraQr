"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { getPortfolio, submitRating } from "@/lib/portfolioService";
import { normalizeUrl, detectPlatform } from "@/lib/platformDetect";
import PlatformIcon from "@/components/PlatformIcon";
import StarRating from "@/components/StarRating";

// Each category nudges the accent + hero tone without changing the underlying structure.
const CATEGORY_THEME = {
  Business: {
    accent: "text-gilt",
    ring: "border-gilt-dim",
    glow: "shadow-gilt",
    tag: "Business Profile",
  },
  Creative: {
    accent: "text-oxblood-bright",
    ring: "border-oxblood",
    glow: "shadow-blood",
    tag: "Creative Portfolio",
  },
  Personal: {
    accent: "text-bone",
    ring: "border-bone-faint",
    glow: "",
    tag: "Personal Page",
  },
};

export default function PortfolioPage({ params }) {
  const { id } = params;
  const [portfolio, setPortfolio] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | notfound | error

  useEffect(() => {
    let active = true;
    getPortfolio(id)
      .then((data) => {
        if (!active) return;
        if (!data) {
          setStatus("notfound");
        } else {
          setPortfolio(data);
          setStatus("ready");
        }
      })
      .catch((err) => {
        console.error(err);
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-void">
        <Loader2 className="h-6 w-6 animate-spin text-gilt" />
      </main>
    );
  }

  if (status === "notfound") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-void px-6 text-center">
        <h1 className="font-display text-2xl text-bone">Page not found</h1>
        <p className="text-sm text-bone-dim">
          This QR code doesn&apos;t resolve to a portfolio. It may have been removed.
        </p>
        <Link href="/" className="text-xs uppercase tracking-widest text-gilt">
          Return home
        </Link>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-void px-6 text-center">
        <h1 className="font-display text-2xl text-bone">Something went wrong</h1>
        <p className="text-sm text-bone-dim">Couldn&apos;t reach the database. Try again shortly.</p>
      </main>
    );
  }

  const theme = CATEGORY_THEME[portfolio.category] || CATEGORY_THEME.Business;

  async function handleRate(value) {
    await submitRating(id, value);
    const refreshed = await getPortfolio(id);
    setPortfolio(refreshed);
  }

  return (
    <main className="min-h-screen bg-void pb-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-aurora-gold" />

      <div className="relative mx-auto max-w-2xl px-6 pt-16">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-1 text-xs uppercase tracking-widest text-bone-faint transition hover:text-gilt"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Nouvura
        </Link>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {portfolio.logoUrl ? (
            <img
              src={portfolio.logoUrl}
              alt={`${portfolio.title} logo`}
              className={`mx-auto mb-6 h-24 w-24 rounded-2xl border object-cover ${theme.ring} ${theme.glow}`}
            />
          ) : (
            <div
              className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border font-display text-xl ${theme.ring} ${theme.accent}`}
            >
              {portfolio.title?.[0]?.toUpperCase() || "N"}
            </div>
          )}

          <p className={`eyebrow mb-2 ${theme.accent}`}>{theme.tag}</p>
          <h1 className="font-display text-3xl text-bone sm:text-4xl">
            {portfolio.title}
          </h1>

          {portfolio.description && (
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-bone-dim">
              {portfolio.description}
            </p>
          )}

          <a
            href={`tel:${portfolio.phone}`}
            className={`mt-6 inline-flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm ${theme.ring} ${theme.accent} transition hover:bg-white/5`}
          >
            <Phone className="h-4 w-4" /> {portfolio.phone}
          </a>

          {portfolio.additionalPhones?.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              {portfolio.additionalPhones.map((p, i) => (
                <a
                  key={i}
                  href={`tel:${p}`}
                  className="text-xs text-bone-dim underline decoration-void-line underline-offset-4 hover:text-gilt"
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </motion.section>

        <div className="hairline my-12" />

        {/* Links */}
        {portfolio.links?.length > 0 && (
          <section className="mb-12">
            <p className="eyebrow mb-4">Links</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {portfolio.links.map((link, i) => {
                const platform = link.platform || detectPlatform(link.url);
                return (
                  <a
                    key={i}
                    href={normalizeUrl(link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-void-line bg-void-elevated/50 px-4 py-3 text-sm text-bone transition hover:border-gilt-dim hover:bg-void-elevated"
                  >
                    <PlatformIcon platform={platform} className="h-4 w-4 shrink-0 text-gilt" />
                    <span className="truncate">{platform}</span>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* Gallery */}
        {portfolio.images?.length > 0 && (
          <section className="mb-12">
            <p className="eyebrow mb-4">Gallery</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {portfolio.images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${portfolio.title} gallery image ${i + 1}`}
                  className="aspect-square w-full rounded-lg object-cover"
                  loading="lazy"
                />
              ))}
            </div>
          </section>
        )}

        <div className="hairline my-12" />

        {/* Rating */}
        <section className="text-center">
          <p className="eyebrow mb-4">Rate this page</p>
          <div className="flex flex-col items-center gap-3">
            <StarRating onSubmit={handleRate} />
            <p className="text-xs text-bone-dim">
              {portfolio.ratingCount > 0
                ? `${portfolio.ratingAverage.toFixed(1)} average · ${portfolio.ratingCount} rating${
                    portfolio.ratingCount === 1 ? "" : "s"
                  }`
                : "No ratings yet"}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
