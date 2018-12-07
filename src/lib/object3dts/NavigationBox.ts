import * as THREE from 'three';

const HALF_PI = Math.PI / 2;
const QUARTER_PI = Math.PI / 4;
const WIDTH = 150;
const HEIGHT = 150;

interface ClickBox {
  position: [number, number, number];
  size: [number, number, number];
  cameraAngle: [number, number];
}

const clickBoxes: ClickBox[] = [
  // TOP
  {
    position: [0, 0, 1],
    size: [1.5, 1.5, 0.001],
    cameraAngle: [-HALF_PI, 0],
  },
  // BOTTOM
  {
    position: [0, 0, -1],
    size: [1.5, 1.5, 0.001],
    cameraAngle: [-HALF_PI, Math.PI],
  },
  // FRONT
  {
    position: [0, -1, 0],
    size: [1.5, 0.001, 1.5],
    cameraAngle: [-HALF_PI, HALF_PI],
  },
  // BACK
  {
    position: [0, 1, 0],
    size: [1.5, 0.001, 1.5],
    cameraAngle: [HALF_PI, HALF_PI],
  },
  // RIGHT
  {
    position: [1, 0, 0],
    size: [0.001, 1.5, 1.5],
    cameraAngle: [0, HALF_PI],
  },
  // LEFT
  {
    position: [-1, 0, 0],
    size: [0.001, 1.5, 1.5],
    cameraAngle: [-Math.PI, HALF_PI],
  },
  // TOP-FRONT
  {
    position: [0, -0.876, 0.876],
    size: [1.5, 0.25, 0.25],
    cameraAngle: [-HALF_PI, QUARTER_PI],
  },
  // TOP-LEFT
  {
    position: [-0.876, 0, 0.876],
    size: [0.25, 1.5, 0.25],
    cameraAngle: [-Math.PI, QUARTER_PI],
  },
  // TOP-BACK
  {
    position: [0, 0.876, 0.876],
    size: [1.5, 0.25, 0.25],
    cameraAngle: [HALF_PI, QUARTER_PI],
  },
  // TOP-RIGHT
  {
    position: [0.876, 0, 0.876],
    size: [0.25, 1.5, 0.25],
    cameraAngle: [0, QUARTER_PI],
  },
  // BOTTOM-FRONT
  {
    position: [0, -0.876, -0.876],
    size: [1.5, 0.25, 0.25],
    cameraAngle: [-HALF_PI, 3*QUARTER_PI],
  },
  // BOTTOM-LEFT
  {
    position: [-0.876, 0, -0.876],
    size: [0.25, 1.5, 0.25],
    cameraAngle: [-Math.PI, 3*QUARTER_PI],
  },
  // BOTTOM-BACK
  {
    position: [0, 0.876, -0.876],
    size: [1.5, 0.25, 0.25],
    cameraAngle: [HALF_PI, 3*QUARTER_PI],
  },
  // BOTTOM-RIGHT
  {
    position: [0.876, 0, -0.876],
    size: [0.25, 1.5, 0.25],
    cameraAngle: [0, 3*QUARTER_PI],
  },
  // FRONT-LEFT
  {
    position: [-0.876, -0.876, 0],
    size: [0.25, 0.25, 1.5],
    cameraAngle: [-3*QUARTER_PI, HALF_PI],
  },
  // FRONT-RIGHT
  {
    position: [0.876, -0.876, 0],
    size: [0.25, 0.25, 1.5],
    cameraAngle: [-QUARTER_PI, HALF_PI],
  },
  // BACK-LEFT
  {
    position: [-0.876, 0.876, 0],
    size: [0.25, 0.25, 1.5],
    cameraAngle: [3*QUARTER_PI, HALF_PI],
  },
  // BACK-RIGHT
  {
    position: [0.876, 0.876, 0],
    size: [0.25, 0.25, 1.5],
    cameraAngle: [QUARTER_PI, HALF_PI],
  },
  // TOP-FRONT-LEFT
  {
    position: [-0.876, -0.876, 0.876],
    size: [0.25, 0.25, 0.25],
    cameraAngle: [-3*QUARTER_PI, QUARTER_PI],
  },
  // TOP-FRONT-RIGHT
  {
    position: [0.876, -0.876, 0.876],
    size: [0.25, 0.25, 0.25],
    cameraAngle: [-QUARTER_PI, QUARTER_PI],
  },
  // TOP-BACK-LEFT
  {
    position: [-0.876, 0.876, 0.876],
    size: [0.25, 0.25, 0.25],
    cameraAngle: [3*QUARTER_PI, QUARTER_PI],
  },
  // TOP-BACK-RIGHT
  {
    position: [0.876, 0.876, 0.876],
    size: [0.25, 0.25, 0.25],
    cameraAngle: [QUARTER_PI, QUARTER_PI],
  },
  // BOTTOM-FRONT-LEFT
  {
    position: [-0.876, -0.876, -0.876],
    size: [0.25, 0.25, 0.25],
    cameraAngle: [-3*QUARTER_PI, 3*QUARTER_PI],
  },
  // BOTTOM-FRONT-RIGHT
  {
    position: [0.876, -0.876, -0.876],
    size: [0.25, 0.25, 0.25],
    cameraAngle: [-QUARTER_PI, 3*QUARTER_PI],
  },
  // BOTTOM-BACK-LEFT
  {
    position: [-0.876, 0.876, -0.876],
    size: [0.25, 0.25, 0.25],
    cameraAngle: [3*QUARTER_PI, 3*QUARTER_PI],
  },
  // BOTTOM-BACK-RIGHT
  {
    position: [0.876, 0.876, -0.876],
    size: [0.25, 0.25, 0.25],
    cameraAngle: [QUARTER_PI, 3*QUARTER_PI],
  },
];

export default class NavigationBox {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  private boxes: THREE.Group;

  constructor(container: HTMLElement) {
    this.container = container;

    this.setup();
  }

  private async setup() {
    const rendererParams = {
      alpha: true,
      antialias: true,
    };

    const renderer = new THREE.WebGLRenderer(rendererParams);
    renderer.setSize(WIDTH, HEIGHT);
    this.container.appendChild(renderer.domElement);
    this.renderer = renderer;

    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AmbientLight(0x888888));
    const spotLight = new THREE.SpotLight(0xeeeeee);
    spotLight.position.set(2, -4, 3);
    this.scene.add(spotLight);
    const spotLight2 = new THREE.SpotLight(0xdddddd);
    spotLight2.position.set(-8, 8, -6);
    this.scene.add(spotLight2);

    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshLambertMaterial({color: 0xcccccc});
    const cube = new THREE.Mesh(boxGeometry, material);
    this.scene.add(cube);

    this.boxes = new THREE.Group();
    clickBoxes.forEach(clickBox => {
      const geometry = new THREE.BoxGeometry(...clickBox.size);
      const material = new THREE.MeshBasicMaterial({
        color: 0x4dc3ff,
        transparent: true,
        opacity: 0,
      });
      const box = new THREE.Mesh(geometry, material);
      box.position.set(...clickBox.position);
      box.userData = clickBox.cameraAngle;
      this.boxes.add(box);
    });

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    this.camera.aspect = WIDTH / HEIGHT;
    this.camera.updateProjectionMatrix();
    this.camera.up.set(0, 0, 1);
    this.camera.lookAt(this.scene.position);

    this.renderer.render(this.scene, this.camera);
  }

  public updateCamera(x: number, y: number, z: number) {
    this.camera.position.set(x * 5, y * 5, z * 5);
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
  }
}
