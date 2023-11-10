<template>
  <div ref="box" ></div>
</template>

<script setup>
import * as THREE from 'three';
import { onMounted, ref } from 'vue';

const box = ref(null);

onMounted(() => {
  exmple()
})

const exmple = () => {

  const domRect = box.value.getBoundingClientRect();

  const width = domRect.width;
  const height = window.innerHeight - domRect.top;



  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    45,
    width / height,
    0.1,
    1000
  )

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  box.value.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry(1,1,1);
  const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const animate = function () {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  };

  camera.position.z = 6;
  camera.lookAt(0,0,0)

  animate()
}



</script>

<style scoped>

</style>