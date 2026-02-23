"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Translations } from "@/lib/translations";

type Props = { t: Translations; basePath?: string };

export function PricesContent({ t, basePath = "" }: Props) {
  const p = t.pricesPage;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative min-h-screen bg-grid-led bg-background overflow-hidden">
      {/* Subtle corner accent */}
      <div className="pointer-events-none absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />

      <section className="relative px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-4xl">
          {/* Hero title - game menu style */}
          <div className="text-center mb-6">
            <div className="inline-block rounded-lg border border-accent/40 bg-foreground/5 px-4 py-1.5 mb-4">
              <span className="text-xs font-medium uppercase tracking-widest text-accent">
                🎮 Gaming rates
              </span>
            </div>
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
              <span className="text-accent led-text">{p.title}</span>
            </h1>
            <p className="mt-3 text-foreground/70 max-w-xl mx-auto">{p.subtitle}</p>
          </div>

          {/* Main rates - two tier cards side by side (game-style tiers) */}
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/60 mb-4 px-1">
              {p.gamingRates}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Classic tier */}
              <div className="group relative rounded-xl border-2 border-accent/50 bg-linear-to-b from-foreground/10 to-foreground/5 p-6 led-border-subtle overflow-hidden transition hover:border-accent/70">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-bl-full" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20 text-lg">👑</span>
                    <h3 className="text-lg font-bold text-foreground">{p.classic}</h3>
                  </div>
                  <ul className="space-y-3">
                    {[p.classic1h, p.classic2h, p.classic3h, p.classic5h].map((text, i) => (
                      <li
                        key={i}
                        className="rounded-lg border border-white/10 bg-background/50 px-3 py-2.5 text-foreground/90 text-sm"
                      >
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pupil/Student tier */}
              <div className="group relative rounded-xl border-2 border-accent/40 bg-linear-to-b from-foreground/10 to-foreground/5 p-6 overflow-hidden transition hover:led-border-subtle hover:border-accent/60">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-lg">🎓</span>
                    <h3 className="text-lg font-bold text-foreground">{p.pupilStudent}</h3>
                  </div>
                  <ul className="space-y-3">
                    {[p.pupil1h, p.pupil2h, p.pupil3h, p.pupil5h].map((text, i) => (
                      <li
                        key={i}
                        className="rounded-lg border border-white/10 bg-background/50 px-3 py-2.5 text-foreground/90 text-sm"
                      >
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Special offer - event / limited time style */}
          <div className="relative rounded-xl border-2 border-accent/60 bg-linear-to-br from-accent/20 via-accent/10 to-transparent p-6 led-glow overflow-hidden">
            <div className="absolute inset-0 bg-grid-led opacity-30" />
            <div className="absolute top-2 right-2 rounded bg-accent/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
              Limited time
            </div>
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/30 text-2xl">⏰</span>
                <div>
                  <h3 className="text-lg font-bold text-accent led-text">{p.specialOffer}</h3>
                  <p className="text-sm text-foreground/70 mt-0.5">12:00 – 16:00</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 sm:gap-8">
                <div className="flex items-center gap-2 rounded-lg border border-accent/40 bg-background/60 px-4 py-3">
                  <span className="text-foreground/80 text-sm">PC</span>
                  <span className="font-bold text-accent led-text text-xl">12 lei/h</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-accent/40 bg-background/60 px-4 py-3">
                  <span className="text-foreground/80 text-sm">PS</span>
                  <span className="font-bold text-accent led-text text-xl">20 lei/h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Back link - HUD style */}
          <div className="mt-6 flex justify-center">
            <Link
              href={basePath || "/"}
              className="inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-foreground/5 px-5 py-2.5 text-sm font-medium text-foreground/90 transition hover:border-accent/60 hover:text-accent hover:led-border-subtle"
            >
              ← {p.back}
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-accent/20 px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-6xl flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href={basePath || "/"} className="font-semibold text-accent led-text">
            Peak Gaming
          </Link>
          <p className="text-sm text-foreground/60">
            © {new Date().getFullYear()} Peak Gaming. {t.footer.rights}
          </p>
        </div>
      </footer>
    </main>
  );
}
