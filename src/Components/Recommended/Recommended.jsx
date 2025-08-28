import {useState,useEffect,useCallback} from 'react'
import './Recommended.css'
import { API_KEY, value_converter } from '../../Data'
import { Link } from 'react-router-dom'

const Recommended = ({categoryId}) => {

    const [apiData,setApiData] = useState([]);

    const fetchData = useCallback(async () =>{

    const relatedVideo_url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=IN&videoCategoryId=${categoryId}&maxResults=45&key=${API_KEY}`;
    await fetch(relatedVideo_url).then(res=>res.json()).then(data=>setApiData(data.items));

    }, [categoryId]);

    useEffect(()=>{
        fetchData();
    },[fetchData])


  return (
    <div className='recommended'>
        {apiData.map((item,index)=>{
            return(
        <Link to={`/video/${item.snippet.categoryId}/${item.id}`} key={index} className='side-video-list'>
            <img src={item.snippet.thumbnails.maxres?.url ||
                      item.snippet.thumbnails.high?.url ||
                      item.snippet.thumbnails.medium.url} alt="" />
            <div className='vid-info'>
                <h4>{item.snippet.title}</h4>
                <p>{item.snippet.channelTitle}</p>
                <p>{value_converter(item.statistics.viewCount)} Views</p>
            </div>
        </Link>
            )
        })}
    </div>
  )
}

export default Recommended