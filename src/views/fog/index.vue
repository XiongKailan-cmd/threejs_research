<template>
  <div id="box" ref="box">
  </div>
</template>

<script>
export default {
  name: "雾Fog"
}
</script>
<script setup >
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { onMounted, ref } from 'vue';

const box = ref(null)

onMounted(() => {
  init();
})

const init = () => {

  const rect = box.value.getBoundingClientRect();
  const width = rect.width;
  const height = window.innerHeight - rect.top;

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(1,1, 5);
  camera.lookAt(0,0,0);

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)
  box.value.appendChild(renderer.domElement)

  const cuboid = new THREE.BoxGeometry(1, 1, 100);
  const material = new THREE.MeshBasicMaterial({ 
    color: 0x00ff00,
    transparent: true,
  });
  const cube = new THREE.Mesh(cuboid, material);
  scene.add(cube);

  // 线性雾
  const fog  = new THREE.Fog(0xCCCCCC, 0.1, 50);
  scene.fog = fog;

  // 指数雾
  // const fogExp  = new THREE.FogExp2(0xCCCCCC, 0.1);
  // scene.fog = fogExp;

  scene.background = new THREE.Color(0xCCCCCC);

  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.update()

  const animate = function () {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }

  animate()
}

</script>

<style lang="scss" scoped>

</style>