import * as Three from 'three';
import uuid from 'uuid/v1';

export default class Object3D {
  static parameterTypes = [];

  static createTranslateOperation(x, y, z, relative = true) {
    return {
      id: uuid(),
      type: 'translation',
      x,
      y,
      z,
      relative,
    };
  }

  static createRotateOperation(axis, angle, relative = true) {
    return {
      id: uuid(),
      type: 'rotation',
      axis,
      angle,
      relative,
    };
  }

  static createScaleOperation(x, y, z) {
    return {
      id: uuid(),
      type: 'scale',
      x,
      y,
      z,
    };
  }

  static createFromJSON(json) {
    const {name, parameters, operations, id} = json;
    return new this(name, parameters, operations, id);
  }

  static colors = [
    0xff6900,
    0xfcb900,
    0x7bdcb5,
    0x00d084,
    0x8ed1fc,
    0x0693e3,
    0xabb8c3,
    0xeb144c,
    0xf78da7,
    0x9900ef,
  ];

  id = '';
  name = '';
  parameters = {};
  operations = [];

  constructor(name, parameters = {}, operations = [], id) {
    const defaultParams = {};
    this.constructor.parameterTypes.forEach(paramType => {
      defaultParams[paramType.name] = paramType.defaultValue;
    });

    //select random color
    const color_i = Math.floor(Math.random() * Object3D.colors.length);

    this.parameters = {
      ...defaultParams,
      color: Object3D.colors[color_i],
      ...parameters,
    };

    this.operations = operations;
    this.id = id || uuid();
    this.name = name;
  }

  addOperation(operation) {
    this.operations.push(operation);
  }

  applyOperations(mesh) {
    if (this.operations) {
      this.operations.forEach(operation => {
        // Translate operation
        if (operation.type === Object3D.createTranslateOperation().type) {
          if (operation.relative) {
            mesh.translateX(operation.x);
            mesh.translateY(operation.y);
            mesh.translateZ(operation.z);
          } else {
            //absolute x,y,z axis.
            mesh.position.x += Number(operation.x);
            mesh.position.y += Number(operation.y);
            mesh.position.z += Number(operation.z);
          }
          //Rotation Operation
        } else if (operation.type === Object3D.createRotateOperation().type) {
          const angle = Three.Math.degToRad(Number(operation.angle));
          switch (operation.axis) {
            case 'x':
              if (operation.relative) {
                mesh.rotateX(angle);
              } else {
                mesh.rotateOnWorldAxis(new Three.Vector3(1, 0, 0), angle);
              }
              break;

            case 'y':
              if (operation.relative) {
                mesh.rotateY(angle);
              } else {
                mesh.rotateOnWorldAxis(new Three.Vector3(0, 1, 0), angle);
              }
              break;

            case 'z':
              if (operation.relative) {
                mesh.rotateZ(angle);
              } else {
                mesh.rotateOnWorldAxis(new Three.Vector3(0, 0, 1), angle);
              }
              break;

            default:
              throw new Error('Unexpected Rotation Axis');
          }
        } else if (operation.type === Object3D.createScaleOperation().type) {
          if (
            Number(operation.x) > 0 &&
            Number(operation.y) > 0 &&
            Number(operation.z) > 0
          )
            mesh.scale.set(
              mesh.scale.x * Number(operation.x),
              mesh.scale.y * Number(operation.y),
              mesh.scale.z * Number(operation.z),
            );
        }
      });
    }
  }

  getMaterial() {
    return new Three.MeshLambertMaterial({
      color: this.parameters.color || Object3D.colors[0]
    });
  }

  getMesh() {
    const geometry = this.getGeometry();

    const mesh = new Three.Mesh(geometry, this.getMaterial());

    this.applyOperations(mesh);

    return mesh;
  }

  getGeometry() {
    throw new Error('Method not implemented');
  }

  toJSON() {
    const {id, name, parameters, operations, constructor} = this;
    return {
      id,
      name,
      type: constructor.typeName,
      parameters,
      operations,
    };
  }
}
