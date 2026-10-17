import type { Goal, GoalInput } from "./goals";

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
