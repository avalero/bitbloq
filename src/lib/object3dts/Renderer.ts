import * as THREE from 'three';
import Scene, { IHelperDescription } from './Scene';
import ObjectsCommon, { IObjectsCommonJSON } from './ObjectsCommon';
import OrbitCamera from './OrbitCamera';
import NavigationBox from './NavigationBox';

type ObjectClickHandler = (object: IObjectsCommonJSON) => void;
type BackgroundClickHandler = () => void;

const rendererContainerStyles = `
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const navBoxContainerStyles = `
  position: absolute;
  top: 0;
  left: 0;
  width: 150px;
  height: 150px;
`;

export interface RendererOptions {
  antialias: boolean;
  clearColor: number;
}

export default class Renderer {
  public static defaultOptions: RendererOptions = {
    antialias: true,
    clearColor: 0xfafafa,
  };

  private options: RendererOptions;
  private navigationBox: NavigationBox;
  private threeRenderer: THREE.WebGLRenderer;
  private clock: THREE.Clock;
  private camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  private cameraControls: OrbitCamera;
  private scene: Scene;
  private threeScene: THREE.Scene;
  private objectsGroup: THREE.Group;
  private helpersGroup: THREE.Group;
  private sceneSetupGroup: THREE.Group;
  private container: HTMLElement;
  private objectClickHandlers: ObjectClickHandler[];
  private backgroundClickHandlers: BackgroundClickHandler[];
  private containerRect: ClientRect;
  private mouseDownObject: THREE.Object3D | undefined;
  private selectOnMouseUp: boolean;

  constructor(
    scene: Scene,
    container: HTMLElement,
    options: Partial<RendererOptions> = {},
  ) {
    this.scene = scene;
    this.container = container;

    this.options = {
      ...options,
      ...Renderer.defaultOptions,
    };

    this.objectClickHandlers = [];
    this.backgroundClickHandlers = [];

    this.setup();
    this.renderLoop();
  }

  private setup() {
    const rendererParams = {
      antialias: this.options.antialias,
    };

    const threeRenderer = new THREE.WebGLRenderer(rendererParams);
    threeRenderer.setClearColor(this.options.clearColor);
    this.threeRenderer = threeRenderer;

    this.threeScene = new THREE.Scene();

    this.helpersGroup = new THREE.Group();
    this.threeScene.add(this.helpersGroup);

    this.sceneSetupGroup = this.scene.getSceneSetup();
    this.threeScene.add(this.sceneSetupGroup);

    this.clock = new THREE.Clock();

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    this.camera.position.set(0, -150, 80);
    this.camera.up.set(0, 0, 1);
    this.camera.lookAt(this.threeScene.position);

    this.cameraControls = new OrbitCamera(
      this.camera,
      this.threeRenderer.domElement,
    );

    this.container.addEventListener('mousedown', this.handleMouseDown);
    this.container.addEventListener('mousemove', this.handleMouseMove);
    this.container.addEventListener('mouseup', this.handleMouseUp);

    this.container.style.position = 'relative';

    const rendererContainer = document.createElement('div');
    rendererContainer.style.cssText = rendererContainerStyles;
    this.container.appendChild(rendererContainer);

    const navBoxContainer = document.createElement('div');
    navBoxContainer.style.cssText = navBoxContainerStyles;
    this.container.appendChild(navBoxContainer);

    this.navigationBox = new NavigationBox(navBoxContainer, {
      onChangeCameraAngle: (theta, phi) => {
        this.cameraControls.rotateTo(theta, phi, true);
      },
    });
    this.updateNavigationBox();

    rendererContainer.appendChild(threeRenderer.domElement);
  }

  private updateSize() {
    this.containerRect = this.container.getBoundingClientRect();
    const { width, height } = this.containerRect;
    this.threeRenderer.setSize(width, height);

    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }

  private updateNavigationBox() {
    const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);
    const { x, y, z } = direction;
    this.navigationBox.updateCamera(-x, -y, -z);
  }

  private renderLoop = () => {
    this.updateSize();
    const delta = this.clock.getDelta();
    const cameraNeedsUpdate = this.cameraControls.update(delta);

    if (cameraNeedsUpdate) {
      this.updateNavigationBox();
    }

    requestAnimationFrame(this.renderLoop);

    this.threeRenderer.render(this.threeScene, this.camera);
  };

  public async updateScene(): Promise<void> {
    this.threeScene.remove(this.objectsGroup);
    const newObjectsGroup = await this.scene.getObjectsAsync();
    this.threeScene.add(newObjectsGroup);
    this.objectsGroup = newObjectsGroup;
  }

  public async setActiveHelper(
    activeOperation: IHelperDescription,
  ): Promise<void> {
    while (this.helpersGroup.children.length > 0) {
      this.helpersGroup.remove(this.helpersGroup.children[0]);
    }
    const helpers = await this.scene.setActiveHelperAsync(activeOperation);
    helpers.forEach(helper => this.helpersGroup.add(helper));
  }

  public updateCameraAngle(theta: number, phi: number) {
    this.cameraControls.rotateTo(theta, phi, true);
  }

  public zoomIn(): void {}

  public zoomOut(): void {}

  public setOrtographicCamera(isOrtographic: boolean): void {}

  private handleMouseDown = (e: MouseEvent) => {
    this.mouseDownObject = this.getObjectFromPosition(e.clientX, e.clientY);
    this.selectOnMouseUp = true;
  };

  private handleMouseMove = (e: MouseEvent) => {
    this.selectOnMouseUp = false;
  };

  private handleMouseUp = (e: MouseEvent) => {
    if (this.selectOnMouseUp) {
      if (this.mouseDownObject) {
        this.objectClickHandlers.forEach(handler => {
          if (this.mouseDownObject) {
            const objectJSON = this.mouseDownObject
              .userData as IObjectsCommonJSON;
            handler(objectJSON);
          }
        });
      } else {
        this.backgroundClickHandlers.forEach(handler => handler());
      }
    }
  };

  private getObjectFromPosition(
    x: number,
    y: number,
  ): THREE.Object3D | undefined {
    const { left, top, width, height } = this.containerRect;
    const mousePosition = new THREE.Vector2();
    mousePosition.x = ((x - left) / width) * 2 - 1;
    mousePosition.y = -((y - top) / height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mousePosition, this.camera);
    const intersects = raycaster.intersectObjects(
      this.objectsGroup.children,
      true,
    );

    if (intersects.length > 0) {
      return intersects[0].object;
    }

    return undefined;
  }

  public onObjectClick(handler: ObjectClickHandler): void {
    this.objectClickHandlers.push(handler);
  }

  public onBackgroundClick(handler: BackgroundClickHandler): void {
    this.backgroundClickHandlers.push(handler);
  }
}