<template>
  <div id="box" ref="box">
  </div>
</template>

<script>
export default {
  name: "补间动画"
}
</script>
<script setup >
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js';
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
  camera.position.set(5,5, 10);
  camera.lookAt(0,0,0);

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)
  box.value.appendChild(renderer.domElement)
  /** 创建3个球体 */
  const sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  );
  sphere1.position.set(-2, 0, 0);
  scene.add(sphere1);

  const tween = new TWEEN.Tween(sphere1.position)
  tween.to({ x: 2 }, 1000)
  // 缓动函数
  tween.easing(TWEEN.Easing.Quadratic.InOut)
  // tween.repeat(Infinity)
  // tween.yoyo(true)
  // tween.delay(500)
  // tween.onUpdate(() => {
  //   console.log(sphere1.position)
  // })
  const tween2 = new TWEEN.Tween(sphere1.position)
  tween2.to({ y: -4 }, 1000);
  tween.chain(tween2);

  const tween3 = new TWEEN.Tween(sphere1.position)
  tween3.to({ x: -2, y: 0 }, 1000)
  tween2.chain(tween3)

  tween3.chain(tween)

  tween.start()

  // tween.repeat(Infinity)
  // tween2.repeat(Infinity)
  // tween3.repeat(Infinity)


  
  

  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.update()

  const animate = function () {
    requestAnimationFrame(animate);
    controls.update();
    TWEEN.update();
    renderer.render(scene, camera);
  }

  animate()
}

</script>

<style lang="scss" scoped>

</style>