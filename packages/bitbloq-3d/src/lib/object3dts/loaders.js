import 'three';
import 'three/GLTFLoader';
/* global THREE */

export default function loadGLTFFromUrl(url) {
  const loader = new THREE.GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
}
