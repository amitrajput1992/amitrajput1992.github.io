import React from 'react';
import {HashRouter, Switch, Route} from "react-router-dom";
import Home from "../src/apps/Home";
import CrossFade from "../src/apps/CrossFade";

import 'bootstrap/dist/css/bootstrap-reboot.min.css';
import './App.scss';

interface AppProps {}

function App({}: AppProps) {
  return (
    <>
      <HashRouter>
        <Switch>
          <Route exact path={"/home"}>
            <Home/>
          </Route>
          <Route exact path={"/crossfade"}>
            <CrossFade/>
          </Route>
          <Route exact path={"/"}>
            <Home/>
          </Route>
        </Switch>
      </HashRouter>
    </>
  );
}

export default App;
