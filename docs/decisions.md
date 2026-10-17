# Decisions

## 2026-10-17: Store data in localStorage

- **Decision:** Save all goals in the browser's `localStorage` as one versioned JSON value (for example `{ "version": 1, "goals": [...] }`).
- **Why:** The data is small (under 50 goals), well below the roughly 5 MiB limit. `localStorage` needs no new libraries and is the simplest API. IndexedDB and OPFS add complexity the app doesn't need.
- **Consequences:**
  - Data is tied to the exact origin, including the port.
  - Browsers can evict data (Safari after 7 days without interaction), so add an export/import JSON backup.
  - Handle the `storage` event so several tabs don't overwrite each other.
  - Render a loading state first and don't write to storage until the load has finished.
- **Details and sources:** [storage-research.md](storage-research.md)
