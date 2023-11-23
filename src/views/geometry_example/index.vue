<template>
  <div id="box" ref="box">
  </div>
</template>

<script>
export default {
  name: "基础材质"
}
</script>
<script setup >
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { onMounted, ref } from 'vue';

const box  = ref(null)

onMounted(() => {
  baseMaterail()
})

const baseMaterail = () =>{
  console.log(box.value);
  const domRect = box.value.getBoundingClientRect()
  const width = domRect.width
  const height = window.innerHeight - domRect.top

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.set(2,2,5);
  camera.lookAt(0,0,0);

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)
  box.value.appendChild(renderer.domElement)

  

  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  

  const plane = new THREE.PlaneGeometry(5, 5, 5);

  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  })

  const mesh = new THREE.Mesh(plane, material)

  scene.add(mesh)
  scene.add(camera)

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  

  const animate = () => {
    requestAnimationFrame(animate)
    controls.update();
    renderer.render(scene, camera)
  }

  animate()

}


</script>

<style scoped>
</style>