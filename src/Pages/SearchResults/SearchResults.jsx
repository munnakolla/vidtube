// Pages/SearchResults/SearchResults.jsx
import './SearchResults.css';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_KEY, value_converter } from '../../Data';
import moment from 'moment';

const SearchResults = () => {
  const { query } = useParams();
  const [videos, setVideos] = useState([]);
  const [channelIcons, setChannelIcons] = useState({});

  const fetchSearchResults = async () => {
    const search_url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${query}&type=video&key=${API_KEY}`;
    const res = await fetch(search_url);
    const data = await res.json();

    if (data.items) {
      setVideos(data.items);
      fetchChannelIcons(data.items);
    }
  };

  const fetchChannelIcons = async (videoItems) => {
    const channelIds = [...new Set(videoItems.map((item) => item.snippet.channelId))];
    const channel_url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds.join(',')}&key=${API_KEY}`;
    const res = await fetch(channel_url);
    const data = await res.json();

    if (data.items) {
      const icons = {};
      data.items.forEach((channel) => {
        icons[channel.id] = channel.snippet.thumbnails.default.url;
      });
      setChannelIcons(icons);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [query]);

  return (
    <div className="search-results">
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
          />
          <div className="video-info">
            <h4>{item.snippet.title}</h4>
            <div className="channel-info">
              {channelIcons[item.snippet.channelId] && (
                <img
                  className="channel-icon"
                  src={channelIcons[item.snippet.channelId]}
                  alt={item.snippet.channelTitle}
                />
              )}
              <p>{item.snippet.channelTitle}</p>
            </div>
            <p>{moment(item.snippet.publishedAt).fromNow()}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SearchResults;
