import { useSyncExternalStore } from "react";
import { getTodayIso } from "../lib/goals";

// Re-check once a minute so the date updates if the tab stays open past midnight.
function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 60_000);
  return () => clearInterval(timer);
}

// The server doesn't know the viewer's date, so it returns "".
function getServerToday() {
  return "";
}

export function useToday(): string {
  return useSyncExternalStore(subscribe, getTodayIso, getServerToday);
}
