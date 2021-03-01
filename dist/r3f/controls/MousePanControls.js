function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { useRef } from '../../../static/snowpack/pkg/react.js';
import { useFrame, extend, useThree } from '../../../static/snowpack/pkg/react-three-fiber.js';
const HALF_PI = Math.PI / 2;
/**
 * MousePanControls allows manipulation of the camera through clicking and
 * dragging the mouse on a desktop
 */

class MousePanControlsImpl {
  /**
   * Create a MousePanControls instance, and attaches the necessary event
   * listeners
   * @param camera - A Three.js Camera to control
   * @param domElement - An optional DOM element to attach the mouse events to.
   *   Defaults to the `window` object.
   */
  constructor(camera, domElement) {
    _defineProperty(this, "camera", void 0);

    _defineProperty(this, "enabled", void 0);

    _defineProperty(this, "lastMouseX", void 0);

    _defineProperty(this, "lastMouseY", void 0);

    _defineProperty(this, "domElement", void 0);

    _defineProperty(this, "tracking", void 0);

    _defineProperty(this, "deltaYaw", void 0);

    _defineProperty(this, "deltaPitch", void 0);

    _defineProperty(this, "fov", void 0);

    _defineProperty(this, "connect", () => {
      this.domElement.addEventListener('mousedown', this.mouseDownHandler);
      window.addEventListener('mousemove', this.mouseMoveHandler);
      window.addEventListener('mouseup', this.mouseUpHandler);
      this.enabled = true; // Should start untracked.

      this.tracking = false;
    });

    _defineProperty(this, "disconnect", () => {
      this.domElement.removeEventListener('mousedown', this.mouseDownHandler);
      window.removeEventListener('mousemove', this.mouseMoveHandler);
      window.removeEventListener('mouseup', this.mouseUpHandler);
      this.enabled = false;
    });

    _defineProperty(this, "mouseDownHandler", e => {
      this.tracking = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    _defineProperty(this, "mouseUpHandler", () => {
      this.tracking = false;
    });

    _defineProperty(this, "mouseMoveHandler", e => {
      if (!this.tracking) {
        return;
      }

      const width = this.domElement.clientWidth;
      const height = this.domElement.clientHeight;
      const aspect = width / height;
      const deltaX = e.clientX - this.lastMouseX;
      const deltaY = e.clientY - this.lastMouseY;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      this.deltaPitch += deltaX / width * this.fov * aspect;
      this.deltaYaw += deltaY / height * this.fov;
      this.deltaYaw = Math.max(-HALF_PI, Math.min(HALF_PI, this.deltaYaw));
    });

    _defineProperty(this, "update", () => {
      if (!this.enabled) {
        return;
      }

      if (this.deltaPitch === 0 && this.deltaYaw === 0) {
        return false;
      }

      const rotation = this.camera.quaternion.toArray();
      const cp = Math.cos(this.deltaPitch / 2);
      const sp = Math.sin(this.deltaPitch / 2);
      const cy = Math.cos(this.deltaYaw / 2);
      const sy = Math.sin(this.deltaYaw / 2);
      const x1 = rotation[0];
      const y1 = rotation[1];
      const z1 = rotation[2];
      const w1 = rotation[3];
      const x2 = cp * x1 + sp * z1;
      const y2 = cp * y1 + sp * w1;
      const z2 = cp * z1 - sp * x1;
      const w2 = cp * w1 - sp * y1;
      const x3 = w2 * sy + x2 * cy;
      const y3 = y2 * cy + z2 * sy;
      const z3 = -y2 * sy + z2 * cy;
      const w3 = w2 * cy - x2 * sy;
      rotation[0] = x3;
      rotation[1] = y3;
      rotation[2] = z3;
      rotation[3] = w3;
      this.camera.quaternion.fromArray(rotation);
      this.deltaPitch = 0;
      this.deltaYaw = 0;
    });

    this.deltaYaw = 0;
    this.deltaPitch = 0;
    this.camera = camera;
    this.enabled = true;
    this.tracking = false;
    this.domElement = domElement || window;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.fov = this.camera.fov * Math.PI / 180;
    this.connect();
  }

}

extend({
  MousePanControlsImpl
});
export const MousePanControls = () => {
  const {
    camera,
    gl: {
      domElement
    }
  } = useThree();
  const controls = useRef();
  useFrame(() => {
    //@ts-ignore
    controls.current.update();
  });
  return /*#__PURE__*/React.createElement("mousePanControlsImpl", {
    ref: controls,
    args: [camera, domElement]
  });
};