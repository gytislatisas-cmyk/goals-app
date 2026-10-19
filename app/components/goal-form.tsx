"use client";

import { useState } from "react";
import { validateGoal, type GoalErrors } from "../lib/goals";
import { addGoal, addSubgoal } from "../lib/goals-store";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

// Adds a goal, or a subgoal of that goal when goalId is given.
export function GoalForm({ goalId }: { goalId?: string }) {
  const label = goalId ? "Add subgoal" : "Add goal";
  const openLabel = goalId ? "+ New subgoal" : "+ New goal";
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState<GoalErrors>({});
  const [saveFailed, setSaveFailed] = useState(false);

  function reset() {
    setTitle("");
    setStartDate("");
    setEndDate("");
    setErrors({});
    setSaveFailed(false);
  }

  function handleCancel() {
    reset();
    setOpen(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = { title, startDate, endDate };
    const found = validateGoal(input);
    setErrors(found);
    setSaveFailed(false);
    if (Object.keys(found).length > 0) return;

    if (goalId ? addSubgoal(goalId, input) : addGoal(input)) {
      reset();
      setOpen(false);
    } else {
      setSaveFailed(true);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={false}
        className="self-start rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:bg-transparent dark:hover:bg-zinc-800"
      >
        {openLabel}
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="goal-title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="goal-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? "goal-title-error" : undefined}
          className={inputClass}
        />
        {errors.title && (
          <p id="goal-title-error" role="alert" className="text-sm text-red-600">
            {errors.title}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="goal-start" className="text-sm font-medium">
            Start date
          </label>
          <input
            id="goal-start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            aria-invalid={errors.startDate ? true : undefined}
            aria-describedby={errors.startDate ? "goal-start-error" : undefined}
            className={inputClass}
          />
          {errors.startDate && (
            <p
              id="goal-start-error"
              role="alert"
              className="text-sm text-red-600"
            >
              {errors.startDate}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="goal-end" className="text-sm font-medium">
            End date
          </label>
          <input
            id="goal-end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            aria-invalid={errors.endDate ? true : undefined}
            aria-describedby={errors.endDate ? "goal-end-error" : undefined}
            className={inputClass}
          />
          {errors.endDate && (
            <p id="goal-end-error" role="alert" className="text-sm text-red-600">
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
          className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          {label}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:bg-transparent dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
