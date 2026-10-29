const calculateProductivity = (tasks, now = new Date()) => {
  const completedTasks = tasks.filter((task) => task.completed);
  const completedDays = new Set(
    completedTasks
      .filter((task) => task.completedAt instanceof Date && !Number.isNaN(task.completedAt.getTime()))
      .map((task) => task.completedAt.toISOString().slice(0, 10))
  );
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const todayKey = new Date(today).toISOString().slice(0, 10);
  const yesterdayKey = new Date(today - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  let streakDays = 0;
  let streakDate = completedDays.has(todayKey)
    ? today
    : completedDays.has(yesterdayKey)
      ? today - 24 * 60 * 60 * 1000
      : null;

  while (streakDate !== null) {
    const dayKey = new Date(streakDate).toISOString().slice(0, 10);
    if (!completedDays.has(dayKey)) break;
    streakDays += 1;
    streakDate -= 24 * 60 * 60 * 1000;
  }

  const importantTaskCount = completedTasks.filter((task) => task.isImportant).length;
  const regularTaskCount = completedTasks.length - importantTaskCount;

  return {
    value: regularTaskCount * 10 + importantTaskCount * 20,
    completedTaskCount: completedTasks.length,
    importantTaskCount,
    streakDays
  };
};

module.exports = {
  calculateProductivity
};
