import React, { Suspense } from "react";
import { Canvas } from "react-three-fiber";
import PerspectiveCamera from "../../r3f/PerspectiveCamera";
import { PanoImage } from "../../r3f/Pano";
import Stats from "../../r3f/Stats";
import { MousePanControls } from "../../r3f/controls/MousePanControls";
import "./index.scss";
import { Transition } from "./components/Transition";

// https://u.gmetri.com/gb-sms-prod-1/media/2021-1/gmetri/b0b542de-5035-45c3-bdc5-28038869b264/o/360_berry_brothers_and%20_rudd_shop.jpg
// https://s.gmetri.com/gb-web/r3f-ui/assets/pano/livingRoom_001.jpg
export default function CrossFade() {
  return (
    <>
      <Canvas
        colorManagement={false}
        className={'canvas'}
      >
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <PerspectiveCamera />
        <Transition
          scene1={
            <Suspense fallback={null}>
              <PanoImage source={"https://gb-web.s3.ap-south-1.amazonaws.com/r3f-ui/assets/pano/livingRoom_001.jpg"}/>
              {/*<PanoImage source={"https://s.gmetri.com/gb-web/r3f-ui/assets/pano/livingRoom_001.jpg"}/>*/}
            </Suspense>
          }
          scene2={
            <Suspense fallback={null}>
              <PanoImage source={"https://gb-sms-prod-1.s3.ap-south-1.amazonaws.com/media/2021-1/gmetri/b0b542de-5035-45c3-bdc5-28038869b264/o/360_berry_brothers_and%20_rudd_shop.jpg"}/>
            </Suspense>
          }/>
        <MousePanControls/>
        <Stats />
      </Canvas>
    </>
  );
}