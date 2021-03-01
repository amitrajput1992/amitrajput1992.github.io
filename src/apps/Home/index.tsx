import React from "react";
import { Canvas } from "react-three-fiber";
import PerspectiveCamera from "../../r3f/PerspectiveCamera";
import TriangleVortex from "../../r3f/TriangleVortex";
import Stats from "../../r3f/Stats";
import Horse from "../../Icons/Horse";
import "./index.scss";

export default function Home() {
  return (
    <>
      <div className={'html_root'}>
        <div className={'hmh'}>
          Hold my horses <Horse/>
        </div>
      </div>
      <Canvas className={'canvas'} colorManagement={false}>
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