import React from 'react';
import './App.css';
import Twitch from './views/Twitch';
import Home from './views/Home'
import FacebookGaming from './views/FacebookGaming';
import YouTube from './views/YouTube';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


function App() {
  return (
    <div>
      <Router>
        <div>
          <nav>
            {/* Figure out how to not reset pages when swapping between them. */}
            <ul className="header">
              <li className="font-size">
                <Link to="/">Home</Link>
              </li>
              <li className="font-size">
                <Link to="/twitch">Twitch</Link>
              </li>
              <li className="font-size">
                <Link to="/youtube">YouTube</Link>
              </li>
              <li className="font-size">
                <Link to="/facebookgaming">FacebookGaming</Link>
              </li>
            </ul>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/youtube">
              <YouTube />
            </Route>
            <Route path="/facebookgaming">
              <FacebookGaming />
            </Route>
            <Route path="/twitch">
              <Twitch />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
