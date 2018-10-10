import Object3D from './Object3D';

export default class CompoundObject extends Object3D {

  children = [];

  constructor(name, parameters, operations, id){

    super(name, parameters, operations, id);

    this.children = parameters.children;
  }

  toJSON() {
    const base = super.toJSON();
    return {
      ...base,
      parameters: {
        ...base.parameters,
        children: this.children.map(child => child.toJSON())
      }
    };
  }
}
