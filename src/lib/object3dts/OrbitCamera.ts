import * as BABYLON from 'babylonjs';
import { SphericalCoordsXYZ} from './SphericalCoordinates.ts';


const EPSILON: number = 0.001;
const STATE = {
  NONE: -1,
  ROTATE: 0,
  DOLLY: 1,
  PAN: 2,
  TOUCH_ROTATE: 3,
  TOUCH_DOLLY: 4,
  TOUCH_PAN: 5,
};

export default class OrbitCamera {
  private camera: BABYLON.ArcRotateCamera;
  private enabled: true;
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
  private target: BABYLON.Vector3;
  private _target0: BABYLON.Vector3;
  private _targetEnd: BABYLON.Vector3;
  private _spherical: SphericalCoordsXYZ;
  private _sphericalEnd : SphericalCoordsXYZ;
  private _position0: BABYLON.Vector3;
  private _needsUpdate:boolean;

  private scope:OrbitCamera;
  private dragStart: BABYLON.Vector2;
  private dollyStart: BABYLON.Vector2;
  private state:number;
  private elementRect:any;
  private savedDampingFactor: number;

  private dispose: () => void ;



  constructor(camera: BABYLON.ArcRotateCamera, domElement: any) {
    this.camera = camera;
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
    this.target = new BABYLON.Vector3();
    this._targetEnd = new BABYLON.Vector3();


    // rotation
    this._spherical = new SphericalCoordsXYZ();

    this._spherical.setFromVector3(this.camera.position);
 
    this._sphericalEnd = new SphericalCoordsXYZ().copy(this._spherical);


    // reset
    this._target0 = this.target.clone();
    this._position0 = this.camera.position.clone();

    this._needsUpdate = true;
    
    //CHECK THIS DELTA
    this.update();

    if (!this.domElement) {
      this.dispose = () => {};
    } else {
      this.scope = this;
      this.dragStart = new BABYLON.Vector2();
      this.dollyStart = new BABYLON.Vector2();
      this.state = STATE.NONE;

      this.domElement.addEventListener('mousedown', this.onMouseDown);
      this.domElement.addEventListener('touchstart', this.onTouchStart);
      this.domElement.addEventListener('wheel', this.onMouseWheel);
      this.domElement.addEventListener('contextmenu', this.onContextMenu);

      this.dispose = () => {
        this.domElement.removeEventListener('mousedown', this.onMouseDown);
        this.domElement.removeEventListener('touchstart', this.onTouchStart);
        this.domElement.removeEventListener('wheel', this.onMouseWheel);
        this.domElement.removeEventListener('contextmenu', this.onContextMenu);
        document.removeEventListener('mousemove', this.dragging);
        document.removeEventListener('touchmove', this.dragging);
        document.removeEventListener('mouseup', this.endDragging);
        document.removeEventListener('touchend', this.endDragging);
      };
    }
  }

  private onMouseDown(event: any) {
    if (!this.enabled) return;

    event.preventDefault();

    const prevState = this.state;

    switch (event.button) {
      case 0: // left
        console.log("LEFT");
        this.state = STATE.ROTATE;
        break;

      case 1: // middle
        console.log("MIDDLE");
        this.state = STATE.DOLLY;
        break;

      case 2: //right
        this.state = STATE.PAN;
        break;
    }

    if (prevState === STATE.NONE) {
      this.startDragging(event);
    }
  }

  private onTouchStart(event:any) {
    if (!this.enabled) return;

    event.preventDefault();

    const prevState = this.state;

    switch (event.touches.length) {
      case 1:	// one-fingered touch: rotate

        this.state = STATE.TOUCH_ROTATE;
        break;

      case 2:	// two-fingered touch: dolly

        this.state = STATE.TOUCH_DOLLY;
        break;

      case 3: // three-fingered touch: pan

        this.state = STATE.TOUCH_PAN;
        break;
    }

    if (prevState === STATE.NONE) {
      this.startDragging(event);
    }
  }


  private onMouseWheel(event:any) {
    if (!this.enabled) return;

    event.preventDefault();

    if (event.deltaY < 0) {
      this.dollyIn();
    } else if (event.deltaY > 0) {
      this.dollyOut();
    }
  }

  private onContextMenu(event:any) {
    if (!this.enabled) return;

    event.preventDefault();
  }

