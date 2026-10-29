import React, { useState } from 'react';
import { createTask } from '../services/api';
import { Plus } from 'lucide-react';

const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    setError('');
    try {
      await createTask(title, isImportant);
      setTitle('');
      setIsImportant(false);
      onTaskCreated();
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-card animate-fade">
      <h4>Create New Task</h4>
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Focus on what matters..."
            className="styled-input"
          />
        </div>
        <label className="important-option">
          <input
            type="checkbox"
            checked={isImportant}
            onChange={(e) => setIsImportant(e.target.checked)}
          />
          <span>Important task (worth 20 points)</span>
        </label>
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          <Plus size={20} strokeWidth={3} />
          <span>{isSubmitting ? 'Adding...' : 'Quick Add'}</span>
        </button>
      </form>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid #f1f5f9' }}>
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
          Completed tasks earn 10 points, or 20 points when marked important.
        </p>
      </div>
    </div>
  );
};

export default TaskForm;
