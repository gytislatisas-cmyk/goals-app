import type { StatusFilter } from "../lib/goals";

const OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in-progress", label: "In progress" },
  { value: "overdue", label: "Overdue" },
  { value: "not-started", label: "Not started" },
  { value: "completed", label: "Completed" },
];

export function FilterBar({
  label,
  value,
  onChange,
}: {
  label: string;
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
              active
                ? "border-blue-900 bg-blue-900 text-white dark:border-blue-500 dark:bg-blue-500"
                : "border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
