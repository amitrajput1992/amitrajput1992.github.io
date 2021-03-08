import React, { useMemo } from "react";
import { useThree } from "react-three-fiber";
//@ts-ignore
import {useSpring, a} from "react-spring/three";
import { Texture, TextureLoader, WebGLRenderTarget } from "three";
import { fragmentShader, vertexShader } from "../../../r3f/shaders/CrossFade";

type Props = {
  texture1: Texture,
  texture2: Texture,
  transition: number, // either 0 or 1 based on which scene to render
};

export function SceneTransition({texture1, texture2, transition}: Props) {
  const {size} = useThree();
  const shaderArgs = useMemo(() => {
    const loader = new TextureLoader();
    const mixT = loader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/transition/transition3.png");
    // const dif1 = loader.load("https://s.gmetri.com/gb-web/r3f-ui/assets/pano/livingRoom_001.jpg");
    // const dif2 = loader.load("https://u.gmetri.com/gb-sms-prod-1/media/2021-1/gmetri/b0b542de-5035-45c3-bdc5-28038869b264/o/360_berry_brothers_and%20_rudd_shop.jpg");
    // const mixT = loader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/transition/transition2.png");
    return {
      uniforms: {
        tDiffuse1: {
          value: texture1,
        },
        tDiffuse2: {
          value: texture2,
        },
        mixRatio: {
          value: 0.0,
        },
        threshold: {
          value: 0.2,
        },
        useTexture: {
          value: 0,
        },
        tMixTexture: {
          value: mixT,
        },
      },
      vertexShader,
      fragmentShader
    };
  }, [texture1, texture2]);
  console.log(transition);
  const {progress} = useSpring({progress: transition});
  return (
    <scene>
      <orthographicCamera args={[size.width / -2, size.width / 2, size.height / 2, size.height /  -2, - 10, 10]}/>
      <mesh >
        <planeBufferGeometry attach="geometry" args={[size.width, size.height]}/>
        <a.shaderMaterial
          attach={"material"}
          args={[shaderArgs]}
          uniforms-mixRatio-value={progress}
          uniforms-tDiffuse1-value={texture1}
          uniforms-tDiffuse2-value={texture2}
        />
      </mesh>
    </scene>
  );
}