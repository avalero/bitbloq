/**
 * Copyright (c) 2018 Bitbloq (BQ)
 *
 * License: MIT
 *
 * long description for the file
 * 
 * Derived from THREE.GridHelper
 *
 * @summary short description for the file
 * @author David García <https://github.com/empoalp>, Alberto Valero <https://github.com/avalero>
 *
 * Created at     : 2018-11-06 10:52:42 
 * Last modified  : 2018-11-06 12:14:27
 */


import * as THREE from 'three'

export default class BaseGrid{
  private mesh: THREE.LineSegments;

  constructor(_size: number = 10, _divisions: number = 10, _subdivisions: number = 10, _color1:number = 0x444444, _color2: number = 0x111111, _color3: number = 0xCCCCCC){
		const size = _size;
		const divisions = _divisions;
		const subdivisions = _subdivisions;
		const color1 = new THREE.Color(_color1);
		const color2 = new THREE.Color(_color2);
		const color3 = new THREE.Color(_color3);

		const center = divisions / 2;
		const step = size / (divisions * subdivisions);
		const halfSize = size / 2;

		const vertices: Array<number> = [];
		const colors: Array<number> = [];

		for ( let i = 0, j = 0, k = - halfSize; i <= divisions*subdivisions; i ++, k += step ) {

			vertices.push(- halfSize, 0, k, halfSize, 0, k );
			vertices.push( k, 0, - halfSize, k, 0, halfSize );
			debugger;
			let kaux: number = k % subdivisions;
			const color:THREE.Color = kaux === 0 ? color2: color3;
			//const color:THREE.Color = i === center ? color1 : color3;
	
			color.toArray( colors, j ); j += 3;
			color.toArray( colors, j ); j += 3;
			color.toArray( colors, j ); j += 3;
			color.toArray( colors, j ); j += 3;
	
		}
	
		const geometry:THREE.BufferGeometry = new THREE.BufferGeometry();
		geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
		geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
	
		const material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );
	
		this.mesh = new THREE.LineSegments(geometry, material);
	}
	
	public getMesh():THREE.LineSegments{
		return this.mesh;
	}
}
