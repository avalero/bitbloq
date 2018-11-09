/**
 * Copyright (c) 2018 Bitbloq (BQ)
 *
 * @license MIT
 *
 * long description for the file
 *
 * @summary short description for the file
 * @author David García <https://github.com/empoalp>
 * @author Alberto Valero <https://github.com/avalero>
 *
 * Created at     : 2018-09-14 10:49:04
 * Last modified  : 2018-11-09 09:57:33
 */

import React from 'react';
import {connect} from 'react-redux';
import * as Three from 'three';
import config from '../../config/threed';
import {selectObject, deselectAllObjects} from '../../actions/threed';
import {getObjects, getSelectedObjects} from '../../reducers/threed/';
import OrbitCamera from '../../lib/object3dts/OrbitCamera.ts';
import CompoundObject from '../../lib/object3dts/CompoundObject.ts';
import styled, {css} from 'react-emotion';
import TranslationHelper from '../../lib/object3dts/TranslationHelper';
import RotationHelper from '../../lib/object3dts/RotationHelper';
import ThreeDNavigationBox from './ThreeDNavigationBox';
import BaseGrid from '../../lib/object3dts/BaseGrid.ts'

const Wrap = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const Container = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const outlineMaterial = new Three.MeshBasicMaterial({
  color: 0x6a8d2f,
  side: Three.BackSide,
});

class ThreeDViewer extends React.Component {
  container = React.createRef();
  navigationBox = React.createRef();
  containerRect = {left: 0, top: 0, width: 0, height: 0};
  renderer = new Three.WebGLRenderer({antialias: true});
  scene = new Three.Scene();
  outlineGroup = new Three.Group();
  helpersGroup = new Three.Group();
  objectsGroup = new Three.Group();
  instances = {};
  meshes = {};
  activeHelper = null;
  raycaster = new Three.Raycaster();
  mousePosition = new Three.Vector2();
  state = {
    mouseDownObject: null,
    selectOnMouseUp: false,
  };

  componentDidUpdate(prevProps) {
    this.updateSceneObjects(prevProps.objects);
  }

  componentDidMount() {
    this.container.current.appendChild(this.renderer.domElement);

    this.setupScene();
    this.updateSize();
    this.updateSceneObjects();
    this.renderLoop();
  }

  createObjectInstance(objectDescription) {
    const {type, parameters} = objectDescription;
    const shape = config.shapes.find(s => s.name === type);
    let object;
    if (shape) {
      object = new shape.objectClass(parameters, []);
    } else {
      const composition = config.compositionOperations.find(
        c => c.name === type,
      );
      const {children = []} = parameters;
      object = new composition.objectClass(
        children.map(c => this.instances[c.id]),
        [],
      );
    }

    object.setColor(parameters.color);

    return object;
  }

  onMouseDown = e => {
    const object = this.getObjectFromPosition(e.clientX, e.clientY);
    this.setState({mouseDownObject: object, selectOnMouseUp: true});
  };

  onMouseMove = e => {
    const {selectOnMouseUp} = this.state;
    if (selectOnMouseUp) {
      this.setState({selectOnMouseUp: false});
    }
  };

  onMouseUp = e => {
    const {mouseDownObject, selectOnMouseUp} = this.state;
    const {
      selectObject,
      deselectAllObjects,
      controlPressed,
      shiftPressed,
    } = this.props;
    if (selectOnMouseUp) {
      if (mouseDownObject) {
        selectObject(mouseDownObject, controlPressed || shiftPressed);
      } else {
        deselectAllObjects();
      }
    }
  };

  onClick = e => {
    const {
      selectObject,
      deselectAllObjects,
      controlPressed,
      shiftPressed,
    } = this.props;
    const object = this.getObjectFromPosition(e.clientX, e.clientY);
    if (object) {
      selectObject(object, controlPressed || shiftPressed);
    } else {
      deselectAllObjects();
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
      return mesh.object;
    }
  };

