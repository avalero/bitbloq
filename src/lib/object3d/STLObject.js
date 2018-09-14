/**
 * Copyright (c) 2018 Bitbloq (BQ)
 *
 * @license MIT
 *
 * STL Object
 *
 * @summary STLObject Class.
 * @author David García <https://github.com/empoalp>
 * @author Alberto Valero <https://github.com/avalero>
 *
 * Created at     : 2018-09-14 10:48:00 
 * Last modified  : 2018-09-14 10:52:15
 */



import Object3D from './Object3D';
import * as Three from 'three';
var STLLoader = require('three-stl-loader')(Three)

var loader = new STLLoader()

export default class STLObject extends Object3D {

  static typeName = 'STLObject';

  static parameterTypes = [
    {
      name: 'geometry',
      label: 'Import STL', 
      type: 'file',
      defaultValue: '/',
    },
  ];

  getGeometry() {
     const {geometry} = this.parameters;

    // try{
    //   loader.load(filename, geom => {
    //     geometry = geom;
    //   } );
    // }catch(error){
    //   throw `Error: Cannot load STL file: ${error}`;
    // }

    return geometry;

  }
}
