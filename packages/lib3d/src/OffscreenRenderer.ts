import * as THREE from "three";
import Scene from "./Scene";

export interface IOffscreenRendererOptions {
  clearColor: number;
  width: number;
  height: number;
}

export default class OffscreenRenderer {
  private objectsGroup: THREE.Group;
  private threeRenderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: Scene;
  private threeScene: THREE.Scene;
  private canvas: OffscreenCanvas;

  constructor(scene: Scene, options: Partial<IOffscreenRendererOptions> = {}) {
    this.scene = scene;

    const { width = 0, height = 0 } = options;

    this.canvas = new OffscreenCanvas(width, height);

    const rendererParams: THREE.WebGLRendererParameters = {
      antialias: true,
      canvas: (this.canvas as unknown) as HTMLCanvasElement
    };

    this.threeRenderer = new THREE.WebGLRenderer(rendererParams);
    this.threeRenderer.setClearColor(options.clearColor || 0xfafafa);
    this.threeScene = new THREE.Scene();

    this.threeScene.add(this.scene.getSceneSetup());

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    this.camera.position.set(0, -150, 80);
    this.camera.up.set(0, 0, 1);
    this.camera.lookAt(this.threeScene.position);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  public async renderImage(
    encodeOptions: ImageEncodeOptions = { type: "image/jpeg", quality: 0.95 }
  ) {
    this.threeScene.remove(this.objectsGroup);
    const newObjectsGroup = await this.scene.getObjectsAsync(true);
    this.threeScene.add(newObjectsGroup);
    this.objectsGroup = newObjectsGroup;

    this.threeRenderer.render(this.threeScene, this.camera);

    return this.canvas.convertToBlob(encodeOptions);
  }

  public destroy() {
    this.threeRenderer.dispose();
    this.threeRenderer.forceContextLoss();
  }
}
