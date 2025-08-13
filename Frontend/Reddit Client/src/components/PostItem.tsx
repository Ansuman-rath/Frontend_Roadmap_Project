import React from 'react';
import { RedditPost } from '../types/reddit';
import './PostItem.css';

interface PostItemProps {
  post: RedditPost;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const formatScore = (score: number): string => {
    if (score >= 1000) {
      return (score / 1000).toFixed(1) + 'k';
    }
    return score.toString();
  };

  const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp * 1000;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'now';
  };

  const handlePostClick = () => {
    window.open(`https://reddit.com${post.permalink}`, '_blank');
  };

  return (
    <div className="post-item" onClick={handlePostClick}>
      <div className="post-votes">
        <div className="vote-arrow">▲</div>
        <div className="vote-count">{formatScore(post.score)}</div>
      </div>
      
      <div className="post-content">
        <h4 className="post-title">{post.title}</h4>
        <div className="post-meta">
          <span className="post-author">u/{post.author}</span>
          <span className="post-time">{formatTime(post.created_utc)}</span>
          <span className="post-comments">{post.num_comments} comments</span>
        </div>
      </div>
    </div>
  );
};

export default PostItem; 