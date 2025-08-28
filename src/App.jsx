import React,{useState} from 'react'
import Navbar from './Components/Navbar/Navbar.jsx'
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home.jsx';
import Video from "./Pages/Home/Video/Video.jsx";
import SearchResults from './Pages/SearchResults/SearchResults.jsx';
import History from './Pages/History/History.jsx';
import LikedVideos from './Pages/LikedVideos/LikedVideos.jsx';
import Subscriptions from './Pages/Subscriptions/Subscriptions.jsx';

const App= () => {

  const [sidebar,setSidebar] = useState(true);

  return (
    <div>
      <Navbar setSidebar={setSidebar}/>
      <Routes>
        <Route path="/" element={<Home sidebar={sidebar} />} />
        <Route path="/video/:categoryId/:videoId"  element={<Video />}/>
        <Route path="/search/:query" element={<SearchResults />} />
        <Route path="/history" element={<History />} />
        <Route path="/liked" element={<LikedVideos />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
      </Routes>
    </div>
  );
}
export default App;
