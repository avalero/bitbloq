import React from 'react';
import styled from '@emotion/styled';
import {css} from '@emotion/core';
import * as Three from 'three';
import NavigationBoxModel from '../../assets/models/navigation_box.glb';
import {loadGLTFFromUrl} from '../../lib/object3dts/loaders';

const HALF_PI = Math.PI / 2;
const QUARTER_PI = Math.PI / 4;
const WIDTH = 150;
const HEIGHT = 150;

const Container = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: ${WIDTH}px;
  height: ${HEIGHT}px;

  ${props => props.hovering && css`
    cursor: pointer;
  `}
`;

const clickBoxes = [
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

class ThreeDNavigationBox extends React.Component {
  container = React.createRef();
  containerRect = {left: 0, top: 0, width: 0, height: 0};
  renderer = new Three.WebGLRenderer({alpha: true, antialias: true});
  scene = new Three.Scene();
  camera = new Three.PerspectiveCamera(50, 1, 0.1, 1000);
  raycaster = new Three.Raycaster();
  boxes = new Three.Group();
  mousePosition = new Three.Vector2();

  state = {
    hoverBox: null
  };

  componentDidMount() {
    this.containerRect = this.container.current.getBoundingClientRect();
    this.setupScene();
  }

  async setupScene() {
    this.scene.add(new Three.AmbientLight(0xeeeeee));

    clickBoxes.forEach(clickBox => {
      const geometry = new Three.BoxGeometry(...clickBox.size);
      const material = new Three.MeshBasicMaterial({
        color: 0x40a0f0,
        transparent: true,
        opacity: 0,
      });
      const box = new Three.Mesh(geometry, material);
      box.position.set(...clickBox.position);
      box.cameraAngle = clickBox.cameraAngle;
      this.boxes.add(box);
    });

    this.camera.aspect = WIDTH / HEIGHT;
    this.camera.updateProjectionMatrix();
    this.camera.up.set(0, 0, 1);
    this.camera.lookAt(this.scene.position);

    this.container.current.appendChild(this.renderer.domElement);
    this.renderer.setSize(WIDTH, HEIGHT);

    this.scene.add(this.boxes);

    const gltf = await loadGLTFFromUrl(NavigationBoxModel);
    gltf.scene.rotateX(HALF_PI);
    gltf.scene.rotateY(-HALF_PI);
    this.scene.add(gltf.scene);

    this.renderer.render(this.scene, this.camera);
  }

  updateCamera(x, y, z) {
    this.camera.position.set(x * 5, y * 5, z * 5);
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
  }

  onClick = e => {
    const {onChangeCameraAngle} = this.props;
    const box = this.getBoxFromPosition(e.clientX, e.clientY);
    if (box) {
      onChangeCameraAngle(...box.cameraAngle);
    }
  };

  onMouseMove = e => {
    const box = this.getBoxFromPosition(e.clientX, e.clientY);
    let needsRender = false;

    if (this.state.hoverBox) {
      this.state.hoverBox.material.opacity = 0;
      this.setState({ hoverBox: null });
      needsRender = true;
    }

    if (box) {
      box.material.opacity = 0.45;
      this.setState({ hoverBox: box });
      needsRender = true;
    }

    if (needsRender) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  getBoxFromPosition = (x, y) => {
    const {left, top, width, height} = this.containerRect;
    this.mousePosition.x = ((x - left) / width) * 2 - 1;
    this.mousePosition.y = -((y - top) / height) * 2 + 1;

    this.raycaster.setFromCamera(this.mousePosition, this.camera);
    const intersects = this.raycaster.intersectObjects(
      this.boxes.children,
      true,
    );
    if (intersects.length > 0) {
      return intersects[0].object;
    }
  };

  render() {
    return (
      <Container
        ref={this.container}
        onClick={this.onClick}
        onMouseMove={this.onMouseMove}
        hovering={this.state.hoverBox}
      />
    );
  }
}

export default ThreeDNavigationBox;
