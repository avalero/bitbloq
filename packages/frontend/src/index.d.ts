declare module "*.svg";
declare module "*.json";
declare module "*.stl";
declare module "*.png";
declare module "*.mp3";
declare module "worker-loader?name=static/[hash].worker.js!./compound.worker";
declare module "worker-loader?name=service-worker.js!../service-worker/index.ts";
