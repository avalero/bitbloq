import Object3D from './Object3D';
import * as Three from 'three';

export default class Cylinder extends Object3D {

  static typeName = 'Cylinder';

  static parameterTypes = [
    {
      name: 'r0',
      label: 'Bottom Radius',
      type: 'integer',
      defaultValue: 5,
    },
    {
      name: 'r1',
      label: 'Top Radius',
      type: 'integer',
      defaultValue: 5,
    },
    {
      name: 'height',
      label: 'Height',
      type: 'integer',
      defaultValue: 10,
    },
  ]

  getGeometry() {
    const {r0,r1,height} = this.parameters;
    const cyl = new Three.CylinderGeometry(Number(r1), Number(r0), Number(height), 32, 1);
    console.log(this.parameters);
    
    //cylinder is rotated 90 degrees to face up throug Z axis
    return cyl.rotateX(Math.PI/2);
  }
}
