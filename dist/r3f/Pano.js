import React from "../../static/snowpack/pkg/react.js";
import { useLoader } from "../../static/snowpack/pkg/react-three-fiber.js"; // to use custom ts jsx components

import { BackSide, TextureLoader, Vector3, MathUtils } from "../../static/snowpack/pkg/three.js";
const scale = new Vector3(-1, 1, 1);
export const RAD_TO_DEG = 180 / Math.PI;
export const DEG_TO_RAD = Math.PI / 180; // this is used to orient the center of the camera to the center of the pano

const DEFAULT_PANO_Y = -90; //https://s.gmetri.com/gb-web/r3f-ui/assets/pano/livingRoom_001.jpg

export const PanoImage = ({
  radius = 1000,
  source = "",
  opacity = 1,
  rotation_offset = 0
}) => {
  const texture = useLoader(TextureLoader, source);
  return /*#__PURE__*/React.createElement("mesh", {
    scale: scale,
    rotation: [0, MathUtils.degToRad(DEFAULT_PANO_Y + rotation_offset), 0]
  }, /*#__PURE__*/React.createElement("sphereBufferGeometry", {
    attach: "geometry",
    args: [radius, 60, 40]
  }), /*#__PURE__*/React.createElement("meshBasicMaterial", {
    attach: "material",
    map: texture,
    side: BackSide,
    opacity: opacity,
    transparent: true
  }));
};