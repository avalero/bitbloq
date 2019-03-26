import * as THREE from "three";

const WIDTH = 150;
const HEIGHT = 150;

type ChangeCameraAngleHandler = (theta: number, phi: number) => void;

export default class AxisHelper {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  private containerRect: ClientRect;

  constructor(container: HTMLElement) {
    this.container = container;
    this.setup();
  }

  public setOrtographicCamera(isOrtographic: boolean): void {
    if (isOrtographic) {
      this.camera = new THREE.OrthographicCamera(-2, 2, 2, -2, -10, 10);
    } else {
      this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
      this.camera.aspect = WIDTH / HEIGHT;
    }

    this.camera.up.set(0, 0, 1);
    this.camera.updateProjectionMatrix();
  }

  public updateCamera(x: number, y: number, z: number) {
    this.camera.position.set(x * 5, y * 5, z * 5);
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
  }

  private makeAxis(length: number, radius: number, color: number): THREE.Mesh {
    const cylinderGeometry: THREE.Geometry = new THREE.CylinderGeometry(
      radius,
      radius,
      length
    );

    return new THREE.Mesh(
      cylinderGeometry,
      new THREE.MeshLambertMaterial({ color })
    );
  }

  private async setup() {
    const rendererParams = {
      alpha: true,
      antialias: true
    };

    const renderer = new THREE.WebGLRenderer(rendererParams);
    renderer.setSize(WIDTH, HEIGHT);
    this.container.appendChild(renderer.domElement);
    this.renderer = renderer;

    this.containerRect = this.container.getBoundingClientRect();

    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AmbientLight(0x888888));
    const spotLight = new THREE.SpotLight(0xeeeeee);
    spotLight.position.set(2, -4, 3);
    this.scene.add(spotLight);
    const spotLight2 = new THREE.SpotLight(0xdddddd);
    spotLight2.position.set(-8, 8, -6);
    this.scene.add(spotLight2);

    const axes: THREE.Group = new THREE.Group();

    const length = 2;
    const radius = 0.02;
    const xAxis: THREE.Mesh = this.makeAxis(length, radius, 0xff0000);
    xAxis.rotateZ(Math.PI / 2).translateY(-length / 2);
    const yAxis: THREE.Mesh = this.makeAxis(length, radius, 0x00ff00);
    yAxis.translateY(length / 2);
    const zAxis: THREE.Mesh = this.makeAxis(length, radius, 0x0000ff);
    zAxis.rotateX(Math.PI / 2).translateY(length / 2);

    axes.add(xAxis, yAxis, zAxis);
    this.scene.add(axes);

    this.setOrtographicCamera(false);

    this.renderer.render(this.scene, this.camera);
  }
}
