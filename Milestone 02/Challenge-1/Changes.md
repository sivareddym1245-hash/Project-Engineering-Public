# Product Improvement: Task Progress

## What the original feature did

Motivation Mode displayed a randomly selected quote in the dashboard sidebar. The React widget requested a quote when it mounted and then repeated the request every five seconds, whether or not the user interacted with it.

## Why it was not effective

Quotes were passive and unrelated to the user's task list. They did not show what had been completed or help the user decide what remained. The periodic requests also spent network and server work refreshing content that did not reflect any change in productivity.

## What changed

The quote widget is replaced by a task progress panel. It derives the number of completed and remaining tasks and a completion percentage directly from the dashboard's existing task state. The panel updates as tasks are added or marked complete, and it has a clear empty state before the user adds a task. Its progress bar exposes its value to assistive technology.

The unused motivation API route, quote controller, and client API/component were removed. The task API and database schema remain unchanged.

## How this improves the application

Users now get immediate, actionable feedback about their task list instead of generic inspiration. The summary requires no extra network requests, stays synchronized with task updates, and uses the existing task data, keeping the change small and compatible with the current application structure. The layout also adapts the task and progress panels for narrow screens.
