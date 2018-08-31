import Object3D from './Object3D';
import * as Three from 'three';

export default class Cube extends Object3D {

  static parameterTypes = [
    {
      name: 'width',
      label: 'Width',
      type: 'integer',
      defaultValue: 10
    },
    {
      name: 'height',
      label: 'Height',
      type: 'integer',
      defaultValue: 10
    },
    {
      name: 'depth',
      label: 'Depth',
      type: 'integer',
      defaultValue: 10
    },
  ]

  getGeometry() {
    const {width,height,depth} = this.parameters;
    return new Three.BoxGeometry(Number(width), Number(depth), Number(height));
  }
}
