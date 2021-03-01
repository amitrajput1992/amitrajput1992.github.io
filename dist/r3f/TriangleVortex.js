import React, { useEffect, useRef } from '../../static/snowpack/pkg/react.js';
import { useFrame, useThree } from '../../static/snowpack/pkg/react-three-fiber.js';
import { Vector2, BufferGeometry, Vector3, CatmullRomCurve3, Line, LineBasicMaterial, MeshBasicMaterial, BackSide, TubeGeometry, Color, Fog, Euler, BufferAttribute } from '../../static/snowpack/pkg/three.js'; // @ts-ignore

import perlin from '../vendor/perlin.js';
const ww = window.innerWidth;
const wh = window.innerHeight;
const defaultRotation = new Euler(0, 0, 0, 'YXZ');
export default function TriangleVortex() {
  const {
    scene,
    camera
  } = useThree();
  useFrame(({
    clock
  }, delta) => {
    update(clock.elapsedTime * 1000);
    updateCameraPos();
  });
  scene.fog = new Fog(0xffffff, 1, 1.9);
  const ref = useRef();
  const wheel = useRef(0);
  const mouse = useRef({
    position: new Vector2(ww * 0.5, wh * 0.5),
    ratio: new Vector2(0, 0),
    target: new Vector2(ww * 0.5, wh * 0.5)
  });
  useEffect(() => {
    window.addEventListener('wheel', onScroll);
    return () => window.removeEventListener('wheel', onScroll);
  }, []);
  const points = [];

  for (let i = 0; i < 5; i++) {
    points.push(new Vector3(0, 0, 3 * (i / 4)));
  }

  points[4].y = -0.06; // todo check why?

  const curve = new CatmullRomCurve3(points);
  curve.type = 'catmullrom';
  const curvePoints = curve.getPoints(120);
  const geometry = new BufferGeometry().setFromPoints(curvePoints);
  const splineMesh = new Line(geometry, new LineBasicMaterial());
  const tubeMaterial = new MeshBasicMaterial({
    side: BackSide,
    vertexColors: true // color: "#FFF"

  });
  const tubeGeometryIndexed = new TubeGeometry(curve, 120, 0.08, 3, false);
  const tubeGeometry = tubeGeometryIndexed.toNonIndexed();
  const positions = tubeGeometry.getAttribute("position");
  const c = new BufferAttribute(new Float32Array(positions.count * 3), 3);
  tubeGeometry.setAttribute("color", c);
  const colors = tubeGeometry.getAttribute("color"); // each position points to a vertex(vec3). A face is made by joining 3 vertices, the face takes the colors applied to all the vertices that compute it.
  // here we apply the same color to all the 3 vertices of the face to uniform out the color impact.

  for (let i = 0; i < positions.count; i = i + 3) {
    const color = new Color(`hsl(${Math.floor(Math.abs(perlin.simplex3(positions.getX(i) * 2, positions.getY(i) * 4, positions.getZ(i) * 2)) * 80 * 100) * 0.01 + 180}, 70%, 45%)`);
    colors.setXYZ(i + 0, color.r, color.g, color.b);
    colors.setXYZ(i + 1, color.r, color.g, color.b);
    colors.setXYZ(i + 2, color.r, color.g, color.b);
  }

  tubeGeometry.attributes.color.needsUpdate = true;
  const tubeGeometryOriginal = tubeGeometry.clone();
  const splineVertices = splineMesh.geometry.getAttribute("position");
  const tubeOriginalVertices = tubeGeometryOriginal.getAttribute("position");

  function update(delta) {
    const tubeVertices = tubeGeometry.getAttribute("position");

    for (let i = 0; i < tubeVertices.count; i++) {
      let x = tubeVertices.getX(i);
      let y = tubeVertices.getY(i);
      let z = tubeVertices.getZ(i);
      const index = Math.floor(i / 120);
      x += (tubeOriginalVertices.getX(i) + splineVertices.getX(index) - x) / 15;
      y += (tubeOriginalVertices.getY(i) + splineVertices.getY(index) - y) / 15;
      const vec3 = new Vector3(x, y, z).applyAxisAngle(new Vector3(0, 0, 1), Math.abs(Math.cos(delta * 0.001 + z * 5)) * 0.05);
      tubeVertices.setX(i, vec3.x);
      tubeVertices.setY(i, vec3.y);
    }

    tubeGeometry.attributes.position.needsUpdate = true;
    curve.points[2].x = 100 * (1 - mouse.current.ratio.x) - 50;
    curve.points[4].x = 100 * (1 - mouse.current.ratio.x) - 50;
    curve.points[2].y = 100 * (1 - mouse.current.ratio.y) - 50;
    curve.points[4].y = 100 * (1 - mouse.current.ratio.y) - 50;
    splineMesh.geometry.attributes.position.needsUpdate = true;
    splineMesh.geometry.setFromPoints(curve.getPoints(120));
    delta *= 0.0003;
    let h, rgb;

    for (let i = 0; i < tubeVertices.count; i = i + 3) {
      const vx = tubeVertices.getX(i);
      const vy = tubeVertices.getY(i);
      const vz = tubeVertices.getZ(i);
      h = (Math.floor(Math.abs(perlin.simplex3(vx * 2, vy * 4, vz * 2 + delta)) * 80 * 100) * 0.01 + 180) / 360;
      rgb = hslToRgb(h, 0.7, 0.45);
      const color = new Color(rgb[0], rgb[1], rgb[2]);
      colors.setXYZ(i + 0, color.r, color.g, color.b);
      colors.setXYZ(i + 1, color.r, color.g, color.b);
      colors.setXYZ(i + 2, color.r, color.g, color.b);
    }

    tubeGeometry.attributes.color.needsUpdate = true;
  }

  function onPointerMove(e) {
    mouse.current.target.x = e.clientX;
    mouse.current.target.y = e.clientY;
  }

  function onScroll(e) {
    if (e.deltaY >= 0) {
      wheel.current += 10;
    } else {
      wheel.current -= 10;
    }

    wheel.current < 0 && (wheel.current = 0);
  }

  function updateCameraPos() {
    mouse.current.position.x += (mouse.current.target.x - mouse.current.position.x) / 15;
    mouse.current.position.y += (mouse.current.target.y - mouse.current.position.y) / 15;
    mouse.current.ratio.x = mouse.current.position.x / ww;
    mouse.current.ratio.y = mouse.current.position.y / wh;
    camera.rotation.y = Math.PI - (mouse.current.ratio.x * 0.1 - 0.05);
    camera.position.x = mouse.current.ratio.x * 0.008 - 0.004;
    camera.position.y = mouse.current.ratio.y * 0.008 - 0.004;
    ref.current.position.z = -wheel.current / 500;
  }

  return /*#__PURE__*/React.createElement("mesh", {
    ref: ref,
    geometry: tubeGeometry,
    material: tubeMaterial,
    position: [0, 0, 0],
    rotation: defaultRotation,
    onPointerMove: onPointerMove
  });
}

function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    var hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 100) * 0.01, Math.round(g * 100) * 0.01, Math.round(b * 100) * 0.01];
}