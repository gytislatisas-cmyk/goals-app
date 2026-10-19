"use client";

import { useState } from "react";
import { validateGoal, type GoalErrors, type GoalInput } from "../lib/goals";

const inputClass =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

// Inline form for editing the title and dates of a goal or a subgoal.
// onSave returns false when saving failed; id keeps the field ids unique.
export function EditForm({
  id,
  initial,
  onSave,
  onDone,
}: {
  id: string;
  initial: GoalInput;
  onSave: (input: GoalInput) => boolean;
  onDone: () => void;
}) {
  const [title, setTitle] = useState(initial.title);
  const [startDate, setStartDate] = useState(initial.startDate);
  const [endDate, setEndDate] = useState(initial.endDate);
  const [errors, setErrors] = useState<GoalErrors>({});
  const [saveFailed, setSaveFailed] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = { title, startDate, endDate };
    const found = validateGoal(input);
    setErrors(found);
    setSaveFailed(false);
    if (Object.keys(found).length > 0) return;

    if (onSave(input)) onDone();
    else setSaveFailed(true);
  }

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
          className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-400"
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
