"use client";

import { useSyncExternalStore } from "react";
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
} from "../lib/goals-store";
import { GoalCard } from "./goal-card";

export function GoalsList() {
  const goals = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Storage hasn't loaded yet: show a neutral placeholder, not the empty state.
  if (goals === null) {
    return (
      <div aria-busy="true" aria-label="Loading goals" className="flex flex-col gap-4">
        <div className="h-28 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
        <div className="h-28 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
        No goals yet — add your first one above.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {goals.map((goal) => (
        <li key={goal.id}>
          <GoalCard goal={goal} />
        </li>
      ))}
    </ul>
  );
}
