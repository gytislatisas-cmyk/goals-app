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

// Format a YYYY-MM-DD string in the viewer's locale without time zone shifts.
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString();
}
