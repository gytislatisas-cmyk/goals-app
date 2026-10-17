import type { Goal, GoalInput, Subgoal } from "./goals";

const STORAGE_KEY = "goals-app";
const VERSION = 1;

// null until the client has read localStorage (and always null on the server).
export type GoalsSnapshot = Goal[] | null;

let cache: Goal[] | null = null;
const listeners = new Set<() => void>();

function read(): Goal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const data = JSON.parse(raw);
    if (data?.version === VERSION && Array.isArray(data.goals)) {
      return data.goals;
    }
  } catch {
    // Storage unavailable or corrupted: fall through to an empty list.
  }
  return [];
}

function notify() {
  listeners.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  // Another tab changed our data (or cleared storage).
  if (event.key === STORAGE_KEY || event.key === null) {
    cache = null;
    notify();
  }
}

export function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export function getSnapshot(): GoalsSnapshot {
  if (cache === null) cache = read();
  return cache;
}

export function getServerSnapshot(): GoalsSnapshot {
  return null;
}

// Saving only happens in response to user actions, never on load, so the
// empty initial state can't overwrite saved data.
function save(goals: Goal[]): boolean {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: VERSION, goals }),
    );
  } catch {
    return false;
  }
  cache = goals;
  notify();
  return true;
}

export function addGoal(input: GoalInput): boolean {
  const goal: Goal = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    startDate: input.startDate,
    endDate: input.endDate,
    subgoals: [],
  };
  return save([goal, ...getSnapshot()!]);
}

// Subgoals live inside their goal, so removing the goal removes them too.
export function deleteGoal(id: string): boolean {
  return save(getSnapshot()!.filter((goal) => goal.id !== id));
}

// Only the title and dates change; subgoals and progress are kept as they are.
export function updateGoal(id: string, input: GoalInput): boolean {
  return save(
    getSnapshot()!.map((goal) =>
      goal.id === id
        ? {
            ...goal,
            title: input.title.trim(),
            startDate: input.startDate,
            endDate: input.endDate,
          }
        : goal,
    ),
  );
}

function updateGoalById(id: string, change: (goal: Goal) => Goal): boolean {
  return save(
    getSnapshot()!.map((goal) => (goal.id === id ? change(goal) : goal)),
  );
}

export function addSubgoal(goalId: string, input: GoalInput): boolean {
  const subgoal: Subgoal = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    startDate: input.startDate,
    endDate: input.endDate,
    completed: false,
  };
  return updateGoalById(goalId, (goal) => ({
    ...goal,
    subgoals: [...goal.subgoals, subgoal],
  }));
}

function changeSubgoal(
  goalId: string,
  subgoalId: string,
  change: (subgoal: Subgoal) => Subgoal,
): boolean {
  return updateGoalById(goalId, (goal) => ({
    ...goal,
    subgoals: goal.subgoals.map((s) => (s.id === subgoalId ? change(s) : s)),
  }));
}

export function updateSubgoal(
  goalId: string,
  subgoalId: string,
  input: GoalInput,
): boolean {
  return changeSubgoal(goalId, subgoalId, (s) => ({
    ...s,
    title: input.title.trim(),
    startDate: input.startDate,
    endDate: input.endDate,
  }));
}

export function toggleSubgoal(goalId: string, subgoalId: string): boolean {
  return changeSubgoal(goalId, subgoalId, (s) => ({
    ...s,
    completed: !s.completed,
  }));
}

export function deleteSubgoal(goalId: string, subgoalId: string): boolean {
  return updateGoalById(goalId, (goal) => ({
    ...goal,
    subgoals: goal.subgoals.filter((s) => s.id !== subgoalId),
  }));
}
