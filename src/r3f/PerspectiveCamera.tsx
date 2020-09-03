import React, { useEffect, useRef } from 'react';
import { useThree } from 'react-three-fiber';
import { Euler } from 'three'; // to use custom ts jsx components

const defaultRotation = new Euler(0, Math.PI, 0, 'YXZ');

export default function PerspectiveCamera() {
  const camera = useRef();
  const { size, setDefaultCamera } = useThree();
  //@ts-ignore
  useEffect(() => setDefaultCamera(camera.current), [setDefaultCamera]);
  return (
    <perspectiveCamera
      ref={camera}
      fov={75}
      near={0.01}
      far={1500}
      aspect={size.width / size.height}
      rotation={defaultRotation}
      position={[0, 0, 0]}
    />
  );
}
