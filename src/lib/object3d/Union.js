import CompoundObject from './CompoundObject';

export default class Union extends CompoundObject {
  getGeometry() {
    // TODO: just return first object for now
    return this.children[0].getGeometry();
  }
}