  private startDragging(event:any) {
    if (!this.enabled) return;

    event.preventDefault();

    const _event = event.touches ? event.touches[0] : event;
    const x: number = _event.clientX;
    const y: number = _event.clientY;

    this.elementRect = this.domElement.getBoundingClientRect();
    this.dragStart.set(x, y);


    if (this.state === STATE.TOUCH_DOLLY) {
      const dx: number = x - event.touches[1].pageX;
      const dy: number = y - event.touches[1].pageY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      this.dollyStart.set(0, distance);
    }

    this.savedDampingFactor = this.dampingFactor;
    this.dampingFactor = this.draggingDampingFactor;

    document.addEventListener('mousemove', this.dragging, { passive: false });
    document.addEventListener('touchmove', this.dragging, { passive: false });
    document.addEventListener('mouseup', this.endDragging);
    document.addEventListener('touchend', this.endDragging);
  }

  private dragging(event:any) {
    if (!this.enabled) return;

    event.preventDefault();

    const _event = event.touches ? event.touches[0] : event;
    const x: number = _event.clientX;
    const y: number = _event.clientY;

    const deltaX: number = this.dragStart.x - x;
    const deltaY: number = this.dragStart.y - y;


    this.dragStart.set(x, y);

    switch (this.state) {
      case STATE.ROTATE:
      case STATE.TOUCH_ROTATE:

        const rotTheta: number = 2 * Math.PI * deltaX / this.elementRect.width;
        const rotPhi: number = 2 * Math.PI * deltaY / this.elementRect.height;
        this.rotate(rotTheta, rotPhi, true);
        break;

      case STATE.DOLLY:
        // not implemented
        break;

      case STATE.TOUCH_DOLLY:

        const dx: number = x - event.touches[1].pageX;
        const dy: number = y - event.touches[1].pageY;
        const distance: number = Math.sqrt(dx * dx + dy * dy);
        const dollyDelta: number = this.dollyStart.y - distance;

        if (dollyDelta > 0) {
          this.dollyOut();
        } else if (dollyDelta < 0) {
          this.dollyIn();
        }

        this.dollyStart.set(0, distance);
        break;

      case STATE.PAN:
      case STATE.TOUCH_PAN:
        const offset = new BABYLON.Vector3().copyFrom(this.camera.position).subtract(this.target);
        // half of the fov is center to top of screen
        const targetDistance: number = offset.length() * Math.tan((this.camera.fov / 2) * Math.PI / 180);
        const panX: number = (this.truckSpeed * deltaX * targetDistance / this.elementRect.height);
        const panY: number = (this.truckSpeed * deltaY * targetDistance / this.elementRect.height);
        this.pan(panX, panY, true);
        break;
    }
  }

  private endDragging(): void {
    if (!this.enabled) return;

    this.dampingFactor = this.savedDampingFactor;
    this.state = STATE.NONE;

    document.removeEventListener('mousemove', this.dragging);
    document.removeEventListener('touchmove', this.dragging);
    document.removeEventListener('mouseup', this.endDragging);
    document.removeEventListener('touchend', this.endDragging);
  }

  private dollyIn(): void {
    const zoomScale: number = Math.pow(0.95, this.dollySpeed);
    this.dolly(this._sphericalEnd.radius * zoomScale - this._sphericalEnd.radius, true);
  }

  private dollyOut(): void {
    const zoomScale: number = Math.pow(0.95, this.dollySpeed);
    this.dolly(this._sphericalEnd.radius / zoomScale - this._sphericalEnd.radius, true);
  }

  // rotX in radian
  // rotY in radian
  private rotate(rotTheta: number, rotPhi: number, enableTransition: boolean): void {
    this.rotateTo(
      this._sphericalEnd.theta + rotTheta,
      this._sphericalEnd.phi + rotPhi,
      enableTransition,
    );
  }

