import { getProgress, type Goal } from "../lib/goals";

export function ProgressBar({ goal }: { goal: Goal }) {
  const { done, total, percent } = getProgress(goal);

  return (
    <>
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
    </>
  );
}
