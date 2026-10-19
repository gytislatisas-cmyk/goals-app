## About
Goals is a small app for tracking personal goals. Each goal has a start and
end date and a checklist of subgoals; its progress is the share of subgoals
completed.

## What it does
- Add a goal with a title, start date and end date, via the "+ New goal"
  button that expands the form (collapsed by default). Edit or delete it.
- Complete a goal from its card with the check button: it marks every subgoal
  done. The button is disabled for a goal with no subgoals or one that is
  already completed. There is no undo; untick subgoals on the goal page.
- Open a goal to manage its subgoals: add, edit, delete, and tick them off.
  Each subgoal has its own title and dates.
- Progress is the share of subgoals completed, shown as a bar and
  "X of Y subgoals done" on the goal card and the goal page.
- Time passed is shown as a second bar with a label ("N days left", "Due
  today", "Not started" or red "Overdue") on goal cards, the goal page and each
  subgoal. A completed goal or subgoal shows "Completed!" instead. A goal is
  completed when it has subgoals and all are done.
- Today's date is shown in the top right corner of every page.
- A filter bar (All, In progress, Overdue, Not started, Completed) narrows the
  goals list and, on the goal page, the subgoal list. The status is the same
  one the time bar shows. The choice is not saved and resets on reload.
- A search box next to each filter bar narrows the same lists by title: a
  title matches when it, or any word in it, starts with the typed text
  (case ignored). It combines with the status filter and also resets on reload.
- Goals and subgoals are listed by end date, earliest first, with overdue ones
  ahead of the rest. This order is fixed; it is not a setting.
- Deleting a goal also deletes its subgoals.

## Pages
- `/` (app/page.tsx): the add-goal form and the goals list with its filter bar
  and search box. Each card links to its goal page and has complete, edit and
  delete buttons.
- `/goals/[id]` (app/goals/[id]/page.tsx): one goal with its progress, the
  add-subgoal form and the subgoal list with its filter bar and search box.
  Shows a loading state until storage has been read, then "Goal not found" if
  the id doesn't exist.

## Code layout
- app/lib/goals.ts: types (Goal, Subgoal), validation, progress, completion,
  time progress, status (getStatus, StatusFilter), sort order
  (sortByEndDate), search match (matchesQuery), date format.
- app/lib/goals-store.ts: all reading and writing of localStorage, for goals
  and subgoals (add, update, delete, completeGoal, toggleSubgoal). Components
  go through it and never touch localStorage.
- app/components/: UI.
  - GoalsList and GoalCard make up the goals list; GoalDetail and
    SubgoalItem make up the goal page.
  - EditForm, ProgressBar, TimeBar and the icons are shared by goals and
    subgoals.
  - FilterBar is the status filter and SearchBar the title search, both used
    on both pages.
  - useToday gives today's date to TimeBar and the filters; TodayDate is
    rendered once in app/layout.tsx.
  - GoalForm adds a goal, or a subgoal when given a goalId. It is collapsed
    behind a "+ New goal" / "+ New subgoal" button until opened.

## Stack
- Next.js (App Router), TypeScript, Tailwind CSS.

## How to run
- npm run dev, then open http://localhost:3000.
- npm run lint checks the code. npm run build makes a production build.

## Constraints
- Runs locally only. No deployment and no public URL.
- No backend, no API routes, no database, no user accounts.
- Data is saved in the browser's localStorage as one versioned JSON value.
  See docs/decisions.md, docs/storage-research.md and docs/api-schema.md.
  - Key `goals-app`, value `{ version: 1, goals: Goal[] }`. Subgoals are
    stored inside their goal.
  - Saving happens only on user actions, never on load. Changes in another
    tab are picked up through the `storage` event.
  - Storage is empty on the server, so pages wait for the client to read it
    before showing goals.

## Rules
- Use the App Router, not the Pages Router.
- Use TypeScript and Tailwind for all code and styling.
- Do not add new libraries without asking first.
- Explain what you changed after each task.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
