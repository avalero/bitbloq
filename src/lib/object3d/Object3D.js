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

  static colors = [
    0xFF0000,
    0x800000,
    0xFFFF00,
    0x808000,
    0x00FF00,
    0x008000,
    0x00FFFF,
    0x008080,
    0x0000FF,
    0x000080,
    0xFF00FF,
    0x800080
  ]

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
      ...parameters
    };

    this.operations = operations;
    this.id = id || uuid();
    this.name = name;
  }

  addOperation(operation) {
    this.operations.push(operation);
  }

  applyOperations(mesh){
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
          }else if(operation.type === Object3D.createScaleOperation().type){
            if(Number(operation.width)>0 && Number(operation.depth)> 0 && Number(operation.height) >0)
              mesh.scale.set(Number(operation.width), Number(operation.depth), Number(operation.height));
    
          }


        });
    }  }

  getMesh() {
    const geometry = this.getGeometry();
    const material = new Three.MeshLambertMaterial({color: this.parameters.color || 0xff0000});
    const mesh = new Three.Mesh(geometry, material);

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
      type: constructor.name,
      parameters,
      operations
    };
  }
}
