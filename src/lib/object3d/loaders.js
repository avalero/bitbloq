import * as Three from 'three';
import GLTF2Loader from 'three-gltf2-loader';

GLTF2Loader(Three);

export function loadGLTFFromUrl(url) {
  const loader = new Three.GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
}
