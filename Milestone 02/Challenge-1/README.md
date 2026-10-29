# FocusForge Productivity

FocusForge is a lightweight productivity application designed to help users manage their daily tasks. This repository serves as a starter project for students to explore, analyze, and improve both code architecture and product design.

---

## Features

### Task Management
- Add new tasks
- View a list of existing tasks
- Mark tasks as completed

### Task Progress
- See completed and remaining task counts at a glance
- Track completion with a progress bar that updates as tasks change

---

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js with Express
- **Database:** PostgreSQL with Prisma ORM

---

## Getting Started

### Prerequisites

Before running the project, ensure the following tools are installed:

- Node.js (v16 or higher)
- PostgreSQL running locally

---

### 1. Clone the Repository

```bash
git clone <repo-url>
cd focusforge-productivity
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies.

```bash
cd server
npm install
```

Create a `.env` file by copying `.env.example` and update the `DATABASE_URL` with your PostgreSQL credentials.

Run database migrations.

```bash
npx prisma migrate dev --name init
```

Start the backend server.

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory.

```bash
cd client
npm install
npm run dev
```

The application should now be running locally.

---

## Project Goal

FocusForge is designed to help users stay organized and productive by managing their tasks. The dashboard's progress tracker summarizes task completion using the tasks already loaded in the application.

---

## Your Challenge

The original Motivation Mode displayed a random motivational quote. This implementation replaces it with a task progress tracker, so the dashboard provides direct feedback about users' actual work.

Your solution should integrate with the existing codebase and improve the overall product experience without breaking the current functionality of the application.

---

## Submission Expectations

When completing this challenge, ensure that:

- The application continues to run correctly
- Any improvements integrate properly with the existing structure
- Your reasoning and changes are documented in `Changes.md`

---

## Notes

In real engineering environments, developers often inherit features that were built with good intentions but may not ultimately improve the product experience.

This challenge focuses on evaluating existing functionality and making thoughtful improvements to the product.
