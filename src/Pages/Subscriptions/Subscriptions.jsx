import React from 'react';
import './Subscriptions.css';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { value_converter } from '../../Data';

const Subscriptions = () => {
  const { subscribedChannels } = useApp();

  if (subscribedChannels.length === 0) {
    return (
      <div className="subscriptions-page">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h2>No subscriptions</h2>
          <p>Channels you subscribe to will appear here</p>
          <Link to="/" className="btn-primary">Discover channels</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="subscriptions-page">
      <div className="subscriptions-header">
        <h1>Subscriptions</h1>
        <p>{subscribedChannels.length} channel{subscribedChannels.length !== 1 ? 's' : ''}</p>
      </div>
      
      <div className="subscriptions-grid">
        {subscribedChannels.map((channel, index) => (
          <div key={`${channel.id}-${index}`} className="subscription-card">
            <img 
              src={channel.thumbnail} 
              alt={channel.title}
              className="channel-avatar"
            />
            <div className="channel-info">
              <h3>{channel.title}</h3>
              <p>{value_converter(channel.subscriberCount)} subscribers</p>
              <button className="subscribed-btn">
                Subscribed ✓
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
