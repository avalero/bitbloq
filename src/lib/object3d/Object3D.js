import * as Three from 'three';
import uuid from 'uuid/v1';

export default class Object3D {

  static parameterTypes = [];

  static createTranslateOperation(x, y, z, relative = true) {
    return {
      type: 'translation',
      x,
      y,
      z,
      relative
    };

    

  }

  static createRotateOperation(axis, angle, relative = true) {
    return {
      type: 'rotation',
      axis,
      angle,
      relative
    };
  }

  static createScaleOperation(width, height, depth) {
    return {
      type: 'scale',
      width,
      height,
      depth
    };
  }

  static createFromJSON(json) {
    const {name, parameters, operations, id} = json;
    return new this(name, parameters, operations, id);
  }

  id = '';
  name = '';
  parameters = {};
  operations = [];
  
  constructor(name, parameters = {}, operations = [], id) {
    const defaultParams = {};
    this.constructor.parameterTypes.forEach(paramType => {
      defaultParams[paramType.name] = paramType.defaultValue;
    });

    this.parameters = {
      ...defaultParams,
      ...parameters
    };

    this.operations = operations;
    this.id = id || uuid();
    this.name = name;
  }

  addOperation(operation) {
    this.operations.push(operation);
  }

  locateMesh(mesh){
    if(this.operations){
      this.operations.forEach( operation => 
        {
          // Translate operation
          if(operation.type === Object3D.createTranslateOperation().type){
            if(operation.relative){
              mesh.translateX(operation.x);
              mesh.translateY(operation.y);
              mesh.translateZ(operation.z);
            }else{
              //absolute x,y,z axis.
              mesh.position.x += Number(operation.x);
              mesh.position.y += Number(operation.y);
              mesh.position.z += Number(operation.z);
            }
            //Rotation Operation
          }else if(operation.type === Object3D.createRotateOperation().type){
            const angle = Three.Math.degToRad(Number(operation.angle));
            switch(operation.axis){
              case 'x':
                if(operation.relative){
                  mesh.rotateX(angle);
                }else{
                  mesh.rotateOnWorldAxis(new Three.Vector3(1,0,0), angle);
                }
                break;
                
              case 'y':
                if(operation.relative){
                  mesh.rotateY(angle);
                }else{
                  mesh.rotateOnWorldAxis(new Three.Vector3(0,1,0), angle);
                }
                break;

              case 'z':
                if(operation.relative){
                  mesh.rotateZ(angle);
                }else{
                  mesh.rotateOnWorldAxis(new Three.Vector3(0,0,1), angle);
                }
                break;
              
              default:
                throw new Error('Unexpected Rotation Axis');
            }
          }

        });
    }
  }

  getMesh() {
    const geometry = this.getGeometry();
    const material = new Three.MeshLambertMaterial({color: 0xff0000});
    const mesh = new Three.Mesh(geometry, material);

    this.locateMesh(mesh);

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
      type: constructor.name,
      parameters,
      operations
    };
  }
}
