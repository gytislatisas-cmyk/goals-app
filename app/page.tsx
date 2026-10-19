import { GoalForm } from "./components/goal-form";
import { GoalsList } from "./components/goals-list";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10">
      <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight text-blue-900 dark:text-blue-300">
        <span aria-hidden="true">🚀</span>
        Goals
      </h1>
      <GoalForm />
      <GoalsList />
    </main>
  );
}
