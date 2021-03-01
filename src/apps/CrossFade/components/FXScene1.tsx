import React, { useRef } from "react";
import { Group, LinearFilter, PerspectiveCamera, RGBAFormat, Scene, WebGLRenderer, WebGLRenderTarget } from "three";
import {useFrame, useThree, extend } from "react-three-fiber";

const renderTargetParameters = {
  minFilter: LinearFilter,
  magFilter: LinearFilter,
  format: RGBAFormat
};

// rtt -> render-to-texture
class FXSceneImpl extends Scene{
  scene: Scene;
  fbo: WebGLRenderTarget;
  gl: WebGLRenderer;
  camera: PerspectiveCamera;

  constructor(gl: WebGLRenderer, camera: PerspectiveCamera) {
    super();
    this.scene = new Scene();
    this.fbo = new WebGLRenderTarget(window.innerWidth, window.innerHeight, renderTargetParameters);
    this.gl = gl;
    this.camera = camera;
  }

  // add(children: any) {
  //   this.scene.add(children);
  // }

  render(rtt: boolean) {
    if(rtt) {
      this.gl.setRenderTarget(this.fbo);
      this.gl.clear();
      this.gl.render(this, this.camera);
    } else {
      this.gl.setRenderTarget(null);
      this.gl.render(this, this.camera);
    }
  }
}

extend({FXSceneImpl});

type Props = {
  children: React.ReactElement | React.ReactElement[],
};

const FXScene = React.forwardRef(({children}: Props, ref) => {
  const {gl, camera} = useThree();

  return (
    <fXSceneImpl args={[gl, camera]} ref={ref}>
      {children}
    </fXSceneImpl>
  );
});

export default FXScene;

// export default function FXScene({children}: Props) {
//   const {gl, camera} = useThree();
//
//   return (
//     <fXSceneImpl args={[gl, camera]}>
//       {children}
//     </fXSceneImpl>
//   );
// }

