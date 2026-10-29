# TaskNest

TaskNest is a task manager for making important work visible, building a consistent completion habit, and deciding what to focus on next.

## The problem

The problem I set out to solve is the difficulty of identifying which tasks matter and staying consistent without understanding how day-to-day actions affect progress. An unexplained productivity score does not help someone decide what to do next. TaskNest makes task importance visible, explains how completed work earns points, and shows a completion streak.

## Product and AI feature

TaskNest lets you create, prioritize, complete, and remove tasks. Its AI Planner turns a goal and your open tasks into a short set of suggested next steps. Important tasks are included first. The AI only recommends; it never creates, edits, or completes a task for you.

The planner calls OpenAI's `gpt-4o-mini` model from the backend. The backend function `generateTaskPlan` is in [`server/services/aiPlanner.js`](./server/services/aiPlanner.js); `POST /ai/plan` is routed through [`server/routes/ai.js`](./server/routes/ai.js) and handled by [`server/controllers/aiController.js`](./server/controllers/aiController.js). `OPENAI_API_KEY` stays on the server and is never bundled into the frontend. The backend limits planner requests to 10 per IP every 15 minutes.

## Productivity score

The score is derived from completed tasks instead of being incremented as a side effect of API calls:

- Completed regular task: **10 points**
- Completed important task: **20 points**
- An unfinished task: **0 points**

The consecutive-day streak counts UTC calendar days with at least one completed task. These rules live in the pure, deterministic `calculateProductivity` function in [`server/utils/scoreHelper.js`](./server/utils/scoreHelper.js). Keeping calculation separate from database reads makes the rules easy to test with fixed task data and a fixed clock; creating, reopening, or deleting a task cannot accidentally award duplicate points.

## AI-assisted code and intentional exclusions

AI assistance in this iteration drafted the backend planner service/controller and the React planner page. The task CRUD, Prisma model, dashboard, and productivity scoring implementation were already in the project; the score formula is tested separately from the AI call. Review [`server/services/aiPlanner.test.js`](./server/services/aiPlanner.test.js) for provider-request, missing-key, provider-error, and empty-output cases.

This version intentionally excludes user accounts, calendar/deadline integrations, automatic task changes, persistent AI conversation history, and AI-generated task creation. The model receives the submitted goal and up to 30 open task titles with importance flags; do not enter passwords or sensitive information.

## Model cost estimate

Estimate for **100 planner requests per month**, assuming about **1,000 input tokens** (system instructions and task context) and **300 output tokens** per request:

- Input: `100 × 1,000 ÷ 1,000,000 × $0.15 = $0.015`
- Output: `100 × 300 ÷ 1,000,000 × $0.60 = $0.018`
- **Estimated model usage: $0.015 + $0.018 = $0.033/month (about $0.03).**

This estimate uses the published GPT-4o mini rates of $0.15 per million input tokens and $0.60 per million output tokens. Actual charges vary with prompt size, usage, provider pricing, and taxes. It excludes web hosting, PostgreSQL, and any usage above this estimate. See [OpenAI API pricing](https://openai.com/api/pricing/).

## Walkthrough

[`TaskNest-Walkthrough.mp4`](./TaskNest-Walkthrough.mp4) is a computer-narrated local visual walkthrough. It demonstrates the dashboard, task list, planner UI, scoring-function design, backend AI flow, and cost estimate. To be explicit, it uses sample tasks and a simulated planner response; it is not a public-site recording or a live OpenAI demonstration.

## Run locally

Requirements: Node.js 20+ and a PostgreSQL database.

1. Configure the backend environment:

   ```powershell
   cd server
   Copy-Item .env.example .env
   ```

   Set `DATABASE_URL` in `server/.env`. Add an OpenAI API key to `OPENAI_API_KEY` to use the planner; without it, the rest of the app runs but the planner returns a clear configuration error.

2. Install dependencies, sync the database schema, and start the backend:

   ```powershell
   npm install
   npx prisma db push
   npm run dev
   ```

   `GET http://localhost:5000/health` returns `{"status":"ok"}` when the database is ready and `503` otherwise.

3. In a second terminal, start the frontend:

   ```powershell
   cd client
   Copy-Item .env.example .env
   npm install
   npm run dev
   ```

   Set `VITE_API_URL` in `client/.env` to the backend origin when it is not `http://localhost:5000`.

## Deployment status

- Frontend: **Not deployed**
- Backend: **Not deployed**

There are no live TaskNest URLs to verify yet. Deployment requires a public PostgreSQL database, an OpenAI API key saved as a backend-only secret, and frontend/backend hosting configuration. For deployment, configure `DATABASE_URL`, `OPENAI_API_KEY`, and `OPENAI_MODEL` on the backend, and `VITE_API_URL` on the frontend; rebuild the frontend after setting its API URL. Do not commit `.env` files or API keys.
