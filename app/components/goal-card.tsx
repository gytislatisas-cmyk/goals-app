import Link from "next/link";
import { formatDate, getProgress, type Goal } from "../lib/goals";
import { deleteGoal } from "../lib/goals-store";

export function GoalCard({ goal }: { goal: Goal }) {
  const { done, total, percent } = getProgress(goal);

  return (
    // The delete button is a sibling of the link (a button inside a link is invalid HTML).
    <div className="relative">
      <Link
        href={`/goals/${goal.id}`}
        className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 pr-14 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
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
