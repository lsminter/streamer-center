import React from 'react';
import './Views.css';

function YouTube() {
  
  const youtubeUserId = 'https://www.googleapis.com/youtube/v3/channels?key=AIzaSyArsOaAPVy_5DMGARjVfepT_nwNC2LYcKo&forUsername=lsminter1&part=id'

  const response = fetch(youtubeUserId);


  console.log(response)

  // figure out how to return data from a promise... I forgot

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Todo: YouTube Page
        </p>
      </header>
    </div>
  );
}

// https://developers.google.com/youtube/v3/guides/implementation/subscriptions#subscriptions-retrieve-for-channel
// Integrate google sign in/out: https://developers.google.com/identity/sign-in/web/sign-in
// Learn to make api calls: https://developers.google.com/oauthplayground/
// Find a user's id: https://www.googleapis.com/youtube/v3/channels?key=AIzaSyArsOaAPVy_5DMGARjVfepT_nwNC2LYcKo&forUsername=lsminter1&part=id


export default YouTube;
