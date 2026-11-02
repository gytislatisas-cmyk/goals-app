---
name: commit-summary
description: Write a Conventional Commits message (type(scope): subject, optional body) from the current git diff. Use whenever the user asks for a commit message, a commit summary, "what should I commit this as", or wants the staged or unstaged changes described for a commit, even if they never say "conventional". Only drafts the message; it does not stage, commit or push (use ship for that).
---

# commit-summary

Turn the current git diff into one Conventional Commits message the user can paste or commit.
The goal is a message a teammate can scan in `git log --oneline` and understand later, so
describe what changed and why it matters, not which files were touched.

## 1. Read the diff

Prefer what the user is about to commit:

1. `git diff --staged`. If it is non-empty, that is the diff. Staged changes are the user's
   statement of what belongs in this commit.
2. Otherwise `git diff` for unstaged changes, and `git status --short` to spot untracked files
   (they are not in the diff; read the important ones and mention that they are untracked).
3. If both are empty, say there is nothing to summarize and stop. Do not invent a message.

For a very large diff, start with `git diff --stat`, then read the files that carry the
meaning (source over lockfiles, generated files, snapshots).

If the diff mixes unrelated changes (say a feature plus a docs fix), still write one message
for the dominant change, and add one line suggesting the split. Do not stage or commit anything.

## 2. Choose type and scope

Format: `type(scope): subject`. The scope is optional.

| type | use for |
|------|---------|
| feat | new user-visible behaviour |
| fix | a bug fix |
| docs | documentation only (README, AGENTS.md, docs/) |
| style | formatting, whitespace, no logic change |
| refactor | restructuring without behaviour change |
| perf | performance improvement |
| test | adding or fixing tests |
| build | build system, dependencies |
| ci | CI configuration |
| chore | maintenance that fits nowhere else |

Pick the type by the effect on the user of the code, not by the files. A change to
`app/components/` that adds a button is `feat`; one that only renames props is `refactor`.
When a diff has several types, the one with the biggest user-visible effect wins.

The scope is a short noun for the area touched, such as a module, component or page. Take it
from the directory or file names in the diff (for example `search`, `goal-card`, `store`).
Leave it out when the change spans many areas or no single name fits, since a vague scope is
worse than none.

## 3. Write the message

- **Subject**: imperative mood ("add", not "added" or "adds"), lowercase after the colon, no
  trailing period, at most 72 characters including the prefix.
- **Body** (only when the subject cannot carry the *why*): blank line after the subject, wrap
  at about 72 characters, explain motivation and notable decisions. Skip it for small,
  self-explanatory changes. A body that restates the diff line by line is noise.
- **Breaking change**: add `!` after the type or scope (`feat(store)!: ...`) and a
  `BREAKING CHANGE: ...` footer saying what callers must now do.
- **Issue references**: add `Refs #n` or `Closes #n` footers only if the user mentioned an
  issue or the branch name or diff clearly contains one. Never guess a number.

Describe the change at the level of behaviour. "fix(filter): keep search text when switching
status" tells the reader something; "update FilterBar.tsx" does not.

## 4. Output

Reply with the message in a single fenced code block and nothing inside the block except the
message, so it can be copied cleanly. After the block, add at most two short lines: the
reason for the type if it was a judgment call, and the split suggestion if the diff mixed
concerns. Do not run `git commit` unless the user asks; if they do, commit with the message
exactly as written.

If the repository's own instructions (CLAUDE.md, AGENTS.md, a commit template) require extra
trailers, such as a co-author line, append them to the message.

## Example

Diff: adds a text input that filters the goals list by title prefix, plus a small
`matchesQuery` helper.

```
feat(search): filter goals by title prefix

Match when the title, or any word in it, starts with the typed text,
case-insensitive. Combines with the status filter and resets on reload.
```
