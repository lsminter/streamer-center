import React from 'react';
import './App.css';
import Twitch from './views/Twitch';
import Home from './views/Home'
import FacebookGaming from './views/FacebookGaming';
import YouTube from './views/YouTube';
import Login from "./containers/Login";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";

// if home isn't /home then the home link will always be active. 
function App() {
  return (
    <div className="background">
      <Router>
        <div>
            {/* Figure out how to not reset pages when swapping between them. */}
            <div className="header background border">
              <nav className="div1">
                <ul className="list-style">
                  <li className="font-size align">
                    <NavLink to="/home" className="inactive" activeClassName="active">Home</NavLink>
                  </li>
                  <li className="font-size align">
                    <NavLink to="/login" className="inactive" activeClassName="active">Login</NavLink>
                  </li>
                  <li className="font-size align">
                    <NavLink to="/twitch" className="inactive" activeClassName="active">Twitch</NavLink>
                  </li>
                  <li className="font-size align">
                    <NavLink to="/youtube" className="inactive" activeClassName="active">YouTube</NavLink>
                  </li>
                  <li className="font-size align">
                    <NavLink to="/facebookgaming" className="inactive" activeClassName="active">FacebookGaming</NavLink>
                  </li>
                </ul>
              </nav>
            </div>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
          <Route exact path="/login">
            <Login />
          </Route>
            <Route path="/youtube">
              <YouTube />
            </Route>
            <Route path="/facebookgaming">
              <FacebookGaming />
            </Route>
            <Route path="/twitch">
              <Twitch />
            </Route>
            <Route path="/home">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
