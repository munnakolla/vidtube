import React from 'react';
import './LikedVideos.css';
import { useApp } from '../../hooks/useApp';
import { Link } from 'react-router-dom';

const LikedVideos = () => {
  const { likedVideos } = useApp();

  if (likedVideos.length === 0) {
    return (
      <div className="liked-page">
        <div className="empty-state">
          <div className="empty-icon">👍</div>
          <h2>No liked videos</h2>
          <p>Videos you like will appear here</p>
          <Link to="/" className="btn-primary">Start exploring</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="liked-page">
      <div className="liked-header">
        <h1>Liked Videos</h1>
        <p>{likedVideos.length} video{likedVideos.length !== 1 ? 's' : ''}</p>
      </div>
      
      <div className="liked-grid">
        {likedVideos.map((video, index) => (
          <Link 
            key={`${video.id}-${index}`} 
            to={`/video/0/${video.id}`} 
            className="liked-card"
          >
            <img 
              src={video.thumbnail} 
              alt={video.title}
              className="liked-thumbnail"
            />
            <div className="liked-info">
              <h3>{video.title}</h3>
              <p>{video.channelTitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LikedVideos;
