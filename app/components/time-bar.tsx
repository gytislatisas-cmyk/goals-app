"use client";

import { useSyncExternalStore } from "react";
import { getTimeProgress, getTodayIso } from "../lib/goals";

// Re-check once a minute so the bar updates if the tab stays open past midnight.
function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 60_000);
  return () => clearInterval(timer);
}

// The server doesn't know the viewer's date, so it renders nothing.
function getServerToday() {
  return "";
}

function daysLeftLabel(daysLeft: number) {
  if (daysLeft === 0) return "Due today";
  return `${daysLeft} ${daysLeft === 1 ? "day" : "days"} left`;
}

export function TimeBar({
  title,
  startDate,
  endDate,
  completed,
}: {
  title: string;
  startDate: string;
  endDate: string;
  completed: boolean;
}) {
  const today = useSyncExternalStore(subscribe, getTodayIso, getServerToday);
  if (completed) {
    return <p className="text-sm font-medium">Completed! 🏆</p>;
  }
  if (today === "") return null;

  const { percent, daysLeft, overdue, notStarted } = getTimeProgress({ startDate, endDate }, today);

  return (
    <div className="flex items-center gap-3">
      <div
        role="progressbar"
        aria-label={`Time passed for ${title}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
      >
        <div
          className={`h-full rounded-full ${overdue ? "bg-red-500" : "bg-emerald-500"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span
        className={`shrink-0 whitespace-nowrap text-right text-sm tabular-nums ${overdue ? "font-medium text-red-600 dark:text-red-400" : ""}`}
      >
        {notStarted ? "Not started" : overdue ? "Overdue" : daysLeftLabel(daysLeft)}
      </span>
    </div>
  );
}
