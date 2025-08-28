import React from 'react';
import './History.css';
import { useApp } from '../../hooks/useApp';
import { Link } from 'react-router-dom';
import moment from 'moment';

const History = () => {
  const { watchHistory, clearWatchHistory } = useApp();

  if (watchHistory.length === 0) {
    return (
      <div className="history-page">
        <div className="empty-state">
          <div className="empty-icon">📺</div>
          <h2>No watch history</h2>
          <p>Videos you watch will appear here</p>
          <Link to="/" className="btn-primary">Start watching</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Watch History</h1>
        <button onClick={clearWatchHistory} className="btn-secondary">
          Clear all watch history
        </button>
      </div>
      
      <div className="history-list">
        {watchHistory.map((video, index) => (
          <Link 
            key={`${video.id}-${index}`} 
            to={`/video/0/${video.id}`} 
            className="history-item"
          >
            <img 
              src={video.thumbnail} 
              alt={video.title}
              className="history-thumbnail"
            />
            <div className="history-info">
              <h3>{video.title}</h3>
              <p>{video.channelTitle}</p>
              <p>Watched {moment(video.publishedAt).fromNow()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default History;
