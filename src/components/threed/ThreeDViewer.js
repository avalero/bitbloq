import React from 'react';
import {connect} from 'react-redux';
import * as Three from 'three';
import styled from 'react-emotion';

const Container = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const geometryBuilders = {
  Cube: ({params: {width, height, depth}}) =>
    new Three.BoxGeometry(1, 1, 1),
  Sphere: ({params: {radius}}) => new Three.SphereGeometry(radius, 32, 32),
};

class ThreeDViewer extends React.Component {
  sceneObjects = {};
  container = React.createRef();
  renderer = new Three.WebGLRenderer({antialias: true});
  scene = new Three.Scene();

  addObjectToScene(object) {
    switch (object.type) {
      case 'Cube':
      case 'Sphere':
        const geometryBuilder = geometryBuilders[object.type];
        const geometry = geometryBuilder(object);
        const material = new Three.MeshLambertMaterial({color: 0xff0000});
        const mesh = new Three.Mesh(geometry, material);
        this.scene.add(mesh);
        this.sceneObjects[object.id] = mesh;
        return mesh;

      case 'Translate':
        const group = new Three.Group();
        return group;
    }
  }

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

  updateSceneObjects() {
    const {objects = []} = this.props;
    const {sceneObjects} = this;

    objects.forEach(object => {
      let sceneObject = sceneObjects[object.id];
      if (!sceneObject) {
        sceneObject = this.addObjectToScene(object);
      }
      if (object.type === 'Cube') {
        const {width = 1, height = 1, depth = 1} = object.params;
        sceneObject.scale.set(width, height, depth);
      }
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