  // rotX in radian
  // rotY in radian
  private rotateTo(rotTheta: number, rotPhi: number, enableTransition:boolean): void {
    const theta: number = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, rotTheta));
    const phi: number = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, rotPhi));

    this._sphericalEnd.theta = theta;
    this._sphericalEnd.phi = phi;
    this._sphericalEnd.makeSafe();


    
    if (!enableTransition) {
      this._spherical.theta = this._sphericalEnd.theta;
      this._spherical.phi = this._sphericalEnd.phi;
    }

    this._needsUpdate = true;
    
  }

  private dolly(distance: number, enableTransition: boolean):void  {
    this.dollyTo(this._sphericalEnd.radius + distance, enableTransition);
  }

  private dollyTo(distance: number, enableTransition: boolean): void {
    this._sphericalEnd.radius = BABYLON.Scalar.Clamp(
      distance,
      this.minDistance,
      this.maxDistance,
    );

    if (!enableTransition) {
      this._spherical.radius = this._sphericalEnd.radius;
    }

    this._needsUpdate = true;
  }

  private pan(x: number, y: number, enableTransition: boolean): void {
    this.truck(x, y, enableTransition);
  }

  private truck(x: number, y: number, enableTransition: boolean): void {
    this.camera.update();

    const _xColumn: BABYLON.Vector3 = new BABYLON.Vector3().set(
      this.camera.getTransformationMatrix().getRow(0).x,
      this.camera.getTransformationMatrix().getRow(0).y,
      this.camera.getTransformationMatrix().getRow(0).z
    );
    const _yColumn: BABYLON.Vector3 = new BABYLON.Vector3().set(
      this.camera.getTransformationMatrix().getRow(1).x,
      this.camera.getTransformationMatrix().getRow(1).y,
      this.camera.getTransformationMatrix().getRow(1).z
    );

    const offset: BABYLON.Vector3 = new BABYLON.Vector3().copyFrom(_xColumn).add(_yColumn);
    this._targetEnd.add(offset);

    if (!enableTransition) {
      this.target.copyFrom(this._targetEnd);
    }

    this._needsUpdate = true;
  }

  private moveTo(x:number, y:number, z:number, enableTransition:boolean): void {
    this._targetEnd.set(x, y, z);

    if (!enableTransition) {
      this.target.copyFrom(this._targetEnd);
    }

    this._needsUpdate = true;
  }

  public saveState(): void {
    this._target0.copyFrom(this.target);
    this._position0.copyFrom(this.camera.position);
  }

  public reset(enableTransition: boolean): void {
    this._targetEnd.copyFrom(this._target0);
    this._sphericalEnd.setFromVector3(this._position0);
    this._sphericalEnd.theta = this._sphericalEnd.theta % (2 * Math.PI);
    this._spherical.theta = this._spherical.theta % (2 * Math.PI);

    if (!enableTransition) {
      this.target.copyFrom(this._targetEnd);
      this._spherical.copyFrom(this._sphericalEnd);
    }

    this._needsUpdate = true;
  }

  private update(delta: number = 0):boolean {
    const dampingFactor: number = this.dampingFactor * delta / 0.016;
    const deltaTheta: number = this._sphericalEnd.theta - this._spherical.theta;
    const deltaPhi: number = this._sphericalEnd.phi - this._spherical.phi;
    const deltaRadius: number = this._sphericalEnd.radius - this._spherical.radius;
    const deltaTarget: BABYLON.Vector3 = new BABYLON.Vector3().subtract(this._targetEnd).subtract(this.target);

    if (
      Math.abs(deltaTheta) > EPSILON
  		|| Math.abs(deltaPhi) > EPSILON
  		|| Math.abs(deltaRadius) > EPSILON
  		|| Math.abs(deltaTarget.x) > EPSILON
  		|| Math.abs(deltaTarget.y) > EPSILON
  		|| Math.abs(deltaTarget.z) > EPSILON
    ) {
      this._spherical.set(
        this._spherical.radius + deltaRadius * dampingFactor,
        this._spherical.phi + deltaPhi * dampingFactor,
        this._spherical.theta + deltaTheta * dampingFactor,
      );

      this.target.add(deltaTarget.scale(dampingFactor));
      this._needsUpdate = true;
    } else {
      this._spherical.copy(this._sphericalEnd);
      this.target.copyFrom(this._targetEnd);
    }

    this._spherical.makeSafe();
    this.camera.setPosition(new BABYLON.Vector3(
      this._spherical.cartesian.x,
      this._spherical.cartesian.y,
      this._spherical.cartesian.z,
    ).add(this.target));
    this.camera.setTarget(this.target);

    const needsUpdate:boolean = this._needsUpdate;
    this._needsUpdate = false;

    return needsUpdate;
  }
/*
  toJSON() {
    return JSON.stringify({
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
      position: this.object.position.toArray(),

      target0: this._target0.toArray(),
      position0: this._position0.toArray(),
    });
  }

  fromJSON(json, enableTransition) {
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
  */
}

/*
function infinityToMaxNumber(value: number): number {
  if (isFinite(value)) return value;

  if (value < 0) return -Number.MAX_VALUE;

  return Number.MAX_VALUE;
}

function maxNumberToInfinity(value: number): number {
  if (Math.abs(value) < Number.MAX_VALUE) return value;

  return value * Infinity;
}
*/