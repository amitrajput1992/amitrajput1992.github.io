import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useThree } from "react-three-fiber";
import { LinearFilter, RGBAFormat, Texture, WebGLRenderTarget } from "three";
import { PanoImage } from "../../../r3f/Pano";
import {SceneTransition} from "./SceneTransition";
import {FXS} from "./FXS";
import {eventEmitter, events} from "../helper";

type Props = {

};

const renderTargetParameters = {
  minFilter: LinearFilter,
  magFilter: LinearFilter,
  format: RGBAFormat
};

/**
 * Receives event for rendering new scene
 * saves the 2nd scene to state.
 * renders effect with both the scenes.
 * @constructor
 */
export function Exp({}: Props) {
  const {size} = useThree();
  const fboScene1 = useRef(new WebGLRenderTarget(size.width, size.height, renderTargetParameters));
  const fboScene2 = useRef(new WebGLRenderTarget(size.width, size.height, renderTargetParameters));
  const [rttScene1, setRttScene1] = useState(false);
  const [rttScene2, setRttScene2] = useState(false);
  const [scene1Tex, setScene1Tex] = useState(new Texture());
  const [scene2Tex, setScene2Tex] = useState(new Texture());

  const [s1, setS1] = useState(
    <Suspense fallback={null}>
      <PanoImage source={"https://s.gmetri.com/gb-web/r3f-ui/assets/pano/livingRoom_001.jpg"}/>
    </Suspense>
  );

  const [s2, setS2] = useState<React.ReactElement>(<group/>);

  const [useTransition, setUseTransition] = useState(false);
  const [transitionValue, setTransitionValue] = useState(0);
  useEffect(() => {
    eventEmitter.on(events.transition, transition);
    return () => {
      eventEmitter.off(events.transition, transition);
    };
  }, [transitionValue]);

  function transition() {
    console.log("transition bruuuuuud");
    setS2(
      <Suspense fallback={null}>
        <PanoImage source={"https://u.gmetri.com/gb-sms-prod-1/media/2021-1/gmetri/b0b542de-5035-45c3-bdc5-28038869b264/o/360_berry_brothers_and%20_rudd_shop.jpg"}/>
      </Suspense>
    );
    // render both scenes to the a different target
    setRttScene1(true);
    setRttScene2(true);
    // setScene1Tex(fboScene1.current.texture.clone());
    // setScene2Tex(fboScene2.current.texture.clone());
    setTransitionValue(transitionValue === 0? 1: 0);
  }

  return (
    <group>
      {
        <SceneTransition texture1={fboScene1.current.texture.clone()} texture2={fboScene2.current.texture.clone()} transition={transitionValue}/>
      }
      <FXS rtt={rttScene1} fbo={fboScene1.current}>
      {
        s1
      }
      </FXS>
      <FXS rtt={rttScene2} fbo={fboScene1.current}>
        {
          s2
        }
      </FXS>
    </group>
  );
}

// <Suspense fallback={null}>
//   <PanoImage source={"https://s.gmetri.com/gb-web/r3f-ui/assets/pano/livingRoom_001.jpg"}/>
// </Suspense>
//
// <Suspense fallback={null}>
//   <PanoImage source={"https://u.gmetri.com/gb-sms-prod-1/media/2021-1/gmetri/b0b542de-5035-45c3-bdc5-28038869b264/o/360_berry_brothers_and%20_rudd_shop.jpg"}/>
// </Suspense>