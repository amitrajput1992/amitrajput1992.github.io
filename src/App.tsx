import React from 'react';
import { Canvas } from 'react-three-fiber';
import 'bootstrap/scss/bootstrap-reboot.scss';

import PerspectiveCamera from "./r3f/PerspectiveCamera";
import TriangleVortex from "./r3f/TriangleVortex";
import Stats from "./r3f/Stats";
import Horse from './Icons/Horse';

interface AppProps {}

function App({}: AppProps) {
  return (
    <>
      <div style={{zIndex: 1, position: 'absolute', color: '#333', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 25, display: 'flex', alignContent: 'center'}}>
        Hold your horses <Horse/>
      </div>
      <Canvas style={{width: '100%', height: '100%', position: 'absolute', backgroundColor: 'grey'}}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <PerspectiveCamera />
        <TriangleVortex />
        <Stats />
        <mesh position={[0, 5, -10]} rotation={[0, 0, 0]} castShadow>
          <dodecahedronBufferGeometry attach="geometry" args={[1.4, 0]}/>
          <meshNormalMaterial attach="material"/>
        </mesh>
      </Canvas>
    </>
  );
}

export default App;
