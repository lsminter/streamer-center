import React from 'react';
import './App.css';

function App() {

  function Streamer() {
    const twitchURL = 'https://api.twitch.tv/helix/streams?user_login=gamesdonequick'
    const BEARER_TOKEN = 'rxmpajjmb1jvrrad0tu2gth78sip0j'
    const CLIENT_ID = '226970d9mbfxsg83n2taksg2c44hzs';
  
    
    async function getData(url = '', data = {}) {
      // Default options are marked with *
      const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: new Headers({
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ` + BEARER_TOKEN,
          'Client-ID': CLIENT_ID
        }),
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      });
      return response.json(); // parses JSON response into native JavaScript objects
    }
  
    return getData(twitchURL)
      .then(data => {
        console.log(data.data[0]); // JSON data parsed by `data.json()` call
      });
  }

  return (
    <div className="App">
      <header className="App-header">
        <button className="fetch-button" onClick={Streamer}>
          Fetch Data
        </button>
      </header>
    </div>
  );
}

export default App;
