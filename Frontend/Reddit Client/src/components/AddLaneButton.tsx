import React, { useState } from 'react';
import './AddLaneButton.css';

interface AddLaneButtonProps {
  show: boolean;
  onToggle: () => void;
  onAdd: (subredditName: string) => Promise<void>;
}

const AddLaneButton: React.FC<AddLaneButtonProps> = ({ show, onToggle, onAdd }) => {
  const [subredditName, setSubredditName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subredditName.trim()) {
      setError('Please enter a subreddit name');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onAdd(subredditName);
      setSubredditName('');
      onToggle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add subreddit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSubredditName('');
    setError('');
    onToggle();
  };

  return (
    <div className="add-lane-container">
      <button 
        className="add-lane-button"
        onClick={onToggle}
        aria-label="Add new subreddit lane"
      >
        <span className="plus-icon">+</span>
      </button>

      {show && (
        <div className="add-lane-popup">
          <div className="popup-header">
            <h3>Enter the name of subreddit</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="add-lane-form">
            <input
              type="text"
              value={subredditName}
              onChange={(e) => setSubredditName(e.target.value)}
              placeholder="e.g., learnprogramming"
              className="subreddit-input"
              disabled={isSubmitting}
              autoFocus
            />
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="cancel-button"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="add-button"
                disabled={isSubmitting || !subredditName.trim()}
              >
                {isSubmitting ? 'Adding...' : 'Add Subreddit'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddLaneButton; 