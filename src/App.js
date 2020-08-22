import React from 'react';
import './App.css';

const twitchURL = 'https://api.twitch.tv/helix/streams?user_login=gamesdonequick'
const BEARER_TOKEN = 
const CLIENT_ID = 



function App() {
  function Streamer() {  
    async function getData(url = '', data = {}) {
      const response = await fetch(url, {
        headers: ({
          'Authorization': `Bearer ` + BEARER_TOKEN,
          'Client-ID': CLIENT_ID
        }),
      });
      return response.json(); // parses JSON response into native JavaScript objects
    }
  
    return getData(twitchURL)
      .then(data => {
        console.log(data.data[0]); // JSON data parsed by `data.json()` call
      });
  }

  Streamer()

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
