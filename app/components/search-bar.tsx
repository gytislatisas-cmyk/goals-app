export function SearchBar({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      placeholder={label}
      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm sm:w-56 dark:border-zinc-700 dark:bg-zinc-900"
    />
  );
}
