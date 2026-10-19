"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDate, isGoalCompleted, type Goal } from "../lib/goals";
import { completeGoal, deleteGoal, updateGoal } from "../lib/goals-store";
import { EditForm } from "./edit-form";
import { CheckIcon, PencilIcon, TrashIcon } from "./icons";
import { ProgressBar } from "./progress-bar";
import { TimeBar } from "./time-bar";

export function GoalCard({ goal }: { goal: Goal }) {
  const [editing, setEditing] = useState(false);
  // A goal with no subgoals can't be completed, so there is nothing to do.
  const canComplete = goal.subgoals.length > 0 && !isGoalCompleted(goal);

  if (editing) {
    return (
      <EditForm
        id={`edit-${goal.id}`}
        initial={goal}
        onSave={(input) => updateGoal(goal.id, input)}
        onDone={() => setEditing(false)}
      />
    );
  }

  return (
    // The buttons are siblings of the link (a button inside a link is invalid HTML).
    <div className="relative">
      <Link
        href={`/goals/${goal.id}`}
        className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 pr-32 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
      >
        <div>
          <h2 className="text-lg font-semibold">{goal.title}</h2>
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
      </Link>
      <button
        type="button"
        onClick={() => completeGoal(goal.id)}
        disabled={!canComplete}
        aria-label={`Complete goal ${goal.title}`}
        title={canComplete ? "Complete goal and all its subgoals" : "Nothing to complete"}
        className="absolute right-[4.75rem] top-3 rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-green-50 hover:text-green-600 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-zinc-500 dark:hover:bg-green-950"
      >
        <CheckIcon />
      </button>
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label={`Edit goal ${goal.title}`}
        title="Edit goal"
        className="absolute right-11 top-3 rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
      >
        <PencilIcon />
      </button>
      <button
        type="button"
        onClick={() => deleteGoal(goal.id)}
        aria-label={`Delete goal ${goal.title}`}
        title="Delete goal"
        className="absolute right-3 top-3 rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
      >
        <TrashIcon />
      </button>
    </div>
  );
}
