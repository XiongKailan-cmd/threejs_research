<template>
  <div ref="box" ></div>
</template>

<script>
export default {
  name: '第一个Three.js程序'
}
</script>
<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { onMounted, ref } from 'vue';

const box = ref(null);

onMounted(() => {
  exmple()
  // box.value.addEventListener('resize', exmple())
})

const exmple = () => {
  const domRect = box.value.getBoundingClientRect();
  const width = domRect.width;
  const height = window.innerHeight - domRect.top;
  // 场景
  const scene = new THREE.Scene()
  // 相机
  const camera = new THREE.PerspectiveCamera(
    45,
    width / height,
    0.1,
    1000
  )
  camera.position.set(4,2,2)

  // 渲染器
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  box.value.appendChild(renderer.domElement);

  // 模型
  const geometry = new THREE.BoxGeometry(1,1,1);
  // 材质
  const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
  // 网格(将几何体和材质结合起来，产生一个网格)
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  
  // 添加轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 8;
  controls.update();

  // 添加世界坐标辅助器
  // const axesHelper = new THREE.AxesHelper(5);
  // scene.add(axesHelper);

  // 改变相机位置

  const animate = function () {
    requestAnimationFrame(animate);
    // 自动旋转
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    controls.update();

    renderer.render(scene, camera);
  };

  camera.position.z = 6;
  camera.lookAt(0,0,0)
  animate()
}
</script>

<style scoped>

</style>