import { useState, useEffect } from 'react';
import { useFrame } from 'react-three-fiber';
// @ts-ignore
import StatsImpl from 'stats.js';

export default function Stats({ showPanel = 0 }) {
  const [stats] = useState(() => new (StatsImpl as any)());
  useEffect(() => {
    stats.showPanel(showPanel);
    document.body.appendChild(stats.dom);
    stats.dom.style.position = 'absolute';
    // stats.dom.style.top = '10%';
    return () => document.body.removeChild(stats.dom);
  }, []);
  return useFrame((state) => {
    stats.begin();
    state.gl.render(state.scene, state.camera);
    stats.end();
  }, 1);
}
