import React, { useRef } from "react";
import { Scene, WebGLRenderTarget} from "three";
import {useFrame, useThree } from "react-three-fiber";

type Props = {
  children: React.ReactElement | React.ReactElement[],
  rtt: boolean,
  fbo: WebGLRenderTarget,
};

// rtt -> render-to-texture
export function FXScene({children, rtt, fbo}: Props) {
  const scene = useRef<Scene>(new Scene());
  const {camera} = useThree();

  useFrame(({ gl }) => {
    if(rtt) {
      gl.setRenderTarget(fbo);
      gl.clear();
      gl.render(scene?.current, camera);
    } else {
      gl.setRenderTarget(null);
      gl.render(scene?.current, camera);
    }
  });

  return (
    <scene ref={scene}>
      {children}
    </scene>
  );
}