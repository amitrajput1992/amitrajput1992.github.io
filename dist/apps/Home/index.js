import React from "../../../static/snowpack/pkg/react.js";
import { Canvas } from "../../../static/snowpack/pkg/react-three-fiber.js";
import PerspectiveCamera from "../../r3f/PerspectiveCamera.js";
import TriangleVortex from "../../r3f/TriangleVortex.js";
import Stats from "../../r3f/Stats.js";
import Horse from "../../Icons/Horse.js";
import "./index.css.proxy.js";
export default function Home() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: 'html_root'
  }, /*#__PURE__*/React.createElement("div", {
    className: 'hmh'
  }, "Hold my horses ", /*#__PURE__*/React.createElement(Horse, null))), /*#__PURE__*/React.createElement(Canvas, {
    className: 'canvas',
    colorManagement: false
  }, /*#__PURE__*/React.createElement("ambientLight", null), /*#__PURE__*/React.createElement("pointLight", {
    position: [10, 10, 10]
  }), /*#__PURE__*/React.createElement(PerspectiveCamera, null), /*#__PURE__*/React.createElement(TriangleVortex, null), /*#__PURE__*/React.createElement(Stats, null), /*#__PURE__*/React.createElement("mesh", {
    position: [0, 5, -10],
    rotation: [0, 0, 0],
    castShadow: true
  }, /*#__PURE__*/React.createElement("dodecahedronBufferGeometry", {
    attach: "geometry",
    args: [1.4, 0]
  }), /*#__PURE__*/React.createElement("meshNormalMaterial", {
    attach: "material"
  }))));
}