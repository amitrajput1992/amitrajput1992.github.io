import React, { useRef } from "../../../../static/snowpack/pkg/react.js";
import { Scene } from "../../../../static/snowpack/pkg/three.js";
import { useFrame, useThree } from "../../../../static/snowpack/pkg/react-three-fiber.js";
// rtt -> render-to-texture
export function FXScene({
  children,
  rtt,
  fbo
}) {
  const scene = useRef(new Scene());
  const {
    camera
  } = useThree();
  useFrame(({
    gl
  }) => {
    if (rtt) {
      gl.setRenderTarget(fbo);
      gl.clear();
      gl.render(scene?.current, camera);
    } else {
      gl.setRenderTarget(null);
      gl.render(scene?.current, camera);
    }
  });
  return /*#__PURE__*/React.createElement("scene", {
    ref: scene
  }, children);
}