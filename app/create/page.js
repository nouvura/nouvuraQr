"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Trash2, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import LinkInput from "@/components/LinkInput";
import { LogoUploader, GalleryUploader } from "@/components/ImageUploader";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import { createPortfolio } from "@/lib/portfolioService";

const CATEGORIES = ["Business", "Creative", "Personal"];

export default function CreatePage() {
  const [category, setCategory] = useState("Business");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [additionalPhones, setAdditionalPhones] = useState([]);
  const [links, setLinks] = useState([{ url: "", platform: "" }]);
  const [logoFile, setLogoFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);

  const [status, setStatus] = useState("idle"); // idle | submitting | error | done
  const [errorMessage, setErrorMessage] = useState("");
  const [portfolioId, setPortfolioId] = useState(null);

  function addPhone() {
    setAdditionalPhones([...additionalPhones, ""]);
  }

  function updatePhone(index, value) {
    const next = [...additionalPhones];
    next[index] = value;
    setAdditionalPhones(next);
  }

  function removePhone(index) {
    setAdditionalPhones(additionalPhones.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Give your portfolio a title before continuing.");
      return;
    }
    if (!phone.trim()) {
      setErrorMessage("A primary phone number is required.");
      return;
    }

    setStatus("submitting");
    try {
      const id = await createPortfolio({
        category,
        title,
        description,
        phone,
        additionalPhones,
        links,
        logoFile,
        imageFiles,
      });
      setPortfolioId(id);
      setStatus("done");
    } catch (err) {
      console.error(err);
      setErrorMessage(
        "The portfolio could not be saved. Check your connection and try again."
      );
      setStatus("error");
    }
  }

  if (status === "done" && portfolioId) {
    const portfolioUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/p/${portfolioId}`
        : `/p/${portfolioId}`;

    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-void px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-gilt" strokeWidth={1.5} />
          <h1 className="font-display text-2xl text-bone">Portfolio is live</h1>
          <p className="mt-2 text-sm text-bone-dim">
            Scan, share, or download the code below. It always points to the
            latest version of this page.
          </p>

          <div className="my-8">
            <QRCodeDisplay url={portfolioUrl} filename={`nouvura-${portfolioId}`} />
          </div>

          <div className="rounded-lg border border-void-line bg-void-elevated/60 px-4 py-3 font-mono text-xs text-bone-dim">
            {portfolioUrl}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href={`/p/${portfolioId}`}
              className="rounded-md bg-gilt px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-void transition hover:bg-gilt-bright"
            >
              View portfolio
            </Link>
            <Link
              href="/create"
              onClick={() => window.location.reload()}
              className="rounded-md border border-gilt-dim px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-gilt transition hover:border-gilt"
            >
              Create another
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-void px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-bone-faint transition hover:text-gilt"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>

        <p className="eyebrow mb-3">New portfolio</p>
        <h1 className="mb-10 font-display text-3xl text-bone">
          Build your page
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Category */}
          <div>
            <label className="mb-3 block text-xs uppercase tracking-widest text-bone-dim">
              Category
            </label>
            <div className="flex gap-3">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-md border px-4 py-2 text-xs uppercase tracking-widest transition ${
                    category === c
                      ? "border-gilt bg-gilt/10 text-gilt"
                      : "border-void-line text-bone-dim hover:border-gilt-dim"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="mb-2 block text-xs uppercase tracking-widest text-bone-dim">
              Title / Name
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="NOUVURA Studio"
              className="w-full rounded-lg border border-void-line bg-void-elevated/60 px-4 py-3 text-sm text-bone placeholder:text-bone-faint focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="mb-2 block text-xs uppercase tracking-widest text-bone-dim">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What you do, in a few sentences."
              className="w-full resize-none rounded-lg border border-void-line bg-void-elevated/60 px-4 py-3 text-sm text-bone placeholder:text-bone-faint focus:outline-none"
            />
          </div>

          {/* Logo + Gallery */}
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <label className="mb-3 block text-xs uppercase tracking-widest text-bone-dim">
                Logo
              </label>
              <LogoUploader file={logoFile} onChange={setLogoFile} />
            </div>
            <div>
              <label className="mb-3 block text-xs uppercase tracking-widest text-bone-dim">
                Gallery images
              </label>
              <GalleryUploader files={imageFiles} onChange={setImageFiles} />
            </div>
          </div>

          {/* Phone numbers */}
          <div>
            <label htmlFor="phone" className="mb-2 block text-xs uppercase tracking-widest text-bone-dim">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+213 555 000 000"
              className="w-full rounded-lg border border-void-line bg-void-elevated/60 px-4 py-3 text-sm text-bone placeholder:text-bone-faint focus:outline-none"
            />

            <div className="mt-4 space-y-2">
              {additionalPhones.map((p, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="tel"
                    value={p}
                    onChange={(e) => updatePhone(index, e.target.value)}
                    placeholder="Additional phone"
                    className="flex-1 rounded-lg border border-void-line bg-void-elevated/60 px-4 py-2.5 text-sm text-bone placeholder:text-bone-faint focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removePhone(index)}
                    className="text-bone-faint transition hover:text-oxblood-bright"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addPhone}
                className="flex items-center gap-2 text-xs uppercase tracking-widest text-gilt transition hover:text-gilt-bright"
              >
                <Plus className="h-3.5 w-3.5" /> Add another number
              </button>
            </div>
          </div>

          {/* Links */}
          <div>
            <label className="mb-3 block text-xs uppercase tracking-widest text-bone-dim">
              Links
            </label>
            <LinkInput links={links} onChange={setLinks} />
          </div>

          {errorMessage && (
            <p className="rounded-md border border-oxblood-bright/40 bg-oxblood-deep/30 px-4 py-3 text-sm text-oxblood-bright">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-gilt px-6 py-3.5 text-sm font-semibold uppercase tracking-widest text-void transition hover:bg-gilt-bright disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Generating portfolio…
              </>
            ) : (
              "Generate portfolio & QR"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
