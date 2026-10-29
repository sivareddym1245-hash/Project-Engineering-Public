import React, { useState, useEffect } from 'react';
import { fetchScore } from '../services/api';
import { Award, Flame } from 'lucide-react';

const ScoreWidget = ({ tasks }) => {
  const [score, setScore] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const getScore = async () => {
      try {
        const data = await fetchScore();
        setScore(data);
        setError('');
      } catch (err) {
        console.error('Error fetching score:', err);
        setError(err.message);
      }
    };
    getScore();
  }, [tasks]);

  return (
    <div className="score-hero-card">
      <div className="score-hero-left">
        <h2>Your Productivity</h2>
        <div className="score-big">
          {score ? score.value : '--'}
          <span>pts</span>
        </div>
        <p style={{ marginTop: '1rem', opacity: 0.7 }}>
          10 points per completed task; important tasks earn 20.
        </p>
        <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>
          Your streak counts consecutive UTC days with at least one completion.
        </p>
        {error && <p className="score-error" role="alert">{error}</p>}
      </div>
      <div className="score-hero-right">
        <div className="status-badge" style={{ marginBottom: '1rem' }}>
          <Flame size={16} />
          {error
            ? 'Streak unavailable'
            : score
              ? score.streakDays > 0
                ? `${score.streakDays}-day completion streak`
                : 'Start a streak today'
              : 'Loading streak...'}
        </div>
        <div className="logo-icon" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: 'white' }}>
          <Award size={48} />
        </div>
        {score && (
          <p className="score-breakdown">
            {score.completedTaskCount} completed · {score.importantTaskCount} important
          </p>
        )}
      </div>
    </div>
  );
};

export default ScoreWidget;
