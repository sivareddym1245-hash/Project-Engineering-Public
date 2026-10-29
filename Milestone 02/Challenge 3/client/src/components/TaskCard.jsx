import React, { useState } from 'react';
import { updateTaskStatus, updateTaskImportance, deleteTaskFromApi } from '../services/api';
import { Trash2, Check, Star } from 'lucide-react';

const TaskCard = ({ task, onTaskUpdated }) => {
  const [error, setError] = useState('');

  const handleToggle = async () => {
    setError('');
    try {
      await updateTaskStatus(task.id, !task.completed);
      onTaskUpdated();
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.message);
    }
  };

  const handleImportanceToggle = async () => {
    setError('');
    try {
      await updateTaskImportance(task.id, !task.isImportant);
      onTaskUpdated();
    } catch (err) {
      console.error('Error updating task importance:', err);
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    setError('');
    try {
      await deleteTaskFromApi(task.id);
      onTaskUpdated();
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.message);
    }
  };

  return (
    <div className={`task-card-v2 animate-fade ${task.completed ? 'completed' : ''}`}>
      <div className="task-main">
        <button
          type="button"
          className={`custom-checkbox ${task.completed ? 'checked' : ''}`}
          onClick={handleToggle}
          aria-label={task.completed ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}
          aria-pressed={task.completed}
        >
          {task.completed && <Check size={16} strokeWidth={4} />}
        </button>
        <div>
          <span className="task-text">{task.title}</span>
          {error && <p className="form-error" role="alert">{error}</p>}
        </div>
      </div>

      <div className="task-actions">
        <button
          type="button"
          onClick={handleImportanceToggle}
          className={`action-btn ${task.isImportant ? 'important-active' : ''}`}
          title={task.isImportant ? 'Remove importance' : 'Mark as important'}
          aria-label={task.isImportant ? `Remove importance from ${task.title}` : `Mark ${task.title} as important`}
          aria-pressed={task.isImportant}
        >
          <Star size={18} fill={task.isImportant ? 'currentColor' : 'none'} />
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="action-btn"
          title="Delete Task"
          aria-label={`Delete ${task.title}`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
