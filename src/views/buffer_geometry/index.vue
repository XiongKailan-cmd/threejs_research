<template>
  <div ref="box">
  </div>
</template>

<script>
export default {
  name: '自定义几何体'
}
</script>
<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { onMounted, ref } from 'vue';

const box = ref(null);


onMounted(() => {
  geometry();
})

const geometry = () => {
  console.log(box.value);
  const domRect = box.value.getBoundingClientRect();
  const width = domRect.width;
  const height = window.innerHeight - domRect.top;

  const camera = new THREE.PerspectiveCamera(
    45,
    width/ height,
    0.1,
    1000
  )
  camera.position.set(5,1,1);
  camera.lookAt(0,0,0);
  

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  box.value.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const geometry = new THREE.BufferGeometry();
  // 定义每一个点的位置
  // const vertices = new Float32Array([
  //   -1, -1, 0,1,-1,0,1,1,0,1,1,0,-1,1,0,-1,-1,0
  // ]);
  // geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

  // 定义index集合
  const vertices = new Float32Array([
    -1, -1, 0,1,-1,0,1,1,0,-1,1,0,1,1,1
  ]);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  const indices = new Uint16Array([
    0,1,2,2,3,0,2,1,4,4,0,1,4,1,3,4,3,2
  ]);
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  
  // 定义材质
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, wireframe: true });
  // 定义网格
  const cube = new THREE.Mesh(geometry, material);

  new OrbitControls(camera, renderer.domElement);

  // 添加世界坐标辅助器
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  scene.add(cube);


  const animate = function () {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

  animate();
}

</script>

<style scoped>

</style>