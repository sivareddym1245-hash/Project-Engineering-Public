# Challenge Findings

## 1. How the Productivity Score Currently Works

The original implementation added 5 points when a task was created and 10 points whenever it was marked complete. Those values were stored in a single `Score` record without being tied back to the tasks. The score endpoint then added a separate bonus based on the number of completed tasks: 1.5 points per completion when fewer than two tasks were complete, or 3.75 per completion otherwise, rounded down.

## 2. Issues Discovered

- Creating an unfinished task increased the productivity score.
- Completing a task repeatedly could increase the stored score repeatedly.
- Deleting a task never removed its points, and the extra completion bonus could make the displayed score change in a way that did not match task actions.
- Tasks had no importance field, so the requirement's priority concept was missing.
- No completion timestamp or consistency measure existed; the dashboard instead showed an unconditional “High Energy Today” label.

## 3. Proposed Improvements

Use one transparent, repeatable formula: each completed regular task is worth 10 points and each completed important task is worth 20. Derive the score from the current task data instead of maintaining a separately incremented total. Track completion dates and show a consecutive-day completion streak as a distinct consistency measure.

## 4. Implementation Details

- Added `isImportant` and nullable `completedAt` task fields, with a Prisma schema update.
- Added an importance checkbox when creating a task and a star control to change importance later.
- Record the timestamp when a task becomes complete and clear it when a task is reopened. Repeating the same completion update does not change its timestamp.
- Replaced the stored-score and momentum-bonus calculation with a deterministic score and a UTC-calendar-day streak derived from completed tasks. Creating, reopening, or deleting a task now changes the score only when the set of weighted completed tasks changes.
- Updated the dashboard to explain the point values, completed/important task counts, and the current streak. API failures are surfaced instead of being treated as successful responses.

## 5. Database Setup

After updating the Prisma schema, apply it to the PostgreSQL database before starting the server:

```bash
cd server
npx prisma db push
```

The previous implementation did not include migration history, so `db push` synchronizes the additive fields without assuming an existing migration baseline.

## 6. Deployment Links

- Frontend: Not deployed
- Backend: Not deployed

Deployment requires hosting accounts and database credentials that are not available in this workspace.
