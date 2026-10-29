export default function TaskProgressWidget({ tasks }) {
  const completedCount = tasks.filter((task) => task.completed).length;
  const totalCount = tasks.length;
  const remainingCount = totalCount - completedCount;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <section className="task-progress-widget" aria-labelledby="task-progress-title">
      <h3 id="task-progress-title">Your progress</h3>
      {totalCount === 0 ? (
        <p className="progress-message">Add a task to start tracking your progress.</p>
      ) : (
        <>
          <p className="progress-count">
            <strong>{completedCount}</strong> of {totalCount}{" "}
            {totalCount === 1 ? "task" : "tasks"} complete
          </p>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Task completion"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-valuetext={`${progress}% complete`}
          >
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="progress-message">
            {remainingCount === 0
              ? "All tasks complete. Nice work!"
              : `${remainingCount} ${remainingCount === 1 ? "task" : "tasks"} left to go.`}
          </p>
        </>
      )}
    </section>
  );
}
