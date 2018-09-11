import Object3D from './Object3D';
import * as Three from 'three';

export default class Prism extends Object3D {

  static typeName = 'Prism';

  static parameterTypes = [
    {
      name: 'sides',
      label: 'Number of sides',
      type: 'integer',
      defaultValue: 6,
    },
    {
      name: 'length',
      label: 'Length of sides',
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
    const {sides,length,height} = this.parameters;
    
    const radius =  length/(2*Math.sin(Math.PI/sides));
  
    const prism = new Three.CylinderGeometry(Number(radius), Number(radius), Number(height), Number(sides));
    

    
    //cylinder is rotated 90 degrees to face up throug Z axis
    return prism.rotateX(Math.PI/2);
  }
}
