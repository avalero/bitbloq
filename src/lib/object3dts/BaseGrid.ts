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
 * Last modified  : 2018-11-07 10:44:28
 */


import * as THREE from 'three'
import cloneDeep from 'lodash.clonedeep';

export interface IGridConfig{
	size: number,
	smallGrid : {
		enabled:boolean,
		step: number,
		color: number,
		lineWidth: number
	},
	bigGrid: {
		enabled:boolean,
		step: number,
		color: number,
		lineWidth: number
	},
	plane:{
		enabled:boolean,
		color: number,
	}
}

export default class BaseGrid{
	private mesh: THREE.Group;
	private colorBig: THREE.Color;
	private colorSmall: THREE.Color;
	private gridConfig: IGridConfig;

  constructor(config: IGridConfig)
	{
		this.mesh = new THREE.Group();
		this.gridConfig = cloneDeep(config);
		this.colorBig = new THREE.Color(this.gridConfig.bigGrid.color);
		this.colorSmall = new THREE.Color(this.gridConfig.smallGrid.color);

		if(this.gridConfig.smallGrid.enabled) this.mesh.add(this.smallGrid());
		if(this.gridConfig.bigGrid.enabled) this.mesh.add(this.bigGrid());
		if(this.gridConfig.plane.enabled) this.mesh.add(this.plane());
	}

	private bigGrid():THREE.LineSegments{
		
		const halfSize = this.gridConfig.size / 2;

		const verticesBig: Array<number> = [];
		const colorsBig: Array<number> = [];
		
		for ( let jBig = 0, k = -halfSize; k <= halfSize; k += this.gridConfig.bigGrid.step ) {
			verticesBig.push(- halfSize, k, 0, halfSize, k, 0 );
			verticesBig.push( k, - halfSize, 0, k, halfSize, 0 );
			const color:THREE.Color = this.colorBig;
			color.toArray( colorsBig, jBig ); jBig += 3;
			color.toArray( colorsBig, jBig ); jBig += 3;
			color.toArray( colorsBig, jBig ); jBig += 3;
			color.toArray( colorsBig, jBig ); jBig += 3;
		
		}

		const geometryBig:THREE.BufferGeometry = new THREE.BufferGeometry();		
		geometryBig.addAttribute( 'position', new THREE.Float32BufferAttribute( verticesBig, 3 ) );
		geometryBig.addAttribute( 'color', new THREE.Float32BufferAttribute( colorsBig, 3 ) );

		const materialBig = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors, linewidth:this.gridConfig.bigGrid.lineWidth, fog:false } );

		const meshBig:THREE.LineSegments = new THREE.LineSegments(geometryBig, materialBig);
		return meshBig;
		
	}

	private smallGrid():THREE.LineSegments{
		const halfSize = this.gridConfig.size / 2;
		const verticesSmall: Array<number> = [];
		const colorsSmall: Array<number> = [];

		for ( let jSmall = 0, k = -halfSize; k <= halfSize; k += this.gridConfig.smallGrid.step ) {
			verticesSmall.push(- halfSize, k, 0, halfSize, k, 0 );
			verticesSmall.push( k, - halfSize, 0, k, halfSize, 0 );
			const color:THREE.Color = this.colorSmall;	
			color.toArray( colorsSmall, jSmall ); jSmall += 3;
			color.toArray( colorsSmall, jSmall ); jSmall += 3;
			color.toArray( colorsSmall, jSmall ); jSmall += 3;
			color.toArray( colorsSmall, jSmall ); jSmall += 3;
		}
	
		const geometrySmall:THREE.BufferGeometry = new THREE.BufferGeometry();
		geometrySmall.addAttribute( 'position', new THREE.Float32BufferAttribute( verticesSmall, 3 ) );
		geometrySmall.addAttribute( 'color', new THREE.Float32BufferAttribute( colorsSmall, 3 ) );
		
		const materialSmall = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors, linewidth:this.gridConfig.smallGrid.lineWidth, fog:false } );
		const meshSmall: THREE.LineSegments = new THREE.LineSegments(geometrySmall, materialSmall);

		return meshSmall;
	}

	private plane():THREE.PlaneHelper{
		const plane:THREE.Plane = new THREE.Plane(new THREE.Vector3(0, 0, 1));
    const helper:THREE.PlaneHelper = new THREE.PlaneHelper(plane, this.gridConfig.size, this.gridConfig.plane.color);
    return helper;
	}
	
	public getMesh():THREE.Group{
		return this.mesh;
	}
}
