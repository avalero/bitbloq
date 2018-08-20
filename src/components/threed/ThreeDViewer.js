import React from 'react';
import {connect} from 'react-redux';
import * as Three from 'three';
import {resolveClass} from '../../lib/object3d';
import styled from 'react-emotion';

const Container = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

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
    while(this.objectsGroup.children.length > 0) {
      this.objectsGroup.remove(this.objectsGroup.children[0]);
    }
  }

  updateSceneObjects() {
    const {objects = []} = this.props;

    this.clearObjects();

    objects.forEach(object => {
      const Class3D = resolveClass(object.type);
      const object3D = new Class3D(object.params);
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

    const spotLight = new Three.SpotLight(0xffffff);
    spotLight.position.set(0, -100, 100);
    this.scene.add(spotLight);

    const grid = new Three.GridHelper(200, 20);
    grid.geometry.rotateX(Math.PI / 2);
    this.scene.add(grid);

    this.camera = new Three.PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.set(0, -50, 50);
    this.camera.lookAt(new Three.Vector3(0, 0, 0));

    this.scene.add(this.objectsGroup);

    this.renderer.render(this.scene, this.camera);
  }

  renderLoop = () => {
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
