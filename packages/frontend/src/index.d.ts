declare module "*.svg";
declare module "*.yml";
declare module "*.json";
declare module "*.stl";
declare module "*.png";
declare module "*.mp3";
declare module "*.html";
declare module "*.zip";
declare module "worker-loader?name=static/[hash].worker.js!./compound.worker";
declare module "worker-loader?name=service-worker.js!../service-worker/index.ts";

interface Window {
  gtag: any;
}
