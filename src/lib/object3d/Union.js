import Object3D from './Object3D';

export default class Union extends Object3D {

  children = [];

  constructor(params) {
    super(params);

    this.children = params.children;
  }

  getGeometry() {
    // TODO
    return null;
  }
}
