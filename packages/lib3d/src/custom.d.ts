declare module "*.worker" {
  class WebpackWorker extends Worker {
    constructor();
  }
  export = WebpackWorker;
}

declare module "*.json" {
  const value: any;
  export default value;
}
