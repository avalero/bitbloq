import * as BABYLON from 'babylonjs';
import * as React from 'react';
import BabylonScene, {ISceneEventArgs} from './BabylonScene.tsx'; // import the component above linking to file we just created.

import Cube from '../../lib/object3dts/Cube.ts';
import OrbitCamera from '../../lib/object3dts/OrbitCamera.ts';

export default class BabylonThreeDViewer extends React.Component<{}, {}> {
    

    public onSceneMount = (e: ISceneEventArgs) => {
        const { canvas, scene, engine } = e;

        const instrumentation: BABYLON.SceneInstrumentation = new BABYLON.SceneInstrumentation(scene);
        instrumentation.captureCameraRenderTime = true;

        // This creates and positions a free camera (non-mesh)
        // const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
        //const camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(200, 0, 100), scene);
        const camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI/4 , 100, new BABYLON.Vector3(0, 0, 0), scene);
        
        camera.upVector = new BABYLON.Vector3(0,0,1);

        // This targets the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        const cameraControls:OrbitCamera = new OrbitCamera(
            camera,
            canvas
          );

        // This attaches the camera to the canvas
        //camera.attachControl(canvas, true);

        //camera.setPosition(new BABYLON.Vector3(20, 150, -15));

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const hemiLight: BABYLON.HemisphericLight  = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);
        // Default intensity is 1. Let's dim the light a small amount
        hemiLight.intensity = 0.7;

        const pointLight:BABYLON.PointLight  = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(10, 0, 100), scene); 

        // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
        
        new Cube(scene, 
            {width:10, height:10, depth:10, name:'myCube'},
            [{type:'translation',x:15,y:0,z:0,relative:false}]);
            new Cube(scene, 
                {width:10, height:10, depth:10, name:'myCub2'},
                [{type:'translation',x:0,y:0,z:0,relative:false}]);
        //new Sphere({radius:7, name:'mySphere'}).getMesh(scene);
        //new Cylinder({radius_bottom:5, radius_top:5, height:10}).getMesh(scene);
        // console.log(cube);
        // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
        //const ground = BABYLON.MeshBuilder.CreateGround("myGround", {width: 100, height: 100}, scene);

        const groundMaterial:BABYLON.StandardMaterial = new BABYLON.StandardMaterial('groundMaterial', scene);
        groundMaterial.emissiveColor = new BABYLON.Color3(0,0,1);
        groundMaterial.alpha = 0.5;
        groundMaterial.wireframe = true;

        const groundXY: BABYLON.Mesh = BABYLON.Mesh.CreateGround("groundXY", 100,
			100, 2, scene);
	    groundXY.material = groundMaterial;
	    groundXY.rotation.x = -Math.PI / 2;

        

        engine.runRenderLoop(() => {
            if (scene) {
                scene.render();
                const delta = instrumentation.cameraRenderTimeCounter;
                cameraControls.update(delta);
            }
        });
    }

    public render() {        
        return (
            <div>
                <BabylonScene adaptToDeviceRatio={true} width={800} height={600} onSceneMount={this.onSceneMount} />
            </div>
        )
    }
}