import React, {useState} from 'react';
import './App.css';
import useSWR from 'swr'
import {get, isEmpty} from 'lodash'

import {twitchResponse} from './components/twitch-response'


/* 
Pagination figured out! 
I need user_name, game_id, thumbnail_url, title, viewer_count, started_at.
The viewer_count is displayed as an overlay on the thumbnail_url.
To find how long the streamer has been streaming, you check the `started_at` and compare that to what the time is now. 
Each stream has a `LIVE` tag in the top left of the thumbnail. Not sure if this is necessary since I'll only be displaying live streamers. 
How long the streamer has been streaming is in the top right of the thumbnail. 
I need to learn how to display items on top of the thumbnail. 
Do I want to have `tags` under each streamer? Tags are things like `Esports`, and `language`. 
tag_ids are displayed as a string of characters that will match up to a specific word. 
*/

const USER_ID = 'https://api.twitch.tv/helix/users?login=<username>' //Need to figure out how to use the input to replace the username
const STREAMS_URL = 'https://api.twitch.tv/helix/streams?user_id='
const BEARER_TOKEN = 'rxmpajjmb1jvrrad0tu2gth78sip0j'
const CLIENT_ID = '226970d9mbfxsg83n2taksg2c44hzs'

//I want to figure out why dotenv isn't working so I can stream my learning. 

function replaceThumbnailSize (url, size) {
  return url.replace(/{width}x{height}/, size)
}

function insertId (el, cursor) {
  if(!el) return;
  let url = 'https://api.twitch.tv/helix/users/follows?from_id=<user_id>&first=100'.replace(/<user_id>/, el)
  if(cursor) {
    url = url + '&after=' + cursor
  } 
  return url
}

function insertUsername (url, el) {
  return url.replace(/<username>/, el)
}

function App() {

  
  async function getData(url, data) { //look into axios possibly (*side project*)
    const response = await fetch(url, {
      headers: ({
        'Authorization': `Bearer ` + BEARER_TOKEN,
        'Client-ID': CLIENT_ID
      }),
    });
    return response.json(); 
  }
  
  const [streamsData, setStreamsData] = useState({streams: [], currentCursor: null, total: null});
  const [username, setUsername] = useState('Enter username');
  const [liveStreamers, setLiveStreamers] = useState([])

  let id = insertUsername(USER_ID, username)
  const { data: currentUser } = useSWR(id, getData)
  const userID = streamsData.streams.length === streamsData.total ? null : insertId(get(currentUser, 'data[0].id'), streamsData.currentCursor)
  const {data: streams} = useSWR(userID, getData, {onSuccess: (streamsResponse) => {
    const newStreams = streamsData.streams.concat(streamsResponse.data)
    const currentCursor = get(streamsResponse, 'pagination.cursor')
    console.log(streamsResponse)
    //This makes one big array. It's too big. Might need to make multiple fetch requests?
    setStreamsData({streams: newStreams, currentCursor, total: streamsResponse.total})
    const streamIds = streamsResponse.data.map(x => x.to_id)
    const streamsUrl = STREAMS_URL + streamIds.join('&user_id=')
    if (isEmpty(streamIds)) {
      return
    } else {
      getData(streamsUrl) 
        .then(response => {
          setLiveStreamers((currentLiveStreamers) => {
            const newLiveStreams = currentLiveStreamers.concat(response.data)
            return newLiveStreams
          })
        })
    }
  }})
  console.log(liveStreamers)
  console.log(userID)
  //The way we set up the pagination to create one big array means that this is making too big of a request. I can't do more than 100 streamers at a time. 


  // function getStreamer() {
  //   let id = insertUsername(USER_ID, username)
  //   return getData(id)
  //     .then(data => {
  //       const userID = insertId(data.data[0].id)
  //       console.log(userID)
  //       return getData(userID)
  //         .then(data => {
  //           const streamIds = data.data.map(x => x.to_id)
  //           const streamsUrl = STREAMS_URL + streamIds.join('&user_id=')
  //           return getData(streamsUrl) 
  //             .then(data => { 
  //               console.log(data.data)
                 
  //             })
  //           });
  //         })
  // }

  function handleSubmit(evt) {
    evt.preventDefault();
    setUsername();
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <form onSubmit={handleSubmit}>
            Enter your username: 
            <input type="text" defaultValue='' onChange={(e) => {setUsername(e.target.value)}} />
            <input type="submit"/>
          </form>
        </div>

        <div className="table"> {/*I think I'm going to look into the course flexbox-fundamentals to learn more about styling*/}

        <ul>{liveStreamers.map((liveStream) => {
          return (
            <li> <div>
            <img alt='' src={replaceThumbnailSize(liveStream.thumbnail_url, '200x150')}></img>
            <h2>
              {liveStream.user_name}
            </h2>
            <h5>
            {liveStream.title}
            </h5>
            <h5>
              {liveStream.viewer_count}
            </h5>
          </div></li>
          )
        })}</ul>

        </div>
      </header>
    </div>
  );
}

export default App;