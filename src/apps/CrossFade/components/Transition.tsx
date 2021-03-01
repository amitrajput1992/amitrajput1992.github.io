import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "react-three-fiber";
import {fragmentShader, vertexShader} from "../../../r3f/shaders/CrossFade";
import {
  LinearFilter, MathUtils,
  Mesh,
  RGBAFormat,
  Scene,
  TextureLoader, Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
  PerspectiveCamera
} from "three";
// import FXScene from "./FXScene1";
import { FXScene } from "./FXScene";
import { eventEmitter, events } from "../helper";

type Props = {
  scene1: React.ReactElement,
  scene2: React.ReactElement,
};

const renderTargetParameters = {
  minFilter: LinearFilter,
  magFilter: LinearFilter,
  format: RGBAFormat
};

const speed = 4.0;

export function Transition({scene1, scene2}: Props) {
  const scene = useRef<Scene>(new Scene());
  const planeMesh = useRef<Mesh>(new Mesh());
  const {clock, size} = useThree();
  const fboScene1 = useMemo(() => new WebGLRenderTarget(size.width, size.height, renderTargetParameters), []);
  const fboScene2 = useMemo(() => new WebGLRenderTarget(size.width, size.height, renderTargetParameters), []);
  const [transitionValue, setTransitionValue] = useState(0.5);
  const [rttScene1, setRttScene1] = useState(true);
  const [rttScene2, setRttScene2] = useState(true);
  const camera = useRef<PerspectiveCamera>(new PerspectiveCamera());

  const scene1Ref = useRef();
  const scene2Ref = useRef();

  /**
   * 1. Render the current scene and the incoming scene into resp FBOs
   * 2. Render the texture to transition scene
   * 3. Start animation
   * 4. After animation is complete, dispose off previous scene and clear transition buffers
   **/
  function transition() {

  }

  useEffect(() => {
    //@ts-ignore
    planeMesh.current.material.uniforms.tDiffuse1.value = fboScene1.texture;
    //@ts-ignore
    planeMesh.current.material.uniforms.tDiffuse2.value = fboScene2.texture;

    // eventEmitter.on(events.transition, transition);
    // return () => {
    //   eventEmitter.off(events.transition, transition);
    // }
  }, []);

  const shaderArgs = useMemo(() => {
    const loader = new TextureLoader();
    const mixT = loader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/transition/transition3.png");
    // const dif1 = loader.load("https://s.gmetri.com/gb-web/r3f-ui/assets/pano/livingRoom_001.jpg");
    // const dif2 = loader.load("https://u.gmetri.com/gb-sms-prod-1/media/2021-1/gmetri/b0b542de-5035-45c3-bdc5-28038869b264/o/360_berry_brothers_and%20_rudd_shop.jpg");
    // const mixT = loader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/transition/transition2.png");
    return {
      uniforms: {
        tDiffuse1: {
          value: null,
        },
        tDiffuse2: {
          value: null,
        },
        mixRatio: {
          value: 0.0,
        },
        threshold: {
          value: 0.2,
        },
        useTexture: {
          value: 1,
        },
        tMixTexture: {
          value: mixT,
        },
      },
      vertexShader,
      fragmentShader
    };
  }, []);

  useFrame(frame, 1);

  function frame({gl}: {gl: WebGLRenderer}) {
    const delta = clock.getElapsedTime();
    const t = (1 + Math.sin(speed * delta / Math.PI)) / 2;
    const transition = MathUtils.smootherstep(t, 0.3, 0.7);
    // setTransitionValue(transition);
    //@ts-ignore
    planeMesh.current.material.uniforms.mixRatio.value = transition;
    // Prevent render both scenes when it's not necessary
    if(transition === 0) {
      //@ts-ignore
      // scene2Ref.current?.render(false);
      setRttScene2(false);
      // setRttScene1(true);
    } else if(transition === 1) {
      //@ts-ignore
      // scene1Ref.current?.render(false);
      setRttScene1(false);
      // setRttScene2(true);
    } else {
      // When 0<transition<1 render transition between two scenes
      //@ts-ignore
      // scene1Ref.current?.render(true);
      //@ts-ignore
      // scene2Ref.current?.render(true);
      setRttScene1(true);
      setRttScene2(true);
      gl.setRenderTarget(null);
      gl.clear();
      gl.render(scene.current, camera.current);
    }
  }

  return (
    <>
      <scene ref={scene}>
        <orthographicCamera ref={camera} args={[size.width / -2, size.width / 2, size.height / 2, size.height /  -2, - 10, 10]}/>
        <mesh ref={planeMesh}>
          <planeBufferGeometry attach="geometry" args={[size.width, size.height]}/>
          <shaderMaterial
            attach={"material"}
            args={[shaderArgs]}
            uniforms-mixRatio-value={transitionValue}
            //@ts-ignore
            // uniforms-tDiffuse1-value={fboScene1.texture}
            // uniforms-tDiffuse1-value={scene1Ref.current?.fbo.texture}
            //@ts-ignore
            // uniforms-tDiffuse2-value={fboScene2.texture}
            // uniforms-tDiffuse2-value={scene2Ref.current?.fbo.texture}
          />
        </mesh>
      </scene>
      {/*<FXScene ref={scene1Ref}>{scene1}</FXScene>*/}
      {/*<FXScene ref={scene2Ref}>{scene2}</FXScene>*/}
      <FXScene rtt={rttScene1} fbo={fboScene1}>{scene1}</FXScene>
      <FXScene rtt={rttScene2} fbo={fboScene2}>{scene2}</FXScene>
    </>
  );
}
