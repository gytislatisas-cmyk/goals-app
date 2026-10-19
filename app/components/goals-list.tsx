"use client";

import { useState, useSyncExternalStore } from "react";
import { getStatus, isGoalCompleted, type StatusFilter } from "../lib/goals";
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
} from "../lib/goals-store";
import { FilterBar } from "./filter-bar";
import { GoalCard } from "./goal-card";
import { useToday } from "./use-today";

export function GoalsList() {
  const goals = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const today = useToday();
  const [filter, setFilter] = useState<StatusFilter>("all");

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

  const visible =
    filter === "all" || today === ""
      ? goals
      : goals.filter((goal) => getStatus(goal, isGoalCompleted(goal), today) === filter);

  return (
    <>
      <FilterBar label="Filter goals" value={filter} onChange={setFilter} />
      {visible.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          No goals match this filter.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {visible.map((goal) => (
            <li key={goal.id}>
              <GoalCard goal={goal} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