  updateSceneObjects(prevObjects = []) {
    const {objects = [], selectedObjects = [], activeOperation} = this.props;

    prevObjects.forEach(prevObject => {
      const object = objects.find(o => o.id === prevObject.id);
      if (!object) {
        this.objectsGroup.remove(this.meshes[prevObject.id]);
        delete this.meshes[prevObject.id];
      }
    });

    /*while (this.outlineGroup.children.length > 0) {
      this.outlineGroup.remove(this.outlineGroup.children[0]);
    }*/

    let transparent = {opacity: 0.5, transparent: true, depthWrite: false};
    let opaque = {opacity: 1, transparent: false, depthWrite: true};
    objects.forEach(object => {
      const prevObject = prevObjects.find(o => o.id === object.id);
      let object3D;

      if (!prevObject) {
        object3D = this.createObjectInstance(object);
        this.instances[object.id] = object3D;
      } else {
        object3D = this.updateInstance(object);
        this.objectsGroup.remove(this.meshes[object.id]);
      }
      
      object3D.getMeshAsync().then( mesh => {
        mesh.object = object;
        this.meshes[object.id] = mesh;
        this.objectsGroup.add(mesh);
        if (selectedObjects.length > 0 && !selectedObjects.includes(object)) {
          const mesh = this.meshes[object.id];
          mesh.material.opacity = 0.5;
          mesh.material.transparent = true;
          mesh.material.depthWrite = false;
        } else {
          const mesh = this.meshes[object.id];
          mesh.material.opacity = 1;
          mesh.material.transparent = false;
          mesh.material.depthWrite = true;
        }
      }).catch(error => {
        console.log(error.message);
        throw error;
      });
    });

    this.helpersGroup.remove(this.activeHelper);
    if (activeOperation) {
      const mesh = this.meshes[activeOperation.object.id];
      if (mesh && activeOperation.type === 'translation') {
        const trHelper = new TranslationHelper(
          mesh,
          activeOperation.axis,
          activeOperation.relative,
        ).mesh;
        this.helpersGroup.add(trHelper);
        this.activeHelper = trHelper;
      }
      if (mesh && activeOperation.type === 'rotation') {
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

  updateInstance(object) {
    const object3D = this.instances[object.id];
    object3D.setColor(object.parameters.color);
    if (object3D instanceof CompoundObject) {
      object3D.setChildren(
        object.parameters.children.map(c => this.updateInstance(c)),
      );
    } else {
      object3D.setParameters(object.parameters);
    }
    object3D.setOperations(object.operations);
    return object3D;
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
    spotLight.position.set(80, -100, 60);
    this.scene.add(spotLight);

    //@David , esto debería ir en algún sitio de opciones de configuracion
    const gridConfig = {
      size: 200,
      smallGrid : {
        enabled:true,
        step: 2,
        color: 0xededed,
        lineWidth: 1,
      },
      bigGrid: {
        enabled:true,
        step: 10,
        color: 0xcdcdcd,
        lineWidth: 2
      },
      centerGrid: {
        enabled:true,
        color: 0x9a9a9a,
        lineWidth: 2
      },
      plane:{
        enabled:false,
        color: 0x98f5ff,
      },
    };

    const gridMesh = new BaseGrid(gridConfig).getMesh();
    this.scene.add(gridMesh);

    this.camera = new Three.PerspectiveCamera(50, 1, 0.1, 1000);
    this.camera.position.set(0, -150, 80);
    this.camera.up.set(0, 0, 1);
    this.camera.lookAt(this.scene.position);

    this.cameraControls = new OrbitCamera(
      this.camera,
      this.renderer.domElement,
    );

    this.updateNavigationBox();

    this.scene.add(this.outlineGroup);
    this.scene.add(this.objectsGroup);
    this.scene.add(this.helpersGroup);

    this.renderer.render(this.scene, this.camera);
  }

  updateNavigationBox() {
    const direction = new Three.Vector3();
    this.camera.getWorldDirection(direction);
    const {x, y, z} = direction;
    this.navigationBox.current.updateCamera(-x, -y, -z);
  }

  updateCameraAngle = (theta, phi) => {
    this.cameraControls.rotateTo(theta, phi, true);
  };

  renderLoop = () => {
    this.updateSize();
    const delta = this.clock.getDelta();
    const cameraNeedsUpdate = this.cameraControls.update(delta);

    if (cameraNeedsUpdate) {
      this.updateNavigationBox();
    }

    requestAnimationFrame(this.renderLoop);

    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return (
      <Wrap>
        <Container
          innerRef={this.container}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
        />
        <ThreeDNavigationBox
          ref={this.navigationBox}
          onChangeCameraAngle={this.updateCameraAngle}
        />
      </Wrap>
    );
  }
}

const mapStateToProps = ({ui, threed}) => ({
  objects: getObjects(threed),
  selectedObjects: getSelectedObjects(threed),
  activeOperation: threed.ui.activeOperation,
  controlPressed: ui.controlPressed,
  shiftPressed: ui.shiftPressed,
});

const mapDispatchToProps = {
  selectObject,
  deselectAllObjects,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ThreeDViewer);
