import {useEffect, useState } from 'react'
import './PlayVideo.css'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import { API_KEY, value_converter } from '../../Data'
import moment from 'moment'
import { useParams } from 'react-router-dom'

const PlayVideo = () => {

    const {videoId} = useParams();

    const [apiData,setApiData] = useState(null);
    const [channelData,setChannelData] = useState(null);
    const [commentData,setCommentData] = useState([]); 
    const [showComments, setShowComments] = useState(false);

    const fetchVideodata = async () => {

        const videoDetails_url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`;
        await fetch(videoDetails_url).then(res=>res.json()).then(data=>setApiData(data.items[0]));
    }

    const fetchChannelData = async () => {

        const channelData_url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
        await fetch(channelData_url).then(res=>res.json()).then(data=>setChannelData(data.items[0]))

        const comment_url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&maxResults=50&videoId=${videoId}&key=${API_KEY}`;   
        await fetch(comment_url).then(res=>res.json()).then(data=>setCommentData(data.items))
    }
    useEffect(()=>{
        fetchVideodata();
    },[videoId])

    useEffect(()=>{
        fetchChannelData();
    },[apiData])
  return (
    <div className='play-video'>
        {/*<video src={video1} controls autoPlay muted></video>*/}
        <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            title={apiData?.snippet?.title || "YouTube video player"}
        ></iframe>

        <h3>{apiData?apiData.snippet.title:"Title Here"}</h3>
        <div className="play-video-info">
            <p>{apiData?value_converter(apiData.statistics.viewCount):"16K"} Views &bull; {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""}</p>
            <div>
                <span><img src={like} alt="" />{apiData?value_converter(apiData.statistics.likeCount):155}</span>
                <span><img src={dislike} alt="" /></span>
                <span><img src={share} alt="" />Share</span>
                <span><img src={save} alt="" />Save</span>
            </div>
        </div>  
            <hr/>
            <div className='publisher'>
                <img src={channelData?channelData.snippet.thumbnails.default.url:""} alt="" />
                <div>
                    <p>{apiData?apiData.snippet.channelTitle:""}</p>
                    <span>{channelData?value_converter(channelData.statistics.subscriberCount):100} Subscribers</span>
                </div>
                <button>Subscribe</button>
            </div>
       
        <div className="vid-description">
            <p>{apiData?apiData.snippet.description.slice(0,250):"Description Here"}</p>
            <p>Subscribe Greatstack to watch More tutorials on web Development</p>
            <hr/>
            <div className="comments-section">
                <div className="comments-header" onClick={() => setShowComments(!showComments)}>
                    <h4>{apiData?value_converter(apiData.statistics.commentCount):102} Comments</h4>
                    <span className={`dropdown-arrow ${showComments ? 'open' : ''}`}>▼</span>
                </div>
                <div className={`comments-container ${showComments ? 'show' : ''}`}>
                    {commentData.map((item,index)=>{
                        return(
                    <div key={index} className="comment">
                        <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
                        <div>
                            <h3>{item.snippet.topLevelComment.snippet.authorDisplayName} <span>1 day ago</span></h3>
                            <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                            <div className='comment-action'>
                                <img src={like} alt="" />
                                <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                                <img src={dislike} alt="" />
                            </div>
                        </div>
                    </div>

                        )
                    })}
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default PlayVideo