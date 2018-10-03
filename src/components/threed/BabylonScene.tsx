import * as BABYLON from 'babylonjs';
import * as React from 'react';
import BabylonThreeDViewer from './BabylonThreeDViewer';

export interface ISceneEventArgs {
  engine: BABYLON.Engine,
  scene: BABYLON.Scene,
  canvas: HTMLCanvasElement
};
 
export interface ISceneProps {
  engineOptions?: BABYLON.EngineOptions,
  adaptToDeviceRatio?: boolean,
  onSceneMount?: (args: ISceneEventArgs) => void,
  width?: number,
  height?: number
};

export default class Scene extends React.Component<ISceneProps & React.HTMLAttributes<HTMLCanvasElement>, {}> {

  private scene: BABYLON.Scene;
  private engine: BABYLON.Engine;
  private canvas: HTMLCanvasElement;

  public componentWillUnmount () {
     window.removeEventListener('resize', this.onResizeWindow);
  }
  
  public componentDidMount () {
    this.engine = new BABYLON.Engine(
        this.canvas,
        true,
        this.props.engineOptions,
        this.props.adaptToDeviceRatio
    );
    const scene = new BABYLON.Scene(this.engine);
    scene.clearColor = new BABYLON.Color3(1,1,1);
    this.scene = scene;

    if (typeof this.props.onSceneMount === 'function') {
      this.props.onSceneMount({
        canvas: this.canvas,
        engine: this.engine,
        scene
      });
    } else {
      throw new Error('onSceneMount function not available');
    }

    // Resize the babylon engine when the window is resized
    window.addEventListener('resize', this.onResizeWindow);
  }
  
  public render () {
    const { width, height } = this.props;
    const opts: any = {};

    if (width !== undefined && height !== undefined) {
      opts.width = width;
      opts.height = height;
    }

    return (
      <canvas
        {...opts}
        ref={this.onCanvasLoaded}
      />
    )
  }

  private onCanvasLoaded = (c : HTMLCanvasElement) => {
    if (c !== null) {
      this.canvas = c;
    }
  }

  private onResizeWindow = () => {
    if (this.engine) {
      this.engine.resize();
    }
  }
}