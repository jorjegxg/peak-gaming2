"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getTranslations, type Locale } from "@/lib/translations";

function getLocale(pathname: string): Locale {
  return pathname.startsWith("/en") ? "en" : "ro";
}

export function Header() {
  const pathname = usePathname();
  const locale = getLocale(pathname);
  const base = locale === "en" ? "/en" : "";
  const t = getTranslations(locale);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "ro";
  }, [locale]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const home = base || "/";
  const navLinks = [
    { href: `${home}#games`, label: t.nav.games },
    { href: `${home}#about`, label: t.nav.about },
    { href: base ? "/en/prices" : "/preturi", label: t.nav.prices },
    { href: base ? "/en/reservation" : "/rezervare", label: t.nav.reservation },
  ] as const;

  const linkClass =
    "block py-4 px-4 text-lg font-semibold text-foreground transition-colors hover:text-accent hover:bg-foreground/10 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset rounded-xl";

  return (
    <header className="sticky top-0 z-50 border-b border-accent/30 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/90 led-border-subtle">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href={base || "/"}
          className="text-lg font-bold tracking-tight text-accent led-text sm:text-xl shrink-0"
        >
          Peak Gaming
        </Link>

        {/* Desktop nav */}
        <ul className="hidden sm:flex flex-wrap items-center gap-6 text-sm font-medium text-foreground/90">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="transition-all hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background rounded"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            {locale === "en" ? (
              <Link
                href="/"
                className="transition-all hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background rounded"
              >
                Română
              </Link>
            ) : (
              <Link
                href="/en"
                className="transition-all hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background rounded"
              >
                EN
              </Link>
            )}
          </li>
        </ul>

        {/* Hamburger button - mobile only */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="sm:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg border border-accent/40 bg-foreground/5 text-foreground hover:bg-foreground/10 hover:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-200 ${
              menuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-200 my-1 ${
              menuOpen ? "opacity-0 scale-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-200 ${
              menuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu panel - top offset clears the header so it doesn't overlap the hamburger */}
      <div
        className={`sm:hidden fixed inset-0 top-[60px] z-40 bg-background backdrop-blur-md transition-opacity duration-200 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col gap-2 border-t border-accent/30 bg-black/95 min-h-full">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-accent/30 mt-4 pt-4">
            {locale === "en" ? (
              <Link
                href="/"
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                Română
              </Link>
            ) : (
              <Link
                href="/en"
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                EN
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
