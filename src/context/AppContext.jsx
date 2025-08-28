import React, { useState, useEffect } from 'react';
import { AppContext } from './AppContextProvider';

export const AppProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [subscribedChannels, setSubscribedChannels] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedSearchHistory = localStorage.getItem('searchHistory');
    const savedWatchHistory = localStorage.getItem('watchHistory');
    const savedLikedVideos = localStorage.getItem('likedVideos');
    const savedSubscribedChannels = localStorage.getItem('subscribedChannels');

    if (savedDarkMode) setIsDarkMode(JSON.parse(savedDarkMode));
    if (savedSearchHistory) setSearchHistory(JSON.parse(savedSearchHistory));
    if (savedWatchHistory) setWatchHistory(JSON.parse(savedWatchHistory));
    if (savedLikedVideos) setLikedVideos(JSON.parse(savedLikedVideos));
    if (savedSubscribedChannels) setSubscribedChannels(JSON.parse(savedSubscribedChannels));
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem('watchHistory', JSON.stringify(watchHistory));
  }, [watchHistory]);

  useEffect(() => {
    localStorage.setItem('likedVideos', JSON.stringify(likedVideos));
  }, [likedVideos]);

  useEffect(() => {
    localStorage.setItem('subscribedChannels', JSON.stringify(subscribedChannels));
  }, [subscribedChannels]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const addToSearchHistory = (query) => {
    if (query && !searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev].slice(0, 10)); // Keep last 10 searches
    }
  };

  const addToWatchHistory = (video) => {
    setWatchHistory(prev => {
      const filtered = prev.filter(v => v.id !== video.id);
      return [video, ...filtered].slice(0, 50); // Keep last 50 videos
    });
  };

  const toggleLikeVideo = (video) => {
    setLikedVideos(prev => {
      const isLiked = prev.some(v => v.id === video.id);
      if (isLiked) {
        return prev.filter(v => v.id !== video.id);
      } else {
        return [video, ...prev];
      }
    });
  };

  const toggleSubscribeChannel = (channel) => {
    setSubscribedChannels(prev => {
      const isSubscribed = prev.some(c => c.id === channel.id);
      if (isSubscribed) {
        return prev.filter(c => c.id !== channel.id);
      } else {
        return [channel, ...prev];
      }
    });
  };

  const isChannelSubscribed = (channelId) => {
    return subscribedChannels.some(c => c.id === channelId);
  };

  const isVideoLiked = (videoId) => {
    return likedVideos.some(v => v.id === videoId);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const clearWatchHistory = () => {
    setWatchHistory([]);
  };

  const value = {
    isDarkMode,
    isLoading,
    searchHistory,
    watchHistory,
    likedVideos,
    subscribedChannels,
    toggleDarkMode,
    setIsLoading,
    addToSearchHistory,
    addToWatchHistory,
    toggleLikeVideo,
    toggleSubscribeChannel,
    isChannelSubscribed,
    isVideoLiked,
    clearSearchHistory,
    clearWatchHistory
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
