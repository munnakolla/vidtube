// Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import menu_icon from '../../assets/menu.png';
import logo from '../../assets/logo.png';
import search_icon from '../../assets/search.png';
import upload_icon from '../../assets/upload.png';
import notification_icon from '../../assets/notification.png';
import profile_icon from '../../assets/jack.png';
import voice_search from '../../assets/voice-search.png';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';

const Navbar = ({ setSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isVoiceSearch, setIsVoiceSearch] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef();
  const userMenuRef = useRef();
  
  const { 
    isDarkMode, 
    toggleDarkMode, 
    searchHistory, 
    addToSearchHistory,
    clearSearchHistory 
  } = useApp();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleSearch = (e, query = searchQuery) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (query.trim()) {
        addToSearchHistory(query.trim());
        navigate(`/search/${query.trim()}`);
        setShowSearchSuggestions(false);
        setSearchQuery('');
      }
    }
  };

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      setIsVoiceSearch(true);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        handleSearch({ type: 'click' }, transcript);
      };
      
      recognition.onerror = () => {
        setIsVoiceSearch(false);
      };
      
      recognition.onend = () => {
        setIsVoiceSearch(false);
      };
      
      recognition.start();
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className='flex-div'>
      <div className='nav-left flex-div'>
        <img
          className="menu-icon"
          onClick={() => setSidebar(prev => !prev)}
          src={menu_icon}
          alt="Menu"
        />
        <Link to="/">
          <img className="logo" src={logo} alt="VidTube" />
        </Link>
      </div>

      <div className='nav-middle flex-div' ref={searchRef}>
        <div className='search-box flex-div'>
          <input
            type='text'
            placeholder='Search'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            onFocus={() => setShowSearchSuggestions(true)}
          />
          <img src={search_icon} alt="Search" onClick={handleSearch} />
          <img 
            src={voice_search} 
            alt="Voice Search" 
            className={`voice-search ${isVoiceSearch ? 'active' : ''}`}
            onClick={handleVoiceSearch}
          />
        </div>
        
        {showSearchSuggestions && searchHistory.length > 0 && (
          <div className="search-suggestions">
            <div className="suggestions-header">
              <span>Recent searches</span>
              <button onClick={clearSearchHistory}>Clear all</button>
            </div>
            {searchHistory.map((query, index) => (
              <div 
                key={index} 
                className="suggestion-item"
                onClick={() => handleSearch({ type: 'click' }, query)}
              >
                <img src={search_icon} alt="" />
                <span>{query}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="nav-right flex-div">
        <button 
          className="theme-toggle"
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        
        <img src={upload_icon} alt="Upload" title="Create" />
        <img src={notification_icon} alt="Notifications" title="Notifications" />
        
        <div className="user-menu-container" ref={userMenuRef}>
          <img 
            src={profile_icon} 
            className="user-icon" 
            alt="Profile" 
            onClick={() => setShowUserMenu(!showUserMenu)}
          />
          
          {showUserMenu && (
            <div className="user-menu">
              <div className="user-info">
                <img src={profile_icon} alt="Profile" />
                <div>
                  <h4>User Name</h4>
                  <p>user@example.com</p>
                </div>
              </div>
              <hr />
              <Link to="/history" className="menu-item">
                <span>📺</span> Watch history
              </Link>
              <Link to="/liked" className="menu-item">
                <span>👍</span> Liked videos
              </Link>
              <Link to="/subscriptions" className="menu-item">
                <span>📋</span> Subscriptions
              </Link>
              <hr />
              <div className="menu-item" onClick={toggleDarkMode}>
                <span>{isDarkMode ? '☀️' : '🌙'}</span> 
                {isDarkMode ? 'Light mode' : 'Dark mode'}
              </div>
              <div className="menu-item">
                <span>⚙️</span> Settings
              </div>
              <div className="menu-item">
                <span>🚪</span> Sign out
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
