import {useState,useEffect,useCallback} from "react";
import "./Feed.css";
import { Link } from "react-router-dom";
import { API_KEY ,value_converter} from "../../Data";
import moment from "moment";
import { useApp } from "../../hooks/useApp";

const Feed = ({category}) => {

    const [data,setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { setIsLoading } = useApp();

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            setIsLoading(true);
            
            const videoList_url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=100&regionCode=IN&videoCategoryId=${category}&key=${API_KEY}`;
            const response = await fetch(videoList_url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error.message);
            }
            
            setData(result.items || []);
        } catch (error) {
            console.error('Error fetching videos:', error);
            setError(error.message);
        } finally {
            setLoading(false);
            setIsLoading(false);
        }
    }, [category, setIsLoading]);

    useEffect(()=>{
        fetchData();
    },[fetchData])

    if (loading) {
        return (
            <div className="feed">
                {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="card skeleton">
                        <div className="skeleton-thumbnail"></div>
                        <div className="skeleton-content">
                            <div className="skeleton-title"></div>
                            <div className="skeleton-channel"></div>
                            <div className="skeleton-views"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="feed-error">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <h3>Something went wrong</h3>
                    <p>{error}</p>
                    <button onClick={fetchData} className="btn-primary">
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="feed-error">
                <div className="error-container">
                    <div className="error-icon">📺</div>
                    <h3>No videos found</h3>
                    <p>Try selecting a different category</p>
                </div>
            </div>
        );
    }

  return (
    <div className="feed">
        {data.map((item)=>{
            const thumbnail = item.snippet.thumbnails.maxres?.url ||
                            item.snippet.thumbnails.high?.url ||
                            item.snippet.thumbnails.medium.url;
            
            return(
        <Link key={item.id} to={`video/${item.snippet.categoryId}/${item.id}`} className="card">
            <img 
                src={thumbnail} 
                alt={item.snippet.title}
                loading="lazy"
                onError={(e) => {
                    e.target.src = item.snippet.thumbnails.medium.url;
                }}
            />
            <div className="card-content">
                <h2>{item.snippet.title}</h2>
                <h3>{item.snippet.channelTitle}</h3>
                <p>{value_converter(item.statistics.viewCount)} views &bull; {moment(item.snippet.publishedAt).fromNow()}</p>
            </div>
        </Link>
            )
        })}
    </div>
    
  );
};

export default Feed;
