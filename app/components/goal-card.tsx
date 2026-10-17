import Link from "next/link";
import { formatDate, getProgress, type Goal } from "../lib/goals";

export function GoalCard({ goal }: { goal: Goal }) {
  const { done, total, percent } = getProgress(goal);

  return (
    <Link
      href={`/goals/${goal.id}`}
      className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
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
  );
}
