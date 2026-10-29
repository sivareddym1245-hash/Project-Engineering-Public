const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateProductivity } = require('./scoreHelper');

const task = (completed, isImportant = false, completedAt = null) => ({
  completed,
  isImportant,
  completedAt
});

test('scores completed tasks by importance and ignores unfinished tasks', () => {
  const result = calculateProductivity([
    task(true),
    task(true, true),
    task(false, true)
  ]);

  assert.equal(result.value, 30);
  assert.equal(result.completedTaskCount, 2);
  assert.equal(result.importantTaskCount, 1);
});

test('counts one streak day when at least one task was completed that day', () => {
  const now = new Date('2026-10-29T12:00:00.000Z');
  const result = calculateProductivity([
    task(true, false, new Date('2026-10-29T01:00:00.000Z')),
    task(true, true, new Date('2026-10-29T21:00:00.000Z')),
    task(true, false, new Date('2026-10-28T22:00:00.000Z')),
    task(true, false, new Date('2026-10-27T09:00:00.000Z'))
  ], now);

  assert.equal(result.streakDays, 3);
});

test('keeps yesterday streaks active and resets after a missed day', () => {
  const now = new Date('2026-10-29T12:00:00.000Z');

  assert.equal(calculateProductivity([
    task(true, false, new Date('2026-10-28T22:00:00.000Z'))
  ], now).streakDays, 1);

  assert.equal(calculateProductivity([
    task(true, false, new Date('2026-10-27T22:00:00.000Z'))
  ], now).streakDays, 0);
});
