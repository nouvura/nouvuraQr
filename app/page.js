import Link from "next/link";
import { ArrowRight, ScanLine, Images, Star } from "lucide-react";
import QRMatrixHero from "@/components/QRMatrixHero";

const FEATURES = [
  {
    icon: ScanLine,
    title: "One scan, full presence",
    body: "Every link, number and platform you use, resolved behind a single QR code.",
  },
  {
    icon: Images,
    title: "A page, not a card",
    body: "Logo, description and gallery arranged automatically into a portfolio built for your category.",
  },
  {
    icon: Star,
    title: "Proof, in real time",
    body: "Visitors rate what they see. The average travels with the page, forever current.",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-void">
      <div className="pointer-events-none absolute inset-0 bg-aurora-red" />
      <div className="pointer-events-none absolute inset-0 bg-aurora-gold" />

      <section className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 pb-24 pt-28 lg:grid-cols-2 lg:pt-36">
        <div>
          <p className="eyebrow mb-6">Nouvura Studio — QR Division</p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] text-bone sm:text-5xl lg:text-6xl">
            Your presence,
            <br />
            <span className="text-gilt">resolved</span> into one code.
          </h1>
          <p className="mt-6 max-w-md font-body text-lg text-bone-dim">
            NOUVURA QR turns your links, contact and gallery into a cinematic
            portfolio page — and a QR code built to be scanned once and
            remembered.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/create"
              className="group flex items-center gap-2 rounded-md bg-gilt px-6 py-3 text-sm font-semibold uppercase tracking-widest text-void transition hover:bg-gilt-bright"
            >
              Create QR Portfolio
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <span className="text-xs uppercase tracking-widest text-bone-faint">
              No account needed
            </span>
          </div>

          <div className="hairline my-12 max-w-md" />

          <div className="grid gap-6 sm:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <Icon className="mb-3 h-5 w-5 text-oxblood-bright" strokeWidth={1.5} />
                <p className="mb-1 text-sm font-semibold text-bone">{title}</p>
                <p className="text-xs leading-relaxed text-bone-dim">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <QRMatrixHero />
          <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-bone-faint">
            resolving your identity —
          </p>
        </div>
      </section>

      <footer className="relative border-t border-void-line px-6 py-8 text-center text-[11px] uppercase tracking-widest text-bone-faint">
        NOUVURA QR — a creative studio product
      </footer>
    </main>
  );
}
