"use client";

import Link from "next/link";
import { useState } from "react";
import {
  formatDate,
  getProgress,
  validateGoal,
  type Goal,
  type GoalErrors,
} from "../lib/goals";
import { deleteGoal, updateGoal } from "../lib/goals-store";

const inputClass =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

function EditForm({ goal, onDone }: { goal: Goal; onDone: () => void }) {
  const [title, setTitle] = useState(goal.title);
  const [startDate, setStartDate] = useState(goal.startDate);
  const [endDate, setEndDate] = useState(goal.endDate);
  const [errors, setErrors] = useState<GoalErrors>({});
  const [saveFailed, setSaveFailed] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = { title, startDate, endDate };
    const found = validateGoal(input);
    setErrors(found);
    setSaveFailed(false);
    if (Object.keys(found).length > 0) return;

    if (updateGoal(goal.id, input)) onDone();
    else setSaveFailed(true);
  }

  const id = `edit-${goal.id}`;
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4 rounded-lg border border-zinc-300 p-4 dark:border-zinc-700"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor={`${id}-title`} className="text-sm font-medium">
          Title
        </label>
        <input
          id={`${id}-title`}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? `${id}-title-error` : undefined}
          className={inputClass}
        />
        {errors.title && (
          <p id={`${id}-title-error`} role="alert" className="text-sm text-red-600">
            {errors.title}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor={`${id}-start`} className="text-sm font-medium">
            Start date
          </label>
          <input
            id={`${id}-start`}
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            aria-invalid={errors.startDate ? true : undefined}
            aria-describedby={errors.startDate ? `${id}-start-error` : undefined}
            className={inputClass}
          />
          {errors.startDate && (
            <p id={`${id}-start-error`} role="alert" className="text-sm text-red-600">
              {errors.startDate}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={`${id}-end`} className="text-sm font-medium">
            End date
          </label>
          <input
            id={`${id}-end`}
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            aria-invalid={errors.endDate ? true : undefined}
            aria-describedby={errors.endDate ? `${id}-end-error` : undefined}
            className={inputClass}
          />
          {errors.endDate && (
            <p id={`${id}-end-error`} role="alert" className="text-sm text-red-600">
              {errors.endDate}
            </p>
          )}
        </div>
      </div>

      {saveFailed && (
        <p role="alert" className="text-sm text-red-600">
          Couldn&apos;t save. Browser storage may be full or unavailable.
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-md px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function GoalCard({ goal }: { goal: Goal }) {
  const [editing, setEditing] = useState(false);
  const { done, total, percent } = getProgress(goal);

  if (editing) {
    return <EditForm goal={goal} onDone={() => setEditing(false)} />;
  }

  return (
    // The buttons are siblings of the link (a button inside a link is invalid HTML).
    <div className="relative">
      <Link
        href={`/goals/${goal.id}`}
        className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 pr-24 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
      >
        <div>
          <h2 className="text-lg font-semibold">{goal.title}</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {formatDate(goal.startDate)} – {formatDate(goal.endDate)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            role="progressbar"
            aria-label={`Progress for ${goal.title}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
          >
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="w-10 text-right text-sm tabular-nums">{percent}%</span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {done} of {total} subgoals done
        </p>
      </Link>
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label={`Edit goal ${goal.title}`}
        title="Edit goal"
        className="absolute right-11 top-3 rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-4 w-4"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => deleteGoal(goal.id)}
        aria-label={`Delete goal ${goal.title}`}
        title="Delete goal"
        className="absolute right-3 top-3 rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-4 w-4"
        >
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </svg>
      </button>
    </div>
  );
}
