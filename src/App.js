import React, {useState} from 'react';
import './App.css';
import useSWR from 'swr'
import {get} from 'lodash'

import {twitchResponse} from './components/twitch-response'


/* 
**PRIORITY** I need to figure out how to use pagination to get the rest of the streamers. Only getting live streamers for the first 100 streamers. 
I need user_name, game_id, thumbnail_url, title, viewer_count, started_at.
The viewer_count is displayed as an overlay on the thumbnail_url.
To find how long the streamer has been streaming, you check the `started_at` and compare that to what the time is now. 
Each stream has a `LIVE` tag in the top left of the thumbnail. Not sure if this is necessary since I'll only be displaying live streamers. 
How long the streamer has been streaming is in the top right of the thumbnail. 
I need to learn how to display items on top of the thumbnail. 
Do I want to have `tags` under each streamer? Tags are things like `Esports`, and `language`. 
tag_ids are displayed as a string of characters that will match up to a specific word. 
*/

const USER_ID = 'https://api.twitch.tv/helix/users?login=minterhero' //Need to figure out how to use the input to replace the username
const STREAMS_URL = 'https://api.twitch.tv/helix/streams?user_id='
const BEARER_TOKEN = 'rxmpajjmb1jvrrad0tu2gth78sip0j'
const CLIENT_ID = '226970d9mbfxsg83n2taksg2c44hzs'

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
  const [username, setUsername] = useState('Test');
  const handleUsernameChange = (evt) => {
    const newValue = evt.target.value;
    setUsername(newValue)
  } // This is making the page reload when I click the button.

  async function getData(url, data) { //look into axios possibly (*side project*)
    const response = await fetch(url, {
      headers: ({
        'Authorization': `Bearer ` + BEARER_TOKEN,
        'Client-ID': CLIENT_ID
      }),
    });
    return response.json(); 
  }

  const [streamsData, setStreamsData] = useState({streams: [], cursor: null});

  const { data: currentUser } = useSWR(USER_ID, getData)
  const userID = insertId(get(currentUser, 'data[0].id'), streamsData.cursor)
  const {data: streams} = useSWR(userID, getData, {onSuccess: (data) => {
    const newStreams = streamsData.streams.concat(data.data)
    console.log({data})
    setStreamsData({streams: newStreams, cursor: get(data, 'pagination.cursor')})
  }})
  console.log(streamsData)

  function getStreamer() {
    return getData(USER_ID)
      .then(data => {
        const userID = insertId(data.data[0].id)
        console.log(userID)
        return getData(userID)
          .then(data => {
            const streamIds = data.data.map(x => x.to_id)
            const streamsUrl = STREAMS_URL + streamIds.join('&user_id=')
            return getData(streamsUrl) // I was going to sort the result of this by viewer count but it is already sorted by viewer_count
              .then(data => { 
                 // This logs an array of the live users minterhero follows out of the first 100 follows. Need to figure out pagination to check the next 100 follows. 
              })
            });// need to figure out how cherry pick certain values off of each object in the array. 
          })
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <form>
            username: 
            <input value={username} />
             {/*this form only re-renders the page, trying to figure out why. I think onSubmit is trying to redirect?*/}
            <button type="submit">Submit</button>
          </form>
        </div> 

        <div className="table"> {/*I think I'm going to look into the course flexbox-fundamentals to learn more about styling*/}
          <div>
            <img alt='' src={replaceThumbnailSize(twitchResponse[0].thumbnail_url, '200x150')}></img>
            <h2>
              {twitchResponse[0].user_name}
            </h2>
            <h5>
            {twitchResponse[0].title}
            </h5>
          </div>
          <div>
            <img alt='' src={replaceThumbnailSize(twitchResponse[1].thumbnail_url, '200x150')}></img>
            <h2>
              {twitchResponse[1].user_name}
            </h2>
            <h5>
            {twitchResponse[1].title}
            </h5>
          </div>

        </div>
      </header>
    </div>
  );
}

export default App;