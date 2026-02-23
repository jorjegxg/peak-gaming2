"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Translations } from "@/lib/translations";
import {
  getReservationsForDate,
  getReservedStationsForSlot,
  getDayCalendarGrid,
  DAY_HOURS,
  saveReservation,
  type Reservation,
} from "@/lib/reservations";
import { useAuth } from "@/context/AuthContext";

const PS5_IMAGE = "/playstation.jpg";
const PC_IMAGE = "/pc.jpg";

const HOURS = Array.from({ length: 13 }, (_, i) => 12 + i);

type Props = { t: Translations; basePath?: string };

function DayCalendarTable({
  title,
  stationCount,
  grid,
  t,
}: {
  title: string;
  stationCount: number;
  grid: Record<number, Record<number, Reservation | null>>;
  t: Translations;
}) {
  const stations = Array.from({ length: stationCount }, (_, i) => i + 1);
  return (
    <div className="overflow-x-auto">
      <h4 className="text-sm font-semibold text-accent mb-2">{title}</h4>
      <table className="w-full min-w-[320px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-accent/30">
            <th className="text-left py-2 pr-3 font-medium text-foreground/80 w-14">{t.reservation.time}</th>
            {stations.map((s) => (
              <th key={s} className="py-2 px-1 text-center font-medium text-foreground/80 w-20">
                #{s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DAY_HOURS.map((h) => (
            <tr key={h} className="border-b border-foreground/10 hover:bg-foreground/5">
              <td className="py-1.5 pr-3 text-foreground/70 tabular-nums">
                {String(h).padStart(2, "0")}:00
              </td>
              {stations.map((s) => {
                const r = grid[h][s];
                return (
                  <td key={s} className="py-1.5 px-1 text-center">
                    {r ? (
                      <span className="inline-block max-w-full truncate rounded bg-accent/20 px-1.5 py-0.5 text-foreground" title={r.name}>
                        {r.name}
                      </span>
                    ) : (
                      <span className="text-foreground/30">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ReservationContent({ t, basePath = "" }: Props) {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const [type, setType] = useState<"ps5" | "pc" | null>(null);
  const [selectedStations, setSelectedStations] = useState<number[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("1");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.email && !email) setEmail(user.email);
    if (user.displayName && !name) setName(user.displayName);
  }, [user]);

  const maxStation = type === "ps5" ? 5 : type === "pc" ? 9 : 0;
  const stations = maxStation > 0 ? Array.from({ length: maxStation }, (_, i) => i + 1) : [];

  const displayDate = date || new Date().toISOString().slice(0, 10);
  const reservedForDate = reservations;
  const reservedStationNums =
    type && time && duration
      ? getReservedStationsForSlot(reservations, type, time, Number(duration))
      : [];

  useEffect(() => {
    let cancelled = false;
    getReservationsForDate(displayDate).then((list) => {
      if (!cancelled) setReservations(list);
    });
    return () => {
      cancelled = true;
    };
  }, [displayDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !type || selectedStations.length === 0 || !time || !name || !phone || !email) return;
    const reservationDate = displayDate;
    for (const station of selectedStations) {
      await saveReservation({
        type,
        station,
        date: reservationDate,
        time,
        duration: Number(duration),
        name,
        phone,
        email,
        userId: user.uid,
      });
    }
    const next = await getReservationsForDate(reservationDate);
    setReservations(next);
    setSubmitted(true);
    setSelectedStations([]);
  };

  return (
    <main className="relative min-h-screen bg-grid-led bg-background">
      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            <span className="text-accent led-text">{t.reservation.title}</span>
          </h1>
          <p className="mt-2 text-foreground/70">{t.reservation.subtitle}</p>

          {!authLoading && user && (
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <span className="text-foreground/70">
                {t.reservation.signedInAs} <strong className="text-foreground">{user.email ?? user.displayName ?? user.uid}</strong>
              </span>
              <button
                type="button"
                onClick={() => signOut()}
                className="rounded-lg border border-accent/40 bg-transparent px-4 py-2 text-accent hover:bg-accent/10 transition"
              >
                {t.reservation.signOut}
              </button>
            </div>
          )}

          {!authLoading && !user && (
            <div className="mt-6 rounded-xl border border-accent/40 bg-accent/5 p-6 text-center">
              <p className="text-foreground/90 mb-4">{t.reservation.signInToReserve}</p>
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-gray-800 font-medium shadow hover:bg-gray-100 transition border border-gray-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {t.reservation.signInWithGoogle}
              </button>
            </div>
          )}

          {submitted && (
            <div className="mt-6 rounded-xl border border-accent/50 bg-accent/10 px-4 py-3 text-accent font-medium">
              {t.reservation.successMessage}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <label htmlFor="calendar-date" className="text-sm font-medium text-foreground/90">
              {t.reservation.reservedSlotsFor}
            </label>
            <input
              id="calendar-date"
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              value={displayDate}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-accent/30 bg-background px-4 py-2.5 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          <div className="mt-4 rounded-xl border border-accent/40 bg-foreground/5 p-4">
            <h3 className="font-semibold text-accent led-text mb-4">
              {t.reservation.reservedSlots} — {displayDate}
            </h3>
            {reservedForDate.length === 0 ? (
              <p className="text-sm text-foreground/70">{t.reservation.reservedSlotsEmpty}</p>
            ) : (() => {
              const { ps5, pc } = getDayCalendarGrid(reservations);
              return (
                <div className="space-y-6">
                  <DayCalendarTable title={t.reservation.ps5Label} stationCount={5} grid={ps5} t={t} />
                  <DayCalendarTable title={t.reservation.pcLabel} stationCount={9} grid={pc} t={t} />
                </div>
              );
            })()}
          </div>

          {user && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground/90 mb-3">
                {t.reservation.selectType}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setType("ps5");
                    setSelectedStations([]);
                  }}
                  className={`relative overflow-hidden rounded-xl border-2 p-6 text-left transition ${
                    type === "ps5"
                      ? "border-accent bg-accent/10 led-border-subtle"
                      : "border-accent/40 bg-foreground/5 hover:border-accent/60 hover:led-border-subtle"
                  }`}
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                    <Image
                      src={PS5_IMAGE}
                      alt="PS5"
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                  <span className="font-semibold text-foreground">{t.reservation.ps5Label}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType("pc");
                    setSelectedStations([]);
                  }}
                  className={`relative overflow-hidden rounded-xl border-2 p-6 text-left transition ${
                    type === "pc"
                      ? "border-accent bg-accent/10 led-border-subtle"
                      : "border-accent/40 bg-foreground/5 hover:border-accent/60 hover:led-border-subtle"
                  }`}
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                    <Image
                      src={PC_IMAGE}
                      alt="PC"
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                  <span className="font-semibold text-foreground">{t.reservation.pcLabel}</span>
                </button>
              </div>
            </div>

            <p className="text-sm text-foreground/80">
              {t.reservation.reservedSlotsFor} <strong className="text-foreground">{displayDate}</strong>
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-foreground/90 mb-2">
                  {t.reservation.time} <span className="text-accent">*</span>
                </label>
                <select
                  id="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-lg border border-accent/30 bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  <option value="">--</option>
                  {HOURS.map((h) => {
                    const timeVal = `${String(h).padStart(2, "0")}:00`;
                    return (
                      <option key={h} value={timeVal}>
                        {timeVal}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-foreground/90 mb-2">
                  {t.reservation.duration}
                </label>
                <select
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full rounded-lg border border-accent/30 bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  <option value="1">{t.reservation.duration1h}</option>
                  <option value="2">{t.reservation.duration2h}</option>
                  <option value="3">{t.reservation.duration3h}</option>
                  <option value="4">{t.reservation.duration4h}</option>
                </select>
              </div>
            </div>

            {type && (
              <div>
                <label className="block text-sm font-medium text-foreground/90 mb-3">
                  {type === "ps5" ? t.reservation.selectStation : t.reservation.selectStations} ({type === "ps5" ? t.reservation.ps5Label : t.reservation.pcLabel})
                </label>
                <div className="flex flex-wrap gap-3">
                  {stations.map((num) => {
                    const isReserved = reservedStationNums.includes(num);
                    const isSelected = selectedStations.includes(num);
                    const toggleStation = () => {
                      if (isReserved) return;
                      if (type === "ps5") {
                        setSelectedStations(isSelected ? [] : [num]);
                      } else {
                        setSelectedStations((prev) =>
                          isSelected ? prev.filter((s) => s !== num) : [...prev, num].sort((a, b) => a - b)
                        );
                      }
                    };
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={toggleStation}
                        disabled={isReserved}
                        title={isReserved ? t.reservation.stationReserved : t.reservation.stationAvailable}
                        className={`w-14 h-14 rounded-xl border-2 font-bold text-lg transition flex flex-col items-center justify-center gap-0.5 ${
                          isReserved
                            ? "border-foreground/30 bg-foreground/10 text-foreground/50 cursor-not-allowed"
                            : isSelected
                              ? "border-accent bg-accent text-white led-glow"
                              : "border-accent/40 bg-foreground/5 text-foreground hover:border-accent/60"
                        }`}
                      >
                        <span>{num}</span>
                        {isReserved && (
                          <span className="text-[10px] font-normal uppercase">
                            {t.reservation.stationReserved}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-accent/40 bg-foreground/5 p-6 space-y-4">
              <h3 className="font-semibold text-accent">{t.contact.sendMessage}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground/90 mb-2">
                    {t.reservation.yourName} <span className="text-accent">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-accent/30 bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground/90 mb-2">
                    {t.reservation.phone} <span className="text-accent">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-accent/30 bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground/90 mb-2">
                  {t.reservation.email} <span className="text-accent">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.contact.emailPlaceholder}
                  className="w-full rounded-lg border border-accent/30 bg-background px-4 py-3 text-foreground placeholder:text-foreground/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href={basePath || "/"}
                className="text-sm text-foreground/70 hover:text-accent transition"
              >
                ← {t.reservation.back}
              </Link>
              <button
                type="submit"
                disabled={!type || selectedStations.length === 0 || !time || !name || !phone || !email}
                className="rounded-lg bg-accent px-8 py-3 font-medium text-white transition-all hover:bg-(--accent-hover) led-glow disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
              >
                {t.reservation.submit}
              </button>
            </div>
          </form>
          )}
        </div>
      </section>

      <footer className="border-t border-accent/20 px-4 py-4 sm:px-6">
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
