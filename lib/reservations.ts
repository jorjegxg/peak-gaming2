import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION = "reservations";

export type Reservation = {
  id: string;
  type: "ps5" | "pc";
  station: number;
  date: string;
  time: string;
  duration: number;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  userId?: string;
};

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function docToReservation(id: string, data: DocumentData): Reservation {
  const createdAt = data.createdAt?.toDate?.()
    ? data.createdAt.toDate().toISOString()
    : (typeof data.createdAt === "string" ? data.createdAt : new Date().toISOString());
  return {
    id,
    type: data.type === "pc" ? "pc" : "ps5",
    station: Number(data.station),
    date: String(data.date),
    time: String(data.time),
    duration: Number(data.duration),
    name: String(data.name),
    phone: String(data.phone),
    email: String(data.email),
    createdAt,
  };
}

export async function getReservations(): Promise<Reservation[]> {
  const snap = await getDocs(collection(db, COLLECTION));
  return snap.docs.map((d) => docToReservation(d.id, d.data()));
}

export async function getReservationsForDate(date: string): Promise<Reservation[]> {
  const q = query(
    collection(db, COLLECTION),
    where("date", "==", date)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToReservation(d.id, d.data()));
}

export async function saveReservation(
  r: Omit<Reservation, "id" | "createdAt"> & { userId?: string }
): Promise<Reservation> {
  const payload: Record<string, unknown> = {
    type: r.type,
    station: r.station,
    date: r.date,
    time: r.time,
    duration: r.duration,
    name: r.name,
    phone: r.phone,
    email: r.email,
    createdAt: serverTimestamp(),
  };
  if (r.userId) payload.userId = r.userId;
  const ref = await addDoc(collection(db, COLLECTION), payload);
  return {
    ...r,
    id: ref.id,
    createdAt: new Date().toISOString(),
  };
}

/** Returns station numbers that are reserved in the given slot (overlap with time + duration). */
export function getReservedStationsForSlot(
  reservations: Reservation[],
  type: "ps5" | "pc",
  time: string,
  duration: number
): number[] {
  const startMin = timeToMinutes(time);
  const endMin = startMin + duration * 60;
  const ofType = reservations.filter((r) => r.type === type);
  const reserved = new Set<number>();
  for (const r of ofType) {
    const rStart = timeToMinutes(r.time);
    const rEnd = rStart + r.duration * 60;
    if (startMin < rEnd && endMin > rStart) reserved.add(r.station);
  }
  return Array.from(reserved);
}

export type DayGrid = {
  ps5: Record<number, Record<number, Reservation | null>>;
  pc: Record<number, Record<number, Reservation | null>>;
};

export const DAY_HOURS = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23] as const;

/** Build calendar grid for one day from a list of reservations (assumed for that day). */
export function getDayCalendarGrid(reservations: Reservation[]): DayGrid {
  const ps5: Record<number, Record<number, Reservation | null>> = {};
  const pc: Record<number, Record<number, Reservation | null>> = {};
  for (const h of DAY_HOURS) {
    ps5[h] = {};
    pc[h] = {};
    for (let s = 1; s <= 5; s++) ps5[h][s] = null;
    for (let s = 1; s <= 9; s++) pc[h][s] = null;
  }
  for (const r of reservations) {
    const startMin = timeToMinutes(r.time);
    const endMin = startMin + r.duration * 60;
    const grid = r.type === "ps5" ? ps5 : pc;
    for (const h of DAY_HOURS) {
      const slotStart = h * 60;
      const slotEnd = (h + 1) * 60;
      if (startMin < slotEnd && endMin > slotStart) {
        grid[h][r.station] = r;
      }
    }
  }
  return { ps5, pc };
}
