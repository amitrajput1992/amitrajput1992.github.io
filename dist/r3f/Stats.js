import { useState, useEffect } from '../../static/snowpack/pkg/react.js';
import { useFrame } from '../../static/snowpack/pkg/react-three-fiber.js'; // @ts-ignore

import StatsImpl from '../../static/snowpack/pkg/statsjs.js';
export default function Stats({
  showPanel = 0
}) {
  const [stats] = useState(() => new StatsImpl());
  useEffect(() => {
    stats.showPanel(showPanel);
    document.body.appendChild(stats.dom);
    stats.dom.style.position = 'absolute'; // stats.dom.style.top = '10%';

    return () => document.body.removeChild(stats.dom);
  }, []);
  return useFrame(state => {
    stats.begin();
    state.gl.render(state.scene, state.camera);
    stats.end();
  }, 1);
}