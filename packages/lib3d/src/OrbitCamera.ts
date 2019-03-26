import * as THREE from "three";
import { SphericalCoordsXYZ } from "./SphericalCoordsXYZ";

const EPSILON: number = 0.001;
const STATE = {
  NONE: -1,
  ROTATE: 0,
  DOLLY: 1,
  PAN: 2,
  TOUCH_ROTATE: 3,
  TOUCH_DOLLY: 4,
  TOUCH_PAN: 5
};

export default class OrbitCamera {
  public target: THREE.Vector3;
  private camera: THREE.Camera;
  private enabled: boolean;

  private minDistance: number;
  private maxDistance: number;
  private minPolarAngle: number; // radians
  private maxPolarAngle: number; // radians
  private minAzimuthAngle: number; // radians
  private maxAzimuthAngle: number; // radians
  private dampingFactor: number;
  private draggingDampingFactor: number;
  private dollySpeed: number;
  private truckSpeed: number;
  private domElement: any;
  private _targetEnd: THREE.Vector3;

  private _spherical: SphericalCoordsXYZ;
  private _sphericalEnd: SphericalCoordsXYZ;

  private _target0: THREE.Vector3;
  private _position0: THREE.Vector3;

  private ortho: {
    near: number;
    far: number;
    left: number;
    right: number;
  };

  private _needsUpdate: boolean;

  private dispose: () => void;

  constructor(camera: THREE.Camera, domElement: any) {
    this.camera = camera;

    if (this.camera instanceof THREE.OrthographicCamera) {
      this.ortho = {
        near: this.camera.near,
        far: this.camera.far,
        left: this.camera.left,
        right: this.camera.right
      };
    } else {
      this.ortho = {
        near: 0.1,
        far: 10000,
        left: -200,
        right: 200
      };
    }

    this.enabled = true;

    this.minDistance = 0;
    this.maxDistance = Infinity;
    this.minPolarAngle = 0; // radians
    this.maxPolarAngle = Math.PI; // radians
    this.minAzimuthAngle = -Infinity; // radians
    this.maxAzimuthAngle = Infinity; // radians
    this.dampingFactor = 0.05;
    this.draggingDampingFactor = 0.25;
    this.dollySpeed = 1.0;
    this.truckSpeed = 2.0;

    this.domElement = domElement;

    // the location of focus, where the object orbits around
    this.target = new THREE.Vector3();
    this._targetEnd = new THREE.Vector3();

    // rotation
    this._spherical = new SphericalCoordsXYZ();

    this._spherical.setFromVector3(this.camera.position);

    this._sphericalEnd = new SphericalCoordsXYZ().copy(this._spherical);

    // reset
    this._target0 = this.target.clone();
    this._position0 = this.camera.position.clone();

    this._needsUpdate = true;
    this.update(0);

    if (!this.domElement) {
      this.dispose = () => {
        /* Empty on purpose*/
      };
    } else {
      // tslint:disable-next-line:no-this-assignment
      const scope = this;
      const dragStart: THREE.Vector2 = new THREE.Vector2();
      const dollyStart: THREE.Vector2 = new THREE.Vector2();
      let state: number = STATE.NONE;
      let elementRect: any;
      let savedDampingFactor: any;

      const onMouseDown = (event: any) => {
        if (!scope.enabled) {
          return;
        }

        event.preventDefault();

        const prevState = state;

        switch (event.button) {
          case THREE.MOUSE.LEFT:
            state = STATE.ROTATE;
            break;

          case THREE.MOUSE.MIDDLE:
            state = STATE.DOLLY;
            break;

          case THREE.MOUSE.RIGHT:
            state = STATE.PAN;
            break;
        }

        if (prevState === STATE.NONE) {
          startDragging(event);
        }
      };

      const onTouchStart = (event: any) => {
        if (!scope.enabled) {
          return;
        }

        event.preventDefault();

        const prevState = state;

        switch (event.touches.length) {
          case 1: // one-fingered touch: rotate
            state = STATE.TOUCH_ROTATE;
            break;

          case 2: // two-fingered touch: dolly
            state = STATE.TOUCH_DOLLY;
            break;

          case 3: // three-fingered touch: pan
            state = STATE.TOUCH_PAN;
            break;
        }

        if (prevState === STATE.NONE) {
          startDragging(event);
        }
      };

      const onMouseWheel = (event: any) => {
        if (!scope.enabled) {
          return;
        }

        event.preventDefault();

        if (event.deltaY < 0) {
          dollyIn();
        } else if (event.deltaY > 0) {
          dollyOut();
        }
      };

      const onContextMenu = (event: any) => {
        if (!scope.enabled) {
          return;
        }

        event.preventDefault();
      };

      const startDragging = (event: any) => {
        if (!scope.enabled) {
          return;
        }

        event.preventDefault();

        const _event = event.touches ? event.touches[0] : event;
        const x: number = _event.clientX;
        const y: number = _event.clientY;

        elementRect = scope.domElement.getBoundingClientRect();
        dragStart.set(x, y);

        if (state === STATE.TOUCH_DOLLY) {
          const dx: number = x - event.touches[1].pageX;
          const dy: number = y - event.touches[1].pageY;
          const distance: number = Math.sqrt(dx * dx + dy * dy);

          dollyStart.set(0, distance);
        }

        savedDampingFactor = scope.dampingFactor;
        scope.dampingFactor = scope.draggingDampingFactor;

        document.addEventListener("mousemove", dragging, { passive: false });
        document.addEventListener("touchmove", dragging, { passive: false });
        document.addEventListener("mouseup", endDragging);
        document.addEventListener("touchend", endDragging);
      };

      const dragging = (event: any) => {
        if (!scope.enabled) {
          return;
        }

        event.preventDefault();

        const _event = event.touches ? event.touches[0] : event;
        const x: number = _event.clientX;
        const y: number = _event.clientY;

        const deltaX: number = dragStart.x - x;
        const deltaY: number = dragStart.y - y;

        dragStart.set(x, y);

        switch (state) {
          case STATE.ROTATE:
          case STATE.TOUCH_ROTATE:
            const rotTheta: number = (2 * Math.PI * deltaX) / elementRect.width;
            const rotPhi: number = (2 * Math.PI * deltaY) / elementRect.height;
            scope.rotate(rotTheta, rotPhi, true);
            break;

          case STATE.DOLLY:
            // not implemented
            break;

          case STATE.TOUCH_DOLLY:
            const dx: number = x - event.touches[1].pageX;
            const dy: number = y - event.touches[1].pageY;
            const distance: number = Math.sqrt(dx * dx + dy * dy);
            const dollyDelta: number = dollyStart.y - distance;

            if (dollyDelta > 0) {
              dollyOut();
            } else if (dollyDelta < 0) {
              dollyIn();
            }

            dollyStart.set(0, distance);
            break;

          case STATE.PAN:
          case STATE.TOUCH_PAN:
            const offset: THREE.Vector3 = new THREE.Vector3()
              .copy(scope.camera.position)
              .sub(scope.target);
            let targetDistance: number;
            if (scope.camera instanceof THREE.PerspectiveCamera) {
              // half of the fov is center to top of screen
              targetDistance =
                offset.length() *
                Math.tan(((scope.camera.fov / 2) * Math.PI) / 180);
            } else {
              targetDistance = offset.length() / 2;
            }
            const panX: number =
              (scope.truckSpeed * deltaX * targetDistance) / elementRect.height;
            const panY: number =
              (scope.truckSpeed * deltaY * targetDistance) / elementRect.height;
            scope.pan(panX, panY, true);
            break;
        }
      };

      const endDragging = () => {
        if (!scope.enabled) {
          return;
        }

        scope.dampingFactor = savedDampingFactor;
        state = STATE.NONE;

        document.removeEventListener("mousemove", dragging);
        document.removeEventListener("touchmove", dragging);
        document.removeEventListener("mouseup", endDragging);
        document.removeEventListener("touchend", endDragging);
      };

      const dollyIn = () => {
        const zoomScale: number = Math.pow(0.7, scope.dollySpeed);

        if (scope.camera instanceof THREE.PerspectiveCamera) {
          scope.dolly(
            scope._sphericalEnd.radius * zoomScale - scope._sphericalEnd.radius
          );
        } else if (scope.camera instanceof THREE.OrthographicCamera) {
          Object.keys(scope.ortho).forEach(
            key => (scope.ortho[key] *= zoomScale)
          );
        }
      };

      const dollyOut = () => {
        const zoomScale: number = Math.pow(0.7, scope.dollySpeed);

        if (scope.camera instanceof THREE.PerspectiveCamera) {
          scope.dolly(
            scope._sphericalEnd.radius / zoomScale - scope._sphericalEnd.radius
          );
        } else if (scope.camera instanceof THREE.OrthographicCamera) {
          Object.keys(scope.ortho).forEach(
            key => (scope.ortho[key] /= zoomScale)
          );
        }
      };

      this.domElement.addEventListener("mousedown", onMouseDown);
      this.domElement.addEventListener("touchstart", onTouchStart);
      this.domElement.addEventListener("wheel", onMouseWheel);
      this.domElement.addEventListener("contextmenu", onContextMenu);

      this.dispose = () => {
        scope.domElement.removeEventListener("mousedown", onMouseDown);
        scope.domElement.removeEventListener("touchstart", onTouchStart);
        scope.domElement.removeEventListener("wheel", onMouseWheel);
        scope.domElement.removeEventListener("contextmenu", onContextMenu);
        document.removeEventListener("mousemove", dragging);
        document.removeEventListener("touchmove", dragging);
        document.removeEventListener("mouseup", endDragging);
        document.removeEventListener("touchend", endDragging);
      };
    }
  }

  // rotX in radian
  // rotY in radian
  public rotateTo(
    rotTheta: number,
    rotPhi: number,
    enableTransition: boolean
  ): void {
    const theta: number = Math.max(
      this.minAzimuthAngle,
      Math.min(this.maxAzimuthAngle, rotTheta)
    );
    const phi: number = Math.max(
      this.minPolarAngle,
      Math.min(this.maxPolarAngle, rotPhi)
    );

    this._sphericalEnd.theta = theta;
    this._sphericalEnd.phi = phi;
    this._sphericalEnd.makeSafe();

    if (!enableTransition) {
      this._spherical.theta = this._sphericalEnd.theta;
      this._spherical.phi = this._sphericalEnd.phi;
    }

    this._needsUpdate = true;
  }

  public center() {
    this.reset(true);
    // this.rotateTo(-1.5707963267948966, 1.0808390005411683, true);
    // this.dollyTo(170,true);
  }

  public zoomIn() {
    const zoomScale: number = Math.pow(0.95, this.dollySpeed);

    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.dolly(
        this._sphericalEnd.radius * zoomScale - this._sphericalEnd.radius
      );
    } else if (this.camera instanceof THREE.OrthographicCamera) {
      Object.keys(this.ortho).forEach(key => (this.ortho[key] *= zoomScale));
    }
  }

  public zoomOut() {
    const zoomScale: number = Math.pow(0.95, this.dollySpeed);
    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.dolly(
        this._sphericalEnd.radius / zoomScale - this._sphericalEnd.radius
      );
    } else if (this.camera instanceof THREE.OrthographicCamera) {
      Object.keys(this.ortho).forEach(key => (this.ortho[key] /= zoomScale));
    }
  }

  public update(delta: number): boolean {
    const dampingFactor: number = (this.dampingFactor * delta) / 0.016;
    const deltaTheta: number = this._sphericalEnd.theta - this._spherical.theta;
    const deltaPhi: number = this._sphericalEnd.phi - this._spherical.phi;
    const deltaRadius: number =
      this._sphericalEnd.radius - this._spherical.radius;
    const deltaTarget: THREE.Vector3 = new THREE.Vector3().subVectors(
      this._targetEnd,
      this.target
    );

    if (
      Math.abs(deltaTheta) > EPSILON ||
      Math.abs(deltaPhi) > EPSILON ||
      Math.abs(deltaRadius) > EPSILON ||
      Math.abs(deltaTarget.x) > EPSILON ||
      Math.abs(deltaTarget.y) > EPSILON ||
      Math.abs(deltaTarget.z) > EPSILON
    ) {
      this._spherical.set(
        this._spherical.radius + deltaRadius * dampingFactor,
        this._spherical.phi + deltaPhi * dampingFactor,
        this._spherical.theta + deltaTheta * dampingFactor
      );

      this.target.add(deltaTarget.multiplyScalar(dampingFactor));
      this._needsUpdate = true;
    } else {
      this._spherical.copy(this._sphericalEnd);
      this.target.copy(this._targetEnd);
    }

    this._spherical.makeSafe();

    if (this.camera instanceof THREE.OrthographicCamera) {
      const proportions: number =
        this.domElement.clientWidth / this.domElement.clientHeight;

      this.camera.left = Math.min(this.ortho.left, 0);
      this.camera.right = Math.max(this.ortho.right, 0);
      this.camera.near = 0.1;
      this.camera.far = 100000;
      this.camera.top = Math.max(this.ortho.right / proportions, 0);
      this.camera.bottom = Math.min(this.ortho.left / proportions, 0);
      this.camera.updateProjectionMatrix();
    }

    this.camera.position
      .set(
        this._spherical.cartesian.x,
        this._spherical.cartesian.y,
        this._spherical.cartesian.z
      )
      .add(this.target);

    this.camera.lookAt(this.target);

    const needsUpdate = this._needsUpdate;
    this._needsUpdate = false;

    return needsUpdate;
  }

  public toJSON(): object {
    return {
      enabled: this.enabled,

      minDistance: this.minDistance,
      maxDistance: infinityToMaxNumber(this.maxDistance),
      minPolarAngle: this.minPolarAngle,
      maxPolarAngle: infinityToMaxNumber(this.maxPolarAngle),
      minAzimuthAngle: infinityToMaxNumber(this.minAzimuthAngle),
      maxAzimuthAngle: infinityToMaxNumber(this.maxAzimuthAngle),
      dampingFactor: this.dampingFactor,
      draggingDampingFactor: this.draggingDampingFactor,
      dollySpeed: this.dollySpeed,
      truckSpeed: this.truckSpeed,

      target: this._targetEnd.toArray(),
      position: this.camera.position.toArray(),

      target0: this._target0.toArray(),
      position0: this._position0.toArray()
    };
  }

  // rotX in radian
  // rotY in radian
  private rotate(
    rotTheta: number,
    rotPhi: number,
    enableTransition: boolean
  ): void {
    this.rotateTo(
      this._sphericalEnd.theta + rotTheta,
      this._sphericalEnd.phi + rotPhi,
      enableTransition
    );
  }

  private dolly(distance: number, enableTransition: boolean = false): void {
    this.dollyTo(this._sphericalEnd.radius + distance, enableTransition);
  }

  private dollyTo(distance: number, enableTransition: boolean): void {
    this._sphericalEnd.radius = THREE.Math.clamp(
      distance,
      this.minDistance,
      this.maxDistance
    );

    if (!enableTransition) {
      this._spherical.radius = this._sphericalEnd.radius;
    }

    this._needsUpdate = true;
  }

  private pan(x: number, y: number, enableTransition: boolean): void {
    this.truck(x, y, enableTransition);
  }

  private truck(x: number, y: number, enableTransition: boolean) {
    this.camera.updateMatrix();

    const _xColumn: THREE.Vector3 = new THREE.Vector3().setFromMatrixColumn(
      this.camera.matrix,
      0
    );
    const _yColumn: THREE.Vector3 = new THREE.Vector3().setFromMatrixColumn(
      this.camera.matrix,
      1
    );
    _xColumn.multiplyScalar(x);
    _yColumn.multiplyScalar(-y);

    const offset: THREE.Vector3 = new THREE.Vector3()
      .copy(_xColumn)
      .add(_yColumn);
    this._targetEnd.add(offset);

    if (!enableTransition) {
      this.target.copy(this._targetEnd);
    }

    this._needsUpdate = true;
  }

  private moveTo(
    x: number,
    y: number,
    z: number,
    enableTransition: boolean
  ): void {
    this._targetEnd.set(x, y, z);

    if (!enableTransition) {
      this.target.copy(this._targetEnd);
    }

    this._needsUpdate = true;
  }

  private saveState(): void {
    this._target0.copy(this.target);
    this._position0.copy(this.camera.position);
  }

  private reset(enableTransition: boolean): void {
    this._targetEnd.copy(this._target0);
    this._sphericalEnd.setFromVector3(this._position0);
    this._sphericalEnd.theta = this._sphericalEnd.theta % (2 * Math.PI);
    this._spherical.theta = this._spherical.theta % (2 * Math.PI);

    if (!enableTransition) {
      this.target.copy(this._targetEnd);
      this._spherical.copy(this._sphericalEnd);
    }

    this._needsUpdate = true;
  }

  private fromJSON(json: string, enableTransition: boolean): void {
    const obj = JSON.parse(json);
    const position = new THREE.Vector3().fromArray(obj.position);

    this.enabled = obj.enabled;

    this.minDistance = obj.minDistance;
    this.maxDistance = maxNumberToInfinity(obj.maxDistance);
    this.minPolarAngle = obj.minPolarAngle;
    this.maxPolarAngle = maxNumberToInfinity(obj.maxPolarAngle);
    this.minAzimuthAngle = maxNumberToInfinity(obj.minAzimuthAngle);
    this.maxAzimuthAngle = maxNumberToInfinity(obj.maxAzimuthAngle);
    this.dampingFactor = obj.dampingFactor;
    this.draggingDampingFactor = obj.draggingDampingFactor;
    this.dollySpeed = obj.dollySpeed;
    this.truckSpeed = obj.truckSpeed;

    this._target0.fromArray(obj.target0);
    this._position0.fromArray(obj.position0);

    this._targetEnd.fromArray(obj.target);
    this._sphericalEnd.setFromVector3(position.sub(this._target0));

    if (!enableTransition) {
      this.target.copy(this._targetEnd);
      this._spherical.copy(this._sphericalEnd);
    }

    this._needsUpdate = true;
  }
}

const infinityToMaxNumber: (value: number) => number = (value: number) => {
  if (isFinite(value)) {
    return value;
  }

  if (value < 0) {
    return -Number.MAX_VALUE;
  }

  return Number.MAX_VALUE;
};

const maxNumberToInfinity: (value: number) => number = (value: number) => {
  if (Math.abs(value) < Number.MAX_VALUE) {
    return value;
  }

  return value * Infinity;
};
