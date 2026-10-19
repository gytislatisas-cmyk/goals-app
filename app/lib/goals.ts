export type Subgoal = {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  completed: boolean;
};

export type Goal = {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  subgoals: Subgoal[];
};

export type GoalInput = Pick<Goal, "title" | "startDate" | "endDate">;

export type GoalErrors = Partial<Record<keyof GoalInput, string>>;

export function validateGoal(input: GoalInput): GoalErrors {
  const errors: GoalErrors = {};
  if (input.title.trim() === "") {
    errors.title = "Title can't be empty.";
  }
  if (input.startDate === "") {
    errors.startDate = "Pick a start date.";
  }
  if (input.endDate === "") {
    errors.endDate = "Pick an end date.";
  }
  // ISO dates (YYYY-MM-DD) compare correctly as strings.
  if (input.startDate && input.endDate && input.endDate < input.startDate) {
    errors.endDate = "End date can't be before the start date.";
  }
  return errors;
}

export function getProgress(goal: Goal) {
  const total = goal.subgoals.length;
  const done = goal.subgoals.filter((s) => s.completed).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return { done, total, percent };
}

// A goal is completed once it has subgoals and all of them are done.
export function isGoalCompleted(goal: Goal): boolean {
  const { done, total } = getProgress(goal);
  return total > 0 && done === total;
}

// Format a YYYY-MM-DD string in the viewer's locale without time zone shifts.
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString();
}

// Whole days from one YYYY-MM-DD date to another. Uses UTC so DST can't skew it.
function daysBetween(fromIso: string, toIso: string): number {
  const [fy, fm, fd] = fromIso.split("-").map(Number);
  const [ty, tm, td] = toIso.split("-").map(Number);
  return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86_400_000);
}

// Today in the viewer's time zone as YYYY-MM-DD.
export function getTodayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

// How much of the start–end span has passed. The end date counts as a full day,
// so a goal is overdue only from the day after its end date.
export function getTimeProgress(
  item: { startDate: string; endDate: string },
  todayIso: string,
) {
  const total = daysBetween(item.startDate, item.endDate) + 1;
  const passed = Math.min(Math.max(daysBetween(item.startDate, todayIso), 0), total);
  const daysLeft = daysBetween(todayIso, item.endDate);
  const percent = Math.round((passed / total) * 100);
  return {
    percent,
    daysLeft,
    overdue: daysLeft < 0,
    notStarted: daysBetween(todayIso, item.startDate) > 0,
  };
}

export type Status = "not-started" | "in-progress" | "overdue" | "completed";
export type StatusFilter = "all" | Status;

// Matches what the time bar shows: completed wins over the dates, and a
// not-yet-started item can't be overdue.
export function getStatus(
  item: { startDate: string; endDate: string },
  completed: boolean,
  todayIso: string,
): Status {
  if (completed) return "completed";
  const { overdue, notStarted } = getTimeProgress(item, todayIso);
  if (overdue) return "overdue";
  if (notStarted) return "not-started";
  return "in-progress";
}
