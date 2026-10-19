"use client";

import { useSyncExternalStore } from "react";

// Re-check once a minute so the date rolls over if the tab stays open past midnight.
function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 60_000);
  return () => clearInterval(timer);
}

function getToday() {
  return new Date().toLocaleDateString();
}

// The server doesn't know the viewer's date or locale, so it renders nothing.
function getServerToday() {
  return "";
}

export function TodayDate() {
  const today = useSyncExternalStore(subscribe, getToday, getServerToday);

  return (
    // Same width and padding as the page content, so the date's right edge
    // lines up with the right edge of the cards and forms.
    <div className="absolute inset-x-0 top-4">
      <p className="mx-auto w-full max-w-2xl px-4 text-right text-sm text-zinc-500 dark:text-zinc-400">
        {today}
      </p>
    </div>
  );
}
