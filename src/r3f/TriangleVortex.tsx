import React, {useEffect, useRef, useState} from 'react';
import {useFrame, useThree, PointerEvent} from 'react-three-fiber';
import {
  Vector2,
  Geometry,
  Vector3,
  CatmullRomCurve3,
  Line,
  LineBasicMaterial,
  MeshBasicMaterial,
  BackSide,
  TubeGeometry,
  Color,
  Fog,
  Euler, Mesh
} from 'three';
// @ts-ignore
import perlin from '../vendor/perlin';

const ww = window.innerWidth;
const wh = window.innerHeight;
const defaultRotation = new Euler(0, 0, 0, 'YXZ');

export default function TriangleVortex() {
  const {scene, camera} = useThree();
  useFrame(({clock, }, delta) => {
    update(clock.elapsedTime * 1000);
    updateCameraPos();
  });
  scene.fog = new Fog(0xffffff, 1, 1.9);
  const ref = useRef<Mesh>();
  const wheel = useRef(0);
  const mouse = useRef({
    position: new Vector2(ww * 0.5, wh * 0.5),
    ratio: new Vector2(0, 0),
    target: new Vector2(ww * 0.5, wh * 0.5),
  });

  useEffect(() => {
    window.addEventListener('wheel', onScroll);
    return () => window.removeEventListener('wheel', onScroll);
  }, [])

  const points = [];
  for (let i = 0; i < 5; i++) {
    points.push(new Vector3(0, 0, 3 * (i / 4)));
  }
  points[4].y = -0.06;// todo check why?
  const curve = new CatmullRomCurve3(points);
  curve.type = 'catmullrom';

  const geometry = new Geometry();
  geometry.vertices = curve.getPoints(120);
  const splineMesh = new Line(geometry, new LineBasicMaterial())

  const tubeMaterial = new MeshBasicMaterial({
    side: BackSide,
    vertexColors: true
  });

  const tubeGeometry = new TubeGeometry(curve, 120, 0.08, 3, false);

  for (let i = 0; i < tubeGeometry.faces.length; i++) {
    const face = tubeGeometry.faces[i];
    const point = tubeGeometry.vertices[face.a];
    const color = new Color(
      `hsl(${
        (Math.floor(
          Math.abs(perlin.simplex3(point.x * 2, point.y * 4, point.z * 2)) * 80 * 100
        ) * 0.01 + 180)
      }, 70%, 60%)`
    );
    face.color = color;
  }

  const tubeGeometryOriginal = tubeGeometry.clone();

  function update(delta: number) {
    let verticeOriginal;
    let vertice;
    for (let i = 0; i < tubeGeometry.vertices.length; i++) {
      vertice = tubeGeometry.vertices[i];
      verticeOriginal = tubeGeometryOriginal.vertices[i];
      const index = Math.floor(i / 120);
      vertice.x += ((verticeOriginal.x + splineMesh.geometry.vertices[index].x) - vertice.x) / 15;
      vertice.y += ((verticeOriginal.y + splineMesh.geometry.vertices[index].y) - vertice.y) / 15;
      vertice.applyAxisAngle(new Vector3(0, 0, -1), Math.abs(Math.cos(delta * 0.001 + vertice.z * 5)) * 0.03);
    }
    tubeGeometry.verticesNeedUpdate = true;

    curve.points[2].x = 100 * (1 - mouse.current.ratio.x) - 50;
    curve.points[4].x = 100 * (1 - mouse.current.ratio.x) - 50;

    curve.points[2].y = 100 * (1 - mouse.current.ratio.y) - 50;
    curve.points[4].y = 100 * (1 - mouse.current.ratio.y) - 50;

    splineMesh.geometry.verticesNeedUpdate = true;
    splineMesh.geometry.vertices = curve.getPoints(120);

    delta *= 0.0003;
    let f, p, h, rgb;
    for (let i = 0; i < tubeGeometry.faces.length; i++) {
      f = tubeGeometry.faces[i];
      p = tubeGeometry.vertices[f.a];
      h = (Math.floor(Math.abs(perlin.simplex3(p.x * 2, p.y * 4, p.z * 2 + delta)) * 80 * 100) * 0.01 + 180) / 360;
      rgb = hslToRgb(h, 0.7, 0.6)
      f.color = new Color(rgb[0], rgb[1], rgb[2]);
    }
    tubeGeometry.elementsNeedUpdate = true;
  }

  function onPointerMove(e: PointerEvent) {
    mouse.current.target.x = e.clientX;
    mouse.current.target.y = e.clientY;
  }

  function onScroll(e: WheelEvent) {
    if(e.deltaY >= 0) {
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

    (ref.current as Mesh).position.z = - wheel.current / 500;
  }

  return (
    <mesh
      ref={ref}
      geometry={tubeGeometry}
      material={tubeMaterial}
      position={[0, 0, 0]}
      rotation={defaultRotation}
      onPointerMove={onPointerMove}
    />
  );
}

function hslToRgb(h: number, s: number, l: number) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    var hue2rgb = function hue2rgb(p: number, q: number, t: number) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 100) * 0.01, Math.round(g * 100) * 0.01, Math.round(b * 100) * 0.01];
}