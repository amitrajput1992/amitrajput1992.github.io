import React, { useMemo, useRef } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { LinearFilter, RGBAFormat, Scene, WebGLRenderTarget } from "three";

type Props = {
  children: React.ReactElement | React.ReactElement[],
  fbo: WebGLRenderTarget,
  rtt: boolean
};

const renderTargetParameters = {
  minFilter: LinearFilter,
  magFilter: LinearFilter,
  format: RGBAFormat
};

export function FXS({children, fbo, rtt}: Props) {
  const {camera, size} = useThree();
  const scene = useRef<Scene>(new Scene());
  useFrame(({gl}) => {
    if(rtt) {
      gl.setRenderTarget(fbo);
      gl.clear();
      gl.render(scene.current, camera);
    } else {
      gl.setRenderTarget(null);
      gl.clear();
      gl.render(scene.current, camera);
    }
  });

  return (
    <scene ref={scene}>
      {children}
    </scene>
  );
}