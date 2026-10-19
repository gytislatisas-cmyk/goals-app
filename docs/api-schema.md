# API and data schema

Goals has no backend: no HTTP API, no API routes, no database. Its "API" is
the store module, [app/lib/goals-store.ts](../app/lib/goals-store.ts), and the
JSON value it keeps in localStorage. Components only talk to the store and
never touch localStorage directly. See [decisions.md](decisions.md) and
[storage-research.md](storage-research.md) for why.

## Stored data

- Key: `goals-app`
- Value: one versioned JSON document.

```json
{
  "version": 1,
  "goals": [
    {
      "id": "b1c0…",
      "title": "Run a half marathon",
      "startDate": "2026-01-01",
      "endDate": "2026-06-30",
      "subgoals": [
        {
          "id": "9f2e…",
          "title": "Run 10 km",
          "startDate": "2026-01-01",
          "endDate": "2026-03-01",
          "completed": false
        }
      ]
    }
  ]
}
```

### Types

Defined in [app/lib/goals.ts](../app/lib/goals.ts).

**Goal**

| Field       | Type       | Notes                                   |
| ----------- | ---------- | --------------------------------------- |
| `id`        | `string`   | `crypto.randomUUID()`, set on creation  |
| `title`     | `string`   | Trimmed, never empty                    |
| `startDate` | `string`   | `YYYY-MM-DD`                            |
| `endDate`   | `string`   | `YYYY-MM-DD`, not before `startDate`    |
| `subgoals`  | `Subgoal[]`| Stored inside the goal, in added order  |

**Subgoal**

| Field       | Type      | Notes                                  |
| ----------- | --------- | -------------------------------------- |
| `id`        | `string`  | `crypto.randomUUID()`, set on creation |
| `title`     | `string`  | Trimmed, never empty                   |
| `startDate` | `string`  | `YYYY-MM-DD`                           |
| `endDate`   | `string`  | `YYYY-MM-DD`, not before `startDate`   |
| `completed` | `boolean` | `false` when created                   |

**GoalInput** is `Pick<Goal, "title" | "startDate" | "endDate">`. It is the
input for both goals and subgoals.

### Validation

`validateGoal(input: GoalInput): GoalErrors` returns an object with an error
message per invalid field, or `{}` when valid.

| Field       | Rule                         | Message                                  |
| ----------- | ---------------------------- | ---------------------------------------- |
| `title`     | Not empty after trimming     | Title can't be empty.                    |
| `startDate` | Not empty                    | Pick a start date.                       |
| `endDate`   | Not empty                    | Pick an end date.                        |
| `endDate`   | Not before `startDate`       | End date can't be before the start date. |

The store does not validate. Callers validate first.

### Derived values

- `getProgress(goal)` returns `{ done, total, percent }`. `percent` is
  `Math.round(done / total * 100)`, and `0` when there are no subgoals.
- `formatDate(iso)` formats a `YYYY-MM-DD` string in the viewer's locale
  without time zone shifts.

Progress is computed, never stored.

## Store functions

All mutations return `true` when saved and `false` when localStorage rejected
the write (for example, storage is full or unavailable). On `false`, the
in-memory data is left unchanged.

### Goals

| Function                                | Effect                                                 |
| --------------------------------------- | ------------------------------------------------------ |
| `addGoal(input)`                        | Creates a goal with no subgoals, placed first in list  |
| `updateGoal(id, input)`                 | Changes title and dates only; subgoals are kept        |
| `deleteGoal(id)`                        | Removes the goal and its subgoals                      |

### Subgoals

| Function                                    | Effect                                    |
| ------------------------------------------- | ----------------------------------------- |
| `addSubgoal(goalId, input)`                 | Appends an incomplete subgoal to the goal |
| `updateSubgoal(goalId, subgoalId, input)`   | Changes title and dates only              |
| `toggleSubgoal(goalId, subgoalId)`          | Flips `completed`                         |
| `deleteSubgoal(goalId, subgoalId)`          | Removes the subgoal                       |

An unknown `goalId` or `subgoalId` is not an error: the save succeeds and
nothing changes.

### Reading

The store is shaped for React's `useSyncExternalStore`.

| Function                | Returns                                                       |
| ----------------------- | ------------------------------------------------------------- |
| `subscribe(listener)`   | Registers a change listener; returns an unsubscribe function  |
| `getSnapshot()`         | `Goal[]` read from localStorage and cached                    |
| `getServerSnapshot()`   | Always `null`: storage is empty on the server                 |

`GoalsSnapshot` is `Goal[] | null`. `null` means the client has not read
storage yet, so pages show a loading state rather than an empty list.

## Behavior

- **Version check:** `read()` accepts the value only when `version` is `1` and
  `goals` is an array. Missing, corrupted or other-version data is treated as
  an empty list. It is not overwritten until the next user action.
- **Saving:** only on user actions, never on load, so the empty initial state
  can't overwrite saved data.
- **Other tabs:** a `storage` event for key `goals-app` (or a full clear)
  drops the cache and notifies listeners, so every tab shows current data.
- **Changing the shape:** bump `VERSION` in the store and add a migration, or
  older saved data will be ignored.
