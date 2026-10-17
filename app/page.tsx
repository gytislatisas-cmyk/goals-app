import { GoalForm } from "./components/goal-form";
import { GoalsList } from "./components/goals-list";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Goals</h1>
      <GoalForm />
      <GoalsList />
    </main>
  );
}
