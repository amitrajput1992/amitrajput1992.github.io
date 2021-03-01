import React from '../static/snowpack/pkg/react.js';
import { HashRouter, Switch, Route } from "../static/snowpack/pkg/react-router-dom.js";
import Home from "./apps/Home/index.js";
import CrossFade from "./apps/CrossFade/index.js";
import '../static/snowpack/pkg/bootstrap/dist/css/bootstrap-reboot.min.css.proxy.js';
import './App.css.proxy.js';

function App({}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(HashRouter, null, /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: "/home"
  }, /*#__PURE__*/React.createElement(Home, null)), /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: "/crossfade"
  }, /*#__PURE__*/React.createElement(CrossFade, null)), /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: "/"
  }, /*#__PURE__*/React.createElement(Home, null)))));
}

export default App;