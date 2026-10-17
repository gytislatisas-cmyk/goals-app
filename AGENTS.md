## About
Goals is a small app for tracking personal goals. Each goal has a start and
end date and a checklist of subgoals; its progress is the share of subgoals
completed.

## Stack
- Next.js (App Router), TypeScript, Tailwind CSS.

## How to run
- npm run dev, then open http://localhost:3000.

## Constraints
- Runs locally only. No deployment and no public URL.
- No backend, no API routes, no database, no user accounts.
- Data is saved in the browser's localStorage as one versioned JSON value.
  See docs/decisions.md and docs/storage-research.md.

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
