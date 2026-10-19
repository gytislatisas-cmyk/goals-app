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
      className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1.5 text-sm sm:w-56 dark:border-zinc-700"
    />
  );
}
