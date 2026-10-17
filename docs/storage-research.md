# Browser storage research

Date: 2026-10-17

## Decision

Use **`localStorage`**, holding all goals as a single versioned JSON value (for example `{ "version": 1, "goals": [...] }`). No new libraries are needed. See [decisions.md](decisions.md).

## Context

- Single-user app that runs locally. No backend, database or login.
- Created items, edits and deletions must survive a reload and closing and reopening the tab.
- Data: goals, each with a title, start/end dates and a list of subgoals (title, dates, completed true/false). Probably under 50 goals, so tens of kilobytes at most.

## Options and trade-offs

| | localStorage | IndexedDB | OPFS (file API) |
|---|---|---|---|
| Survives reload and closing the tab | Yes | Yes | Yes |
| API | Simple, synchronous, strings only (`JSON.stringify`/`parse`) | Low-level: transactions, events, schema versions | Byte-level file access, no structure |
| Size limit | About 5 MiB per origin | Much larger, shared per-origin quota | Same larger quota as IndexedDB |
| Best for | Small amounts of data | Larger structured data, indexed lookups, blobs | Large binary or file-like data |
| Cost for this app | Almost none | Boilerplate, or a wrapper library (needs approval under the AGENTS.md rules) | Most of the work; fastest access needs a Web Worker |

Why `localStorage` fits: the data is far below the 5 MiB cap. Its main drawback, synchronous blocking, only matters for large data or heavy operations. IndexedDB's strengths (indexes, blobs, big data) aren't needed. OPFS is a poor fit for structured records.

## Caveats (apply to every option)

- **Data is tied to the exact origin (scheme, host and port).** If `localhost:3000` becomes `localhost:3001`, the app looks empty. The data is still stored under the other origin.
- **Browsers can evict data.** Default storage is "best-effort" and can be deleted under disk pressure. Safari also deletes script-written data after 7 days with no user interaction when tracking prevention is on. Mitigations: an export/import JSON backup, and `navigator.storage.persist()` (Chrome and Safari decide automatically; Firefox prompts).
- **Private windows** keep data only until the session ends.
- **Several tabs:** the `storage` event notifies other tabs of changes. Without handling it, two open tabs can overwrite each other.

## Next.js server rendering and flash on reload

- Client-side storage isn't available during server rendering. The server renders a default (for this app, an empty state).
- If the client renders saved goals on first render, React reports a hydration mismatch. Deferring to `useEffect` avoids the error but shows a flash.
- The Next.js guide's inline-script technique corrects the DOM before first paint. It suits small things (theme, open accordion section) but is awkward for a whole list of goals.
- `useLayoutEffect` runs before paint but after hydration. It doesn't cover the gap between the HTML arriving and React hydrating, which is tiny on a local dev server.

Planned approach:

1. Keep the storage-reading component a Client Component. Read storage only in the browser.
2. Render a neutral loading state (a skeleton, not "No goals yet") on the server and on first client render.
3. Load saved goals right after hydration.
4. Don't write to storage until the load has finished, so the empty initial state can't overwrite saved data. (This is our own safeguard, not from the sources.)

`useSyncExternalStore` (React) with a separate server snapshot is probably a good fit too. It was not verified in this research.

## Sources

- [MDN: Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- [MDN: Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [MDN: IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [web.dev: The origin private file system](https://web.dev/opfs)
- [RxDB: LocalStorage vs. IndexedDB vs. Cookies vs. OPFS vs. WASM-SQLite](https://rxdb.info/articles/localstorage-indexeddb-cookies-opfs-sqlite-wasm.md) (vendor write-up, used only for the general comparison)
- Local Next.js docs in this project:
  - `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`
  - `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
