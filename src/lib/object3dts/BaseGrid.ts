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
 * Last modified  : 2018-11-07 09:18:05
 */


import * as THREE from 'three'

export default class BaseGrid{
  private mesh: THREE.Group;

  constructor(
		size: number = 200,
		step: number = 10, 
		substep: number = 1, 
		_colorBig:number = 0xcdcdcd, 
		_colorSmall: number = 0xcdcdcd, 
		lineWidthBig: number = 2, 
		lineWidthSmall: number = 1
		)
	{
		this.mesh = new THREE.Group();
		
		const colorBig = new THREE.Color(_colorBig);
		const colorSmall = new THREE.Color(_colorSmall);

		const halfSize = size / 2;

		const verticesBig: Array<number> = [];
		const verticesSmall: Array<number> = [];
		const colorsBig: Array<number> = [];
		const colorsSmall: Array<number> = [];

		for ( let jBig = 0, jSmall = 0, k = -halfSize; k <= halfSize; k += substep ) {
			const kaux: number = k % step;
			if (Math.abs(kaux) < 1){
				verticesBig.push(- halfSize, 0, k, halfSize, 0, k );
				verticesBig.push( k, 0, - halfSize, k, 0, halfSize );
				const color:THREE.Color = colorSmall;
				color.toArray( colorsBig, jBig ); jBig += 3;
				color.toArray( colorsBig, jBig ); jBig += 3;
				color.toArray( colorsBig, jBig ); jBig += 3;
				color.toArray( colorsBig, jBig ); jBig += 3;
			}else{
				verticesSmall.push(- halfSize, 0, k, halfSize, 0, k );
				verticesSmall.push( k, 0, - halfSize, k, 0, halfSize );
				const color:THREE.Color = colorBig;	
				color.toArray( colorsSmall, jSmall ); jSmall += 3;
				color.toArray( colorsSmall, jSmall ); jSmall += 3;
				color.toArray( colorsSmall, jSmall ); jSmall += 3;
				color.toArray( colorsSmall, jSmall ); jSmall += 3;
			}
		}
	
		const geometryBig:THREE.BufferGeometry = new THREE.BufferGeometry();
		const geometrySmall:THREE.BufferGeometry = new THREE.BufferGeometry();
		
		geometryBig.addAttribute( 'position', new THREE.Float32BufferAttribute( verticesBig, 3 ) );
		geometryBig.addAttribute( 'color', new THREE.Float32BufferAttribute( colorsBig, 3 ) );

		geometrySmall.addAttribute( 'position', new THREE.Float32BufferAttribute( verticesSmall, 3 ) );
		geometrySmall.addAttribute( 'color', new THREE.Float32BufferAttribute( colorsSmall, 3 ) );
	
		const materialBig = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors, linewidth:lineWidthBig, fog:false } );
		const materialSmall = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors, linewidth:lineWidthSmall, fog:false } );
	
		const meshBig:THREE.LineSegments = new THREE.LineSegments(geometryBig, materialBig);
		const meshSmall: THREE.LineSegments = new THREE.LineSegments(geometrySmall, materialSmall);

		this.mesh.add(meshBig);
		this.mesh.add(meshSmall);
	}
	
	public getMesh():THREE.Group{
		return this.mesh;
	}
}
