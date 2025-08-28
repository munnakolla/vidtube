import {useEffect, useState, useCallback } from 'react'
import './PlayVideo.css'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import { API_KEY, value_converter } from '../../Data'
import moment from 'moment'
import { useParams } from 'react-router-dom'
import { useApp } from '../../hooks/useApp'

const PlayVideo = () => {

    const {videoId} = useParams();

    const [apiData,setApiData] = useState(null);
    const [channelData,setChannelData] = useState(null);
    const [commentData,setCommentData] = useState([]); 
    const [showComments, setShowComments] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [showShareMenu, setShowShareMenu] = useState(false);
    
    const { 
        addToWatchHistory, 
        toggleLikeVideo, 
        toggleSubscribeChannel, 
        isChannelSubscribed, 
        isVideoLiked 
    } = useApp();

    const fetchVideodata = useCallback(async () => {
        try {
            const videoDetails_url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`;
            const response = await fetch(videoDetails_url);
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                setApiData(data.items[0]);
                
                // Add to watch history
                const videoData = {
                    id: data.items[0].id,
                    title: data.items[0].snippet.title,
                    thumbnail: data.items[0].snippet.thumbnails.medium.url,
                    channelTitle: data.items[0].snippet.channelTitle,
                    publishedAt: data.items[0].snippet.publishedAt
                };
                addToWatchHistory(videoData);
            }
        } catch (err) {
            console.error('Error fetching video data:', err);
        }
    }, [videoId, addToWatchHistory])

    const fetchChannelData = useCallback(async () => {
        if (!apiData) return;
        
        try {
            const channelData_url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
            const channelResponse = await fetch(channelData_url);
            const channelData = await channelResponse.json();
            
            if (channelData.items && channelData.items.length > 0) {
                setChannelData(channelData.items[0]);
            }

            const comment_url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&maxResults=50&videoId=${videoId}&key=${API_KEY}`;   
            const commentResponse = await fetch(comment_url);
            const commentData = await commentResponse.json();
            
            if (commentData.items) {
                setCommentData(commentData.items);
            }
        } catch (err) {
            console.error('Error fetching channel/comment data:', err);
        }
    }, [apiData, videoId])

    const handleLike = () => {
        if (apiData) {
            const videoData = {
                id: apiData.id,
                title: apiData.snippet.title,
                thumbnail: apiData.snippet.thumbnails.medium.url,
                channelTitle: apiData.snippet.channelTitle
            };
            toggleLikeVideo(videoData);
        }
    };

    const handleSubscribe = () => {
        if (channelData) {
            const channelInfo = {
                id: channelData.id,
                title: channelData.snippet.title,
                thumbnail: channelData.snippet.thumbnails.default.url,
                subscriberCount: channelData.statistics.subscriberCount
            };
            toggleSubscribeChannel(channelInfo);
        }
    };

    const handleShare = async () => {
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: apiData?.snippet?.title || 'YouTube Video',
                    url: videoUrl
                });
            } catch {
                console.log('Share cancelled');
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(videoUrl);
                alert('Video URL copied to clipboard!');
            } catch {
                setShowShareMenu(true);
            }
        }
    };

    const handleAddComment = () => {
        if (newComment.trim()) {
            // In a real app, this would send to an API
            const fakeComment = {
                snippet: {
                    topLevelComment: {
                        snippet: {
                            authorDisplayName: 'You',
                            authorProfileImageUrl: '/src/assets/user_profile.jpg',
                            textDisplay: newComment,
                            likeCount: 0,
                            publishedAt: new Date().toISOString()
                        }
                    }
                }
            };
            setCommentData(prev => [fakeComment, ...prev]);
            setNewComment('');
        }
    };

    useEffect(()=>{
        fetchVideodata();
    },[fetchVideodata])

    useEffect(()=>{
        fetchChannelData();
    },[fetchChannelData])

    if (!apiData) {
        return (
            <div className='play-video'>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading video...</p>
                </div>
            </div>
        );
    }

    const isLiked = isVideoLiked(videoId);
    const isSubscribed = isChannelSubscribed(apiData.snippet.channelId);

  return (
    <div className='play-video'>
        <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            title={apiData.snippet.title}
        ></iframe>

        <h3>{apiData.snippet.title}</h3>
        <div className="play-video-info">
            <p>{value_converter(apiData.statistics.viewCount)} Views &bull; {moment(apiData.snippet.publishedAt).fromNow()}</p>
            <div className="video-actions">
                <span 
                    className={`action-btn ${isLiked ? 'liked' : ''}`}
                    onClick={handleLike}
                >
                    <img src={like} alt="Like" />
                    {value_converter(apiData.statistics.likeCount)}
                </span>
                <span className="action-btn">
                    <img src={dislike} alt="Dislike" />
                </span>
                <span className="action-btn" onClick={handleShare}>
                    <img src={share} alt="Share" />
                    Share
                </span>
                <span className="action-btn">
                    <img src={save} alt="Save" />
                    Save
                </span>
            </div>
        </div>  
        <hr/>
        
        <div className='publisher'>
            <img src={channelData?.snippet?.thumbnails?.default?.url || ''} alt="Channel" />
            <div>
                <p>{apiData.snippet.channelTitle}</p>
                <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : '1M'} Subscribers</span>
            </div>
            <button 
                className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`}
                onClick={handleSubscribe}
            >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
       
        <div className="vid-description">
            <p className={`description-text ${showFullDescription ? 'expanded' : ''}`}>
                {showFullDescription 
                    ? apiData.snippet.description 
                    : apiData.snippet.description.slice(0, 250) + (apiData.snippet.description.length > 250 ? '...' : '')
                }
            </p>
            {apiData.snippet.description.length > 250 && (
                <button 
                    className="show-more-btn"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                >
                    {showFullDescription ? 'Show less' : 'Show more'}
                </button>
            )}
            
            <hr/>
            
            <div className="comments-section">
                <div className="comments-header" onClick={() => setShowComments(!showComments)}>
                    <h4>{value_converter(apiData.statistics.commentCount)} Comments</h4>
                    <span className={`dropdown-arrow ${showComments ? 'open' : ''}`}>▼</span>
                </div>
                
                <div className={`comments-container ${showComments ? 'show' : ''}`}>
                    <div className="add-comment">
                        <img src="/src/assets/user_profile.jpg" alt="Your profile" />
                        <div className="comment-input-container">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                            />
                            {newComment && (
                                <div className="comment-actions">
                                    <button onClick={() => setNewComment('')}>Cancel</button>
                                    <button onClick={handleAddComment} className="btn-primary">Comment</button>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {commentData.map((item,index)=>{
                        return(
                    <div key={index} className="comment">
                        <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="Commenter" />
                        <div>
                            <h3>
                                {item.snippet.topLevelComment.snippet.authorDisplayName} 
                                <span>{moment(item.snippet.topLevelComment.snippet.publishedAt).fromNow()}</span>
                            </h3>
                            <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                            <div className='comment-action'>
                                <img src={like} alt="Like" />
                                <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                                <img src={dislike} alt="Dislike" />
                                <span className="reply-btn">Reply</span>
                            </div>
                        </div>
                    </div>
                        )
                    })}
                </div>
            </div>
        </div>

        {showShareMenu && (
            <div className="share-menu-overlay" onClick={() => setShowShareMenu(false)}>
                <div className="share-menu" onClick={e => e.stopPropagation()}>
                    <h3>Share</h3>
                    <div className="share-options">
                        <div className="share-option" onClick={() => {
                            navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${videoId}`);
                            setShowShareMenu(false);
                            alert('Link copied!');
                        }}>
                            <span>🔗</span> Copy link
                        </div>
                        <div className="share-option" onClick={() => {
                            window.open(`https://twitter.com/intent/tweet?url=https://www.youtube.com/watch?v=${videoId}&text=${encodeURIComponent(apiData.snippet.title)}`);
                            setShowShareMenu(false);
                        }}>
                            <span>🐦</span> Share on Twitter
                        </div>
                        <div className="share-option" onClick={() => {
                            window.open(`https://www.facebook.com/sharer/sharer.php?u=https://www.youtube.com/watch?v=${videoId}`);
                            setShowShareMenu(false);
                        }}>
                            <span>📘</span> Share on Facebook
                        </div>
                    </div>
                    <button onClick={() => setShowShareMenu(false)}>Close</button>
                </div>
            </div>
        )}
    </div>
  )
}

export default PlayVideo