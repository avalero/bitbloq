import React from 'react';
import {connect} from 'react-redux';
import * as Three from 'three';
import CameraControls from 'camera-controls';
import {createFromJSON} from '../../lib/object3d';
import styled from 'react-emotion';

const Container = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

CameraControls.install( { THREE: Three } );

class ThreeDViewer extends React.Component {
  container = React.createRef();
  renderer = new Three.WebGLRenderer({antialias: true});
  scene = new Three.Scene();
  objectsGroup = new Three.Group();

  componentDidUpdate() {
    this.updateSceneObjects();
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

  clearObjects() {
    while (this.objectsGroup.children.length > 0) {
      this.objectsGroup.remove(this.objectsGroup.children[0]);
    }
  }

  updateSceneObjects() {
    const {objects = []} = this.props;

    this.clearObjects();

    objects.forEach(object => {
      const object3D = createFromJSON(object);
      const mesh = object3D.getMesh();
      this.objectsGroup.add(mesh);
    });
  }

  updateSize() {
    const {width, height} = this.container.current.getBoundingClientRect();
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
    this.camera.position.set(0, -200, 180);
    this.camera.lookAt(this.scene.position);

    this.cameraControls = new CameraControls(
      this.camera,
      this.renderer.domElement,
    );

    this.scene.add(this.objectsGroup);

    this.renderer.render(this.scene, this.camera);
  }

  renderLoop = () => {
    const delta = this.clock.getDelta();
    this.cameraControls.update(delta);

    requestAnimationFrame(this.renderLoop);

    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return <Container innerRef={this.container} />;
  }
}

const mapStateToProps = ({threed}) => ({
  objects: threed.objects,
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ThreeDViewer);
