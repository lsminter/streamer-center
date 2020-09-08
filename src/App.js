import React, {useState, useEffect} from 'react';
import './App.css';
import useSWR from 'swr'
import _, {get, isEmpty, orderBy} from 'lodash'



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

const USER_ID = 'https://api.twitch.tv/helix/users?login=<username>' 
const STREAMS_URL = 'https://api.twitch.tv/helix/streams?user_id='
const BEARER_TOKEN = process.env.REACT_APP_BEARER_TOKEN
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID
const GAME_NAME = 'https://api.twitch.tv/helix/games?id=<game_id>'

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

function insertGameId (url, el) {
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

  console.log()

  // Look into GraphQL https://github.com/mauricew/twitch-graphql-api
  

  // The data returned is in order of highest viewers to lower but it gets messed up because of the pagination. It lists them in order of view count for the first 100 then starts over again with the next array of 100 people. I'm creating multiple lists, one for each array. 
  
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
              {/* Using onSubmit returns undefined. onChange will run the code as I'm typing (undesired result as listed below). Possibly use `debounce` by lodash? */}
            <input type="submit"/>
          </form>
        </div>
        {/* Need to figure out how to only run the input when I'm finished typing and now while I'm typing. It's searching for someone while I'm typing my username and it's getting added onto my list of follows. Also need to figure out how to search for another user without having to refresh the page. */}
        
        {/* Thinking about using tailwind for styling */}
        <nav className="main-nav">
          <ul>{orderBy(liveStreamers, ['viewer_count'], ['desc']).map((liveStream) => {

            // let gameLink = insertGameId(GAME_NAME, liveStream.game_id)
            // // cant use useSWR here. 
            // getData(gameLink)
            //   .then(response => {
            //     console.log(response.data[0].name)
            //   }) // We get back the name but I need to figure out how to set this to state to be able to use it later in the app. Can't use setState in here either. I don't think it likes me using hooks here. 

            // styling: https://egghead.io/playlists/create-a-landing-page-with-css-grid-and-flexbox-6048
            // https://egghead.io/lessons/flexbox-create-an-automatically-responsive-flexbox-gallery

            return (
              <li>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
                  <div>
                    {/*Need to make spaces between elements smaller, a bit more compact.*/}
                  <a href={"https://twitch.tv/" + liveStream.user_name}>
                    <img className="picture" alt='' src={replaceThumbnailSize(liveStream.thumbnail_url, '320x180')}></img>
                  </a>
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
                  {/* Make it so that hovering over lines that are cut off show the whole line so the user can read it */}
                  <a href={"https://twitch.tv/" + liveStream.user_name}>
                    <h3 className="viewers">
                      Viewers: {liveStream.viewer_count}
                    </h3>
                  </a>
                  <a href={"https://twitch.tv/game/" + liveStream.game_id}>
                    <h3 className="viewers">
                      Game Id: {}
                    </h3>
                    {/* To get a game's name, I have to make a fet request with the game ID then I can display the name. */}
                  </a>
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