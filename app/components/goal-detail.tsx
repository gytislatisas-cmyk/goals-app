"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import {
  formatDate,
  getStatus,
  isGoalCompleted,
  matchesQuery,
  type StatusFilter,
} from "../lib/goals";
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
} from "../lib/goals-store";
import { FilterBar } from "./filter-bar";
import { GoalForm } from "./goal-form";
import { ProgressBar } from "./progress-bar";
import { SearchBar } from "./search-bar";
import { SubgoalItem } from "./subgoal-item";
import { TimeBar } from "./time-bar";
import { useToday } from "./use-today";

const linkClass =
  "self-start text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50";

export function GoalDetail({ id }: { id: string }) {
  const goals = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const today = useToday();
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");

  // Storage hasn't loaded yet: don't claim the goal is missing.
  if (goals === null) {
    return (
      <div aria-busy="true" aria-label="Loading goal" className="flex flex-col gap-4">
        <div className="h-8 w-1/2 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
        <div className="h-20 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
      </div>
    );
  }

  const goal = goals.find((g) => g.id === id);

  if (!goal) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-zinc-300 p-8 dark:border-zinc-700">
        <h1 className="text-2xl font-semibold tracking-tight">Goal not found</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          This goal doesn&apos;t exist. It may have been deleted.
        </p>
        <Link href="/" className="font-medium underline underline-offset-4">
          Go to your goals
        </Link>
      </div>
    );
  }

  const visible = goal.subgoals.filter(
    (s) =>
      matchesQuery(s.title, query) &&
      (filter === "all" || today === "" || getStatus(s, s.completed, today) === filter),
  );

  return (
    <>
      <Link href="/" className={linkClass}>
        ← Back to goals
      </Link>
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{goal.title}</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {formatDate(goal.startDate)} – {formatDate(goal.endDate)}
          </p>
        </div>
        <ProgressBar goal={goal} />
        <TimeBar
          title={goal.title}
          startDate={goal.startDate}
          endDate={goal.endDate}
          completed={isGoalCompleted(goal)}
        />
      </div>
      <GoalForm goalId={goal.id} />
      {goal.subgoals.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          No subgoals yet — add your first one above.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <FilterBar label="Filter subgoals" value={filter} onChange={setFilter} />
            <SearchBar label="Search subgoals" value={query} onChange={setQuery} />
          </div>
          {visible.length === 0 ? (
            <p className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
              No subgoals match your search or filter.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {visible.map((subgoal) => (
                <li key={subgoal.id}>
                  <SubgoalItem goalId={goal.id} subgoal={subgoal} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}
