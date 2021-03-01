import React from "react";
import { useLoader } from "react-three-fiber"; // to use custom ts jsx components
import { BackSide, TextureLoader, Vector3, MathUtils } from "three";

const scale = new Vector3(-1, 1, 1);
export const RAD_TO_DEG = 180 / Math.PI;
export const DEG_TO_RAD = Math.PI / 180;

// this is used to orient the center of the camera to the center of the pano
const DEFAULT_PANO_Y = -90;

//https://s.gmetri.com/gb-web/r3f-ui/assets/pano/livingRoom_001.jpg

export const PanoImage: React.FC<{
  radius?: number,
  source: string,
  opacity?: number,
  rotation_offset?: number,
}> = ({ radius= 1000, source = "", opacity= 1, rotation_offset= 0 }) => {
  const texture = useLoader(TextureLoader, source);
  return (
    <mesh scale={scale} rotation={[0, MathUtils.degToRad(DEFAULT_PANO_Y + rotation_offset), 0]}>
      <sphereBufferGeometry attach='geometry' args={[radius, 60, 40]} />
      <meshBasicMaterial attach="material" map={texture} side={BackSide} opacity={opacity} transparent={true} />
    </mesh>
  );
};
