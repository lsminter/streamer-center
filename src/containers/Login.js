// https://serverless-stack.com/chapters/create-a-login-page.html

import React, {useState} from "react";
import "./Login.css";

export default function Login() {

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault()

  }

  // GO THROUGH EPIC REACT USEEFFECT FIRST

  // GET https://id.twitch.tv/oauth2/authorize?client_id=226970d9mbfxsg83n2taksg2c44hzs&redirect_uri=http://localhost:3000/twitch&response_type=token&scope=user:read:email
  // access token: http://localhost:3000/auth/twitch/callback/#access_token=sk2qkx1lg2w1pduhgqzyte3djurndx&scope=user%3Aread%3Aemail&token_type=bearer

  return (
    <div>
      <div className="center">
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <input id="email" value={signInEmail} type="email" onChange={e => setSignInEmail(e.target.value)} />
            <input id="password" value={signInPassword} type="password" onChange={e => setSignInPassword(e.target.value)} />
            <button type="submit">Login</button>
          </form>
        </div>
        <div>
          <form className="login-form">
            <input id="email" value={registerEmail} type="email" onChange={e => setRegisterEmail(e.target.value)} />
            <input id="password" value={registerPassword} type="password" onChange={e => setRegisterPassword(e.target.value)} />
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}