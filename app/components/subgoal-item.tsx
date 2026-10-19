"use client";

import { useState } from "react";
import { formatDate, type Subgoal } from "../lib/goals";
import {
  deleteSubgoal,
  toggleSubgoal,
  updateSubgoal,
} from "../lib/goals-store";
import { EditForm } from "./edit-form";
import { PencilIcon, TrashIcon } from "./icons";
import { TimeBar } from "./time-bar";

export function SubgoalItem({
  goalId,
  subgoal,
}: {
  goalId: string;
  subgoal: Subgoal;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <EditForm
        id={`edit-${subgoal.id}`}
        initial={subgoal}
        onSave={(input) => updateSubgoal(goalId, subgoal.id, input)}
        onDone={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <input
        type="checkbox"
        checked={subgoal.completed}
        onChange={() => toggleSubgoal(goalId, subgoal.id)}
        aria-label={`Mark subgoal ${subgoal.title} as done`}
        className="h-4 w-4 shrink-0 accent-emerald-500"
      />
      <div className="min-w-0 flex-1">
        <h3
          className={`font-medium ${subgoal.completed ? "text-zinc-500 line-through" : ""}`}
        >
          {subgoal.title}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {formatDate(subgoal.startDate)} – {formatDate(subgoal.endDate)}
        </p>
        <div className="mt-2">
          <TimeBar
            title={subgoal.title}
            startDate={subgoal.startDate}
            endDate={subgoal.endDate}
            completed={subgoal.completed}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label={`Edit subgoal ${subgoal.title}`}
        title="Edit subgoal"
        className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
      >
        <PencilIcon />
      </button>
      <button
        type="button"
        onClick={() => deleteSubgoal(goalId, subgoal.id)}
        aria-label={`Delete subgoal ${subgoal.title}`}
        title="Delete subgoal"
        className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
      >
        <TrashIcon />
      </button>
    </div>
  );
}
