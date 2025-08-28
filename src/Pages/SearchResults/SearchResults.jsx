// Pages/SearchResults/SearchResults.jsx
import './SearchResults.css';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_KEY } from '../../Data';
import moment from 'moment';
import { useApp } from '../../hooks/useApp';

const SearchResults = () => {
  const { query } = useParams();
  const [videos, setVideos] = useState([]);
  const [channelIcons, setChannelIcons] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  
  const { addToSearchHistory } = useApp();

  const fetchSearchResults = useCallback(async (pageToken = '') => {
    try {
      if (!pageToken) {
        setLoading(true);
        setError(null);
        addToSearchHistory(query);
      } else {
        setLoadingMore(true);
      }

      let search_url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`;
      
      if (pageToken) {
        search_url += `&pageToken=${pageToken}`;
      }

      const res = await fetch(search_url);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      if (data.items) {
        if (pageToken) {
          setVideos(prev => [...prev, ...data.items]);
        } else {
          setVideos(data.items);
        }
        setNextPageToken(data.nextPageToken || '');
        fetchChannelIcons(data.items);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [query, addToSearchHistory]);

  const fetchChannelIcons = async (videoItems) => {
    try {
      const channelIds = [...new Set(videoItems.map((item) => item.snippet.channelId))];
      const channel_url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds.join(',')}&key=${API_KEY}`;
      const res = await fetch(channel_url);
      const data = await res.json();

      if (data.items) {
        const icons = {};
        data.items.forEach((channel) => {
          icons[channel.id] = channel.snippet.thumbnails.default.url;
        });
        setChannelIcons(prev => ({ ...prev, ...icons }));
      }
    } catch (error) {
      console.error('Error fetching channel icons:', error);
    }
  };

  const loadMoreResults = () => {
    if (nextPageToken && !loadingMore) {
      fetchSearchResults(nextPageToken);
    }
  };

  useEffect(() => {
    if (query) {
      setVideos([]);
      setChannelIcons({});
      setNextPageToken('');
      fetchSearchResults();
    }
  }, [query, fetchSearchResults]);

  if (loading) {
    return (
      <div className="search-results">
        <div className="search-header">
          <h1>Searching for "{query}"...</h1>
        </div>
        <div className="search-loading">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="search-skeleton">
              <div className="skeleton-thumbnail"></div>
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-channel"></div>
                <div className="skeleton-views"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-results">
        <div className="search-error">
          <div className="error-icon">⚠️</div>
          <h3>Search failed</h3>
          <p>{error}</p>
          <button onClick={() => fetchSearchResults()} className="btn-primary">
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="search-results">
        <div className="search-header">
          <h1>Search results for "{query}"</h1>
        </div>
        <div className="no-results">
          <div className="error-icon">🔍</div>
          <h3>No results found</h3>
          <p>Try different keywords or check your spelling</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="search-header">
        <h1>Search results for "{query}"</h1>
        <p>{videos.length} video{videos.length !== 1 ? 's' : ''} found</p>
      </div>
      
      <div className="results-container">
        {videos.map((item) => (
          <Link
            key={item.id.videoId}
            to={`/video/${item.snippet.categoryId || '0'}/${item.id.videoId}`}
            className="video-card"
          >
            <img
              className="thumbnail"
              src={
                item.snippet.thumbnails.maxres?.url ||
                item.snippet.thumbnails.high?.url ||
                item.snippet.thumbnails.medium.url
              }
              alt={item.snippet.title}
              loading="lazy"
            />
            <div className="video-info">
              <h4>{item.snippet.title}</h4>
              <p className="video-date">{moment(item.snippet.publishedAt).fromNow()}</p>
              <div className="channel-info">
                {channelIcons[item.snippet.channelId] && (
                  <img
                    className="channel-icon"
                    src={channelIcons[item.snippet.channelId]}
                    alt={item.snippet.channelTitle}
                  />
                )}
                <p className="channel-name">{item.snippet.channelTitle}</p>
              </div>
              <p className="video-description">
                {item.snippet.description.slice(0, 120)}
                {item.snippet.description.length > 120 ? '...' : ''}
              </p>
            </div>
          </Link>
        ))}
      </div>
      
      {nextPageToken && (
        <div className="load-more-container">
          <button 
            onClick={loadMoreResults} 
            disabled={loadingMore}
            className="btn-secondary load-more-btn"
          >
            {loadingMore ? 'Loading...' : 'Load more results'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
