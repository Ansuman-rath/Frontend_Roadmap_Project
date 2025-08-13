import React, { useState } from 'react';
import { SubredditLane as SubredditLaneType } from '../types/reddit';
import PostItem from './PostItem';
import './SubredditLane.css';

interface SubredditLaneProps {
  lane: SubredditLaneType;
  onRefresh: () => void;
  onDelete: () => void;
}

const SubredditLane: React.FC<SubredditLaneProps> = ({ lane, onRefresh, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleRefresh = () => {
    setShowMenu(false);
    onRefresh();
  };

  const handleDelete = () => {
    setShowMenu(false);
    onDelete();
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp * 1000;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="subreddit-lane">
      <div className="lane-header">
        <h3 className="lane-title">r/{lane.name}</h3>
        <div className="lane-actions">
          <button 
            className="menu-button"
            onClick={handleMenuToggle}
            aria-label="Lane options"
          >
            ⋮
          </button>
          
          {showMenu && (
            <div className="lane-menu">
              <button 
                className="menu-item refresh"
                onClick={handleRefresh}
                disabled={lane.loading}
              >
                <span className="menu-icon">↻</span>
                Refresh
              </button>
              <button 
                className="menu-item delete"
                onClick={handleDelete}
              >
                <span className="menu-icon">🗑</span>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="lane-content">
        {lane.loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading posts...</p>
          </div>
        )}

        {lane.error && (
          <div className="error-state">
            <p className="error-message">{lane.error}</p>
            <button className="retry-button" onClick={onRefresh}>
              Retry
            </button>
          </div>
        )}

        {!lane.loading && !lane.error && lane.posts.length === 0 && (
          <div className="empty-state">
            <p>No posts found</p>
          </div>
        )}

        {!lane.loading && !lane.error && lane.posts.length > 0 && (
          <>
            <div className="posts-list">
              {lane.posts.map(post => (
                <PostItem key={post.id} post={post} />
              ))}
            </div>
            <div className="lane-footer">
              <small>Last updated: {formatTime(lane.lastUpdated / 1000)}</small>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubredditLane; 