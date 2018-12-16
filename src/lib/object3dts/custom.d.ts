declare module "*.worker" {
  class WebpackWorker extends Worker {
    constructor();
  }
  export = WebpackWorker;
}
