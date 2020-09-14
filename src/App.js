import React, {useState} from 'react';
import './App.css';
import useSWR from 'swr'
import {get, isEmpty, orderBy, uniq} from 'lodash'

/* 
Pagination figured out! 
I need user_name, game_id, thumbnail_url, title, viewer_count, started_at.
The viewer_count is displayed as an overlay on the thumbnail_url.
To find how long the streamer has been streaming, you check the `started_at` and compare that to what the time is now. 
Each stream has a `LIVE` tag in the top left of the thumbnail. Not sure if this is necessary since I'll only be displaying live streamers. 
How long the streamer has been streaming is in the top right of the thumbnail. 
I need to learn how to display items on top of the thumbnail. 
Can I get a list of games that a user follows? I don't see this in the API. I don't know if it is possible.
*/

// Look into GraphQL https://github.com/mauricew/twitch-graphql-api

const USER_ID = 'https://api.twitch.tv/helix/users?login=<username>' 
const STREAMS_URL = 'https://api.twitch.tv/helix/streams?user_id='
const BEARER_TOKEN = process.env.REACT_APP_BEARER_TOKEN
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID

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

function buildGameUrl (el) {
  if(!el) return;
  let url = 'https://api.twitch.tv/helix/games?id=<game_id>'
  return url.replace(/<game_id>/, el)
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
  const [liveStreamers, setLiveStreamers] = useState([]);
  const [gameName, setGameName] = useState({});

  let id = insertUsername(USER_ID, username)
  const { data: currentUser } = useSWR(id, getData)
  const userID = streamsData.streams.length === streamsData.total ? null : insertId(get(currentUser, 'data[0].id'), streamsData.currentCursor)
  const {data: streams} = useSWR(userID, getData, {onSuccess: (streamsResponse) => {
    const newStreams = streamsData.streams.concat(streamsResponse.data)
    const currentCursor = get(streamsResponse, 'pagination.cursor')
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

  let liveGameIds = uniq(liveStreamers.map((stream) => {
    return stream.game_id
  }))

  useSWR(buildGameUrl(liveGameIds.join("&id=")), getData, {onSuccess: (successfulResponse) => {
    setGameName(successfulResponse.data.reduce((acc, curr) => {
      acc[curr.id] = curr
      return acc
    }, {}))
  }})
    
  function handleSubmit(evt) {
    evt.preventDefault();
    setUsername(evt.target.elements.username.value);
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <form onSubmit={handleSubmit}>
            Enter your username: 
            <input
              autoFocus={true}
              type="text"
              defaultValue=''
              id="username"
            />
            <input type="submit"/>
          </form>
        </div>
        
        {/* Thinking about using tailwind for styling - side project? */}
        <nav className="main-nav">
          <ul className="boxes">{orderBy(liveStreamers, ['viewer_count'], ['desc']).map((liveStream) => {


            // styling: https://egghead.io/playlists/create-a-landing-page-with-css-grid-and-flexbox-6048
            // https://egghead.io/lessons/flexbox-create-an-automatically-responsive-flexbox-gallery

            return (
              <li className="box-container">
                <div>
                  {/*Need to make spaces between elements smaller, a bit more compact.*/}
                  <a href={"https://twitch.tv/" + liveStream.user_name}>
                    <img className="img" alt='' src={replaceThumbnailSize(liveStream.thumbnail_url, '300x250')}></img>
                  </a>
                  <div className="text-container">
                    <a href={"https://twitch.tv/" + liveStream.user_name}>
                      <h4 className="username">
                        {liveStream.user_name}
                      </h4>
                    </a>
                    <a href={"https://twitch.tv/" + liveStream.user_name}>
                      <h5 className="title">
                      {liveStream.title}
                      </h5>
                    </a>
                    {/* Make it so that hovering over lines that are cut off show the whole line so the user can read it. reachui then tipy.js */}
                    <a href={"https://twitch.tv/" + liveStream.user_name}>
                      <h3 className="viewers">
                        Viewers: {liveStream.viewer_count}
                      </h3>
                    </a>
                    <a href={"https://twitch.tv/directory/game/" + get(gameName, `${liveStream.game_id}.name`)}>
                      <h3 className="viewers">
                        {get(gameName, `${liveStream.game_id}.name`)}
                      </h3>
                    </a>
                  </div>
                </div>
              </li>
            )
          })}</ul>
        </nav>

      </header>
    </div>
  );
}

export default App;