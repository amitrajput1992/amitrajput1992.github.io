import React, { Suspense } from "../../../static/snowpack/pkg/react.js";
import { Canvas } from "../../../static/snowpack/pkg/react-three-fiber.js";
import PerspectiveCamera from "../../r3f/PerspectiveCamera.js";
import { PanoImage } from "../../r3f/Pano.js";
import Stats from "../../r3f/Stats.js";
import { MousePanControls } from "../../r3f/controls/MousePanControls.js";
import "./index.css.proxy.js";
import { Transition } from "./components/Transition.js"; // https://u.gmetri.com/gb-sms-prod-1/media/2021-1/gmetri/b0b542de-5035-45c3-bdc5-28038869b264/o/360_berry_brothers_and%20_rudd_shop.jpg
// https://s.gmetri.com/gb-web/r3f-ui/assets/pano/livingRoom_001.jpg

export default function CrossFade() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Canvas, {
    colorManagement: false,
    className: 'canvas'
  }, /*#__PURE__*/React.createElement("ambientLight", null), /*#__PURE__*/React.createElement("pointLight", {
    position: [10, 10, 10]
  }), /*#__PURE__*/React.createElement(PerspectiveCamera, null), /*#__PURE__*/React.createElement(Transition, {
    scene1: /*#__PURE__*/React.createElement(Suspense, {
      fallback: null
    }, /*#__PURE__*/React.createElement(PanoImage, {
      source: "https://gb-web.s3.ap-south-1.amazonaws.com/r3f-ui/assets/pano/livingRoom_001.jpg"
    })),
    scene2: /*#__PURE__*/React.createElement(Suspense, {
      fallback: null
    }, /*#__PURE__*/React.createElement(PanoImage, {
      source: "https://gb-sms-prod-1.s3.ap-south-1.amazonaws.com/media/2021-1/gmetri/b0b542de-5035-45c3-bdc5-28038869b264/o/360_berry_brothers_and%20_rudd_shop.jpg"
    }))
  }), /*#__PURE__*/React.createElement(MousePanControls, null), /*#__PURE__*/React.createElement(Stats, null)));
}