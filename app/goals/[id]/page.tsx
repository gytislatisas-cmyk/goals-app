import { Suspense } from "react";
import { GoalDetail } from "../../components/goal-detail";

// Reading params is request-time data, so it sits inside Suspense and the
// page shell can still be prerendered.
async function GoalFromParams({ params }: Pick<PageProps<"/goals/[id]">, "params">) {
  const { id } = await params;
  return <GoalDetail id={id} />;
}

export default function GoalPage({ params }: PageProps<"/goals/[id]">) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10">
      <Suspense
        fallback={
          <div aria-busy="true" aria-label="Loading goal" className="h-20 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
        }
      >
        <GoalFromParams params={params} />
      </Suspense>
    </main>
  );
}
