# VidTube - Full-Featured YouTube Clone

A fully functional YouTube clone built with React, featuring real YouTube API integration, modern UI/UX, and comprehensive functionality.

## 🚀 Features

### Core Functionality
- **Video Browsing**: Browse trending videos by categories
- **Video Playback**: Watch videos with embedded YouTube player
- **Search**: Advanced search with autocomplete and search history
- **Comments**: View and add comments (simulated for demo)
- **Responsive Design**: Optimized for desktop, tablet, and mobile

### Advanced Features
- **Dark/Light Mode**: Toggle between themes with persistence
- **Voice Search**: Search using voice commands (Web Speech API)
- **Watch History**: Track and view previously watched videos
- **Liked Videos**: Like videos and view your liked collection
- **Subscriptions**: Subscribe to channels and manage subscriptions
- **Loading States**: Skeleton loading and proper error handling
- **Infinite Scroll**: Load more search results dynamically

### User Experience
- **Context API**: Global state management for user preferences
- **Local Storage**: Persist user data across sessions
- **Error Boundaries**: Graceful error handling
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance**: Lazy loading and optimized API calls

## 🛠️ Technology Stack

- **Frontend**: React 19.1.1
- **Build Tool**: Vite 7.1.0
- **Routing**: React Router DOM 7.8.0
- **Styling**: CSS3 with CSS Variables
- **API**: YouTube Data API v3
- **Date Handling**: Moment.js
- **State Management**: React Context API

## 📁 Project Structure

```
src/
├── components/
│   ├── ErrorBoundary/     # Error handling component
│   ├── Feed/              # Video grid component
│   ├── LoadingSpinner/    # Loading states
│   ├── Navbar/            # Navigation with search
│   │   └── Sidebar/       # Category navigation
│   ├── PlayVideo/         # Video player page
│   └── Recommended/       # Related videos
├── context/
│   └── AppContext.jsx     # Global state management
├── Pages/
│   ├── History/           # Watch history page
│   ├── Home/              # Main page
│   ├── LikedVideos/       # Liked videos page
│   ├── SearchResults/     # Search results page
│   ├── Subscriptions/     # Subscriptions page
│   └── Video/             # Individual video page
├── assets/                # Images and icons
├── App.jsx               # Main app component
├── Data.js               # API configuration
├── index.css             # Global styles
└── main.jsx              # App entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- YouTube Data API v3 key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd youtube-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   - Get a YouTube Data API v3 key from [Google Cloud Console](https://console.cloud.google.com/)
   - Update `src/Data.js` with your API key:
   ```javascript
   export const API_KEY = 'your-api-key-here'
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## 📱 Features Breakdown

### 🎥 Video Browsing
- Grid layout with responsive design
- Category-based filtering
- Thumbnail with hover effects
- Video metadata (title, channel, views, date)

### 🔍 Advanced Search
- Real-time search with YouTube API
- Search history with autocomplete
- Voice search support
- Infinite scroll for results
- Channel avatars in results

### 🎮 Video Player
- Embedded YouTube player
- Like/dislike functionality
- Subscribe to channels
- Expandable descriptions
- Comments section with interactions
- Related videos sidebar

### 🌙 Theme System
- Light/dark mode toggle
- CSS variables for theming
- Auto dark mode on mobile
- Persistent theme preference

### 📱 User Features
- Watch history tracking
- Liked videos collection
- Channel subscriptions
- Search history
- Local storage persistence

### 🔧 Technical Features
- Error boundaries for stability
- Loading skeletons
- Responsive breakpoints
- Performance optimizations
- Accessibility features

## 🎨 Design System

### Color Scheme
- **Light Mode**: Clean white background with subtle shadows
- **Dark Mode**: Modern dark theme with proper contrast
- **Accent**: YouTube red (#ff0000) for branding

### Typography
- **Font**: Roboto for clean, readable text
- **Hierarchy**: Proper heading structure
- **Responsive**: Scales appropriately on all devices

### Layout
- **Grid System**: CSS Grid for responsive layouts
- **Flexbox**: For component alignment
- **Breakpoints**: 768px and 480px for responsive design

## 🚀 Build and Deploy

### Development
```bash
npm run dev          # Start development server
npm run lint         # Run ESLint
```

### Production
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Deployment
The app can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

## 🔧 Configuration

### Environment Variables
Create a `.env` file for environment-specific configurations:
```
VITE_YOUTUBE_API_KEY=your-api-key
VITE_APP_NAME=VidTube
```

### API Limits
- YouTube API has quota limits
- Implement caching for production use
- Consider using YouTube API alternatives for high traffic

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- YouTube API for data access
- React community for excellent tooling
- Vite for fast development experience
- Icons and assets from various sources

## 🐛 Known Issues

- Voice search requires HTTPS in production
- API quota limits may affect functionality
- Some features are simulated (actual commenting, uploading)

## 🔮 Future Enhancements

- [ ] User authentication
- [ ] Video upload functionality
- [ ] Real-time comments
- [ ] Playlist management
- [ ] Push notifications
- [ ] PWA support
- [ ] Video quality selection
- [ ] Keyboard shortcuts

---

**Built with ❤️ using React and YouTube API**
