function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from "../../../../static/snowpack/pkg/react.js";
import { LinearFilter, RGBAFormat, Scene, WebGLRenderTarget } from "../../../../static/snowpack/pkg/three.js";
import { useThree, extend } from "../../../../static/snowpack/pkg/react-three-fiber.js";
const renderTargetParameters = {
  minFilter: LinearFilter,
  magFilter: LinearFilter,
  format: RGBAFormat
}; // rtt -> render-to-texture

class FXSceneImpl extends Scene {
  constructor(gl, camera) {
    super();

    _defineProperty(this, "scene", void 0);

    _defineProperty(this, "fbo", void 0);

    _defineProperty(this, "gl", void 0);

    _defineProperty(this, "camera", void 0);

    this.scene = new Scene();
    this.fbo = new WebGLRenderTarget(window.innerWidth, window.innerHeight, renderTargetParameters);
    this.gl = gl;
    this.camera = camera;
  } // add(children: any) {
  //   this.scene.add(children);
  // }


  render(rtt) {
    if (rtt) {
      this.gl.setRenderTarget(this.fbo);
      this.gl.clear();
      this.gl.render(this, this.camera);
    } else {
      this.gl.setRenderTarget(null);
      this.gl.render(this, this.camera);
    }
  }

}

extend({
  FXSceneImpl
});
const FXScene = /*#__PURE__*/React.forwardRef(({
  children
}, ref) => {
  const {
    gl,
    camera
  } = useThree();
  return /*#__PURE__*/React.createElement("fXSceneImpl", {
    args: [gl, camera],
    ref: ref
  }, children);
});
export default FXScene; // export default function FXScene({children}: Props) {
//   const {gl, camera} = useThree();
//
//   return (
//     <fXSceneImpl args={[gl, camera]}>
//       {children}
//     </fXSceneImpl>
//   );
// }