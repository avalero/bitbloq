import React from 'react';
import {connect} from 'react-redux';
import * as Three from 'three';
import {selectObject} from '../../actions/threed';
//import CameraControls from 'camera-controls';
import OrbitCamera from '../../lib/object3d/OrbitCamera'
import {createFromJSON} from '../../lib/object3d';
import styled from 'react-emotion';
import TranslationHelper from '../../lib/object3d/TranslationHelper';
import RotationHelper from '../../lib/object3d/RotationHelper';

const Container = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

//CameraControls.install({THREE: Three});

class ThreeDViewer extends React.Component {
  container = React.createRef();
  containerRect = {left: 0, top: 0, width: 0, height: 0};
  renderer = new Three.WebGLRenderer({antialias: true});
  scene = new Three.Scene();
  helpersGroup = new Three.Group();
  objectsGroup = new Three.Group();
  instances = {};
  meshes = {};
  activeHelper = null;
  raycaster = new Three.Raycaster();
  mousePosition = new Three.Vector2();

  componentDidUpdate(prevProps) {
    this.updateSceneObjects(prevProps.objects);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize);

    this.container.current.appendChild(this.renderer.domElement);

    this.setupScene();
    this.updateSize();
    this.updateSceneObjects();
    this.renderLoop();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize = () => {
    this.updateSize();
  };

  onClick = e => {
    const {selectObject, controlPressed, shiftPressed} = this.props;
    const object = this.getObjectFromPosition(e.clientX, e.clientY);
    if (object) {
      selectObject(object, controlPressed || shiftPressed);
    }
  };

  getObjectFromPosition = (x, y) => {
    const {left, top, width, height} = this.containerRect;
    this.mousePosition.x = ((x - left) / width) * 2 - 1;
    this.mousePosition.y = -((y - top) / height) * 2 + 1;

    this.raycaster.setFromCamera(this.mousePosition, this.camera);
    const intersects = this.raycaster.intersectObjects(
      this.objectsGroup.children,
      true,
    );

    if (intersects.length > 0) {
      const mesh = intersects[0].object;
      if (mesh.objectID) {
        return this.instances[mesh.objectID];
      }
    }
  };

  updateSceneObjects(prevObjects = []) {
    const {objects = [], activeOperation} = this.props;

    prevObjects.forEach(prevObject => {
      if (!objects.includes(prevObject)) {
        this.objectsGroup.remove(this.meshes[prevObject.id]);
        delete this.instances[prevObject.id];
        delete this.meshes[prevObject.id];
      }
    });

    objects.forEach(object => {
      if (!prevObjects.includes(object)) {
        const object3D = createFromJSON(object);
        const mesh = object3D.getMesh();
        mesh.objectID = object.id;
        this.instances[object.id] = object3D;
        this.meshes[object.id] = mesh;
        this.objectsGroup.add(mesh);
      }
    });

    this.helpersGroup.remove(this.activeHelper);
    if (activeOperation) {
      const mesh = this.meshes[activeOperation.object.id];
      if (activeOperation.type === 'translation') {
        const trHelper = new TranslationHelper(
          mesh,
          activeOperation.axis,
          activeOperation.relative,
        ).mesh;
        this.helpersGroup.add(trHelper);
        this.activeHelper = trHelper;
      }
      if (activeOperation.type === 'rotation') {
        const rotHelper = new RotationHelper(
          mesh,
          activeOperation.axis,
          activeOperation.relative,
        ).mesh;
        this.helpersGroup.add(rotHelper);
        this.activeHelper = rotHelper;
      }
    }
  }

  updateSize() {
    const containerRect = this.container.current.getBoundingClientRect();
    const {width, height} = containerRect;
    this.containerRect = containerRect;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  setupScene() {
    this.renderer.setClearColor(0xfafafa);

    this.clock = new Three.Clock();

    this.scene.add(new Three.AmbientLight(0x555555));
    const spotLight = new Three.SpotLight(0xeeeeee);
    spotLight.position.set(100, 80, 60);
    this.scene.add(spotLight);

    //const grid = new Three.GridHelper(200, 20);
    //this.scene.add(grid);

    const plane = new Three.Plane(new Three.Vector3(0, 0, 1));
    const helper = new Three.PlaneHelper(plane, 200, 0x98f5ff);
    this.scene.add(helper);

    const grid = new Three.GridHelper(200, 20);
    grid.geometry.rotateX(Math.PI / 2);
    this.scene.add(grid);

    this.camera = new Three.PerspectiveCamera(50, 1, 0.1, 1000);
    this.camera.position.set(0, -150, 80);
    this.camera.up.set(0,0,1);
    this.camera.lookAt(this.scene.position);

    this.cameraControls = new OrbitCamera(
      this.camera,
      this.renderer.domElement,
    );

    this.scene.add(this.objectsGroup);
    this.scene.add(this.helpersGroup);

    this.renderer.render(this.scene, this.camera);
  }

  renderLoop = () => {
    const delta = this.clock.getDelta();
    this.cameraControls.update(delta);

    requestAnimationFrame(this.renderLoop);

    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return <Container innerRef={this.container} onClick={this.onClick} />;
  }
}

const mapStateToProps = ({ui, threed}) => ({
  objects: threed.objects,
  activeOperation: threed.activeOperation,
  controlPressed: ui.controlPressed,
  shiftPressed: ui.shiftPressed,
});

const mapDispatchToProps = {
  selectObject,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ThreeDViewer);
