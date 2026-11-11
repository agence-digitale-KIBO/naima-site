"use client";

import { useSyncExternalStore } from "react";
import { openingHours } from "@/config/opening-hours";
import {
  msUntilNextChange,
  openingStatus,
  romeClock,
  type OpeningStatus,
  type RomeClock,
} from "@/lib/opening-status";

export type OpeningSnapshot = {
  clock: RomeClock;
  status: OpeningStatus;
};

let snapshot: OpeningSnapshot | null = null;
const listeners = new Set<() => void>();
let timer = 0;
let armed = false;
let listening = false;

function arm(delay: number) {
  window.clearTimeout(timer);
  armed = true;
  timer = window.setTimeout(() => {
    armed = false;
    if (listeners.size === 0) return;
    const now = new Date();
    snapshot = { clock: romeClock(now), status: openingStatus(now, openingHours) };
    listeners.forEach((listener) => listener());
    const wait = msUntilNextChange(now, openingHours);
    arm(Math.min(Math.max(wait ?? 30_000, 1_000), 30_000));
  }, delay);
}

function onVisibility() {
  if (document.visibilityState === "visible") arm(0);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!listening) {
    listening = true;
    document.addEventListener("visibilitychange", onVisibility);
  }
  if (!armed) arm(0);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      listening = false;
      armed = false;
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    }
  };
}

export function useOpeningSnapshot() {
  return useSyncExternalStore(subscribe, () => snapshot, () => null);
}
