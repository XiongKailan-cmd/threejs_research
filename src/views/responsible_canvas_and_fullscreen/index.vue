<template>
  <div>
    <div ref="box" id="box" >
      <button class="but" @click="clickFullScreen">点击全屏</button>
      <button class="butExit" @click="exitFullScreen">退出全屏</button>
    </div>
  </div>
</template>

<script>
export default {
  name: '响应式画布和全屏'
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

// 相机
const camera = ref(null);

// 渲染器
const renderer = ref(null);

const exmple = () => {
  const domRect = box.value.getBoundingClientRect();
  const width = domRect.width;
  const height = window.innerHeight - domRect.top;
  // 场景
  const scene = new THREE.Scene()
  // 相机
  camera.value = new THREE.PerspectiveCamera(
    45,
    width / height,
    0.1,
    1000
  )
  camera.value.position.set(2,1,1)

  // 渲染器
  renderer.value = new THREE.WebGLRenderer();
  renderer.value.setSize(width, height);
  box.value.appendChild(renderer.value.domElement);

  // 模型
  const geometry = new THREE.BoxGeometry(1,1,1);
  // 材质
  const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
  const materialParent = new THREE.MeshBasicMaterial({color: 0xff0000});
  // 网格(将几何体和材质结合起来，产生一个网格)
  const cube = new THREE.Mesh(geometry, material);
  const parentCube = new THREE.Mesh(geometry, materialParent);
  // 设置位移 （局部位移 - 相对于父级元素）
  parentCube.position.set(0,0,0);
  cube.position.set(3,0,0);
  // 设置缩放（局部缩放 - 相对于父级元素）
  cube.scale.set(2,2,2);
  // 旋转（局部旋转 - 相对于父级元素）
  cube.rotation.set( Math.PI / 4,Math.PI / 4,Math.PI / 4);
  
  // 子cube引入父级cube
  parentCube.add(cube);

  scene.add(parentCube);
  
  // 添加轨道控制器
  const controls = new OrbitControls(camera.value, renderer.value.domElement);

  // 添加世界坐标辅助器
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  // 改变相机位置

  const animate = function () {
    requestAnimationFrame(animate);
    controls.update();
    renderer.value.render(scene, camera.value);
  };

  camera.value.position.z = 10;
  camera.value.lookAt(0,0,0)
  animate()

  window.addEventListener('resize', () => {
    const domRect = box.value.getBoundingClientRect();
    const width = domRect.width;
    const height = window.innerHeight - domRect.top;
    // 重新设置渲染器的宽高比
    renderer.value.setSize(width, height);
    // 重新设置相机的宽高比
    camera.value.aspect = width / height;
    // 更新相机的投影矩阵
    camera.value.updateProjectionMatrix();
  });

}

const clickFullScreen = () => {
  // renderer.value.domElement.requestFullscreen();
  box.value.requestFullscreen();
}

const exitFullScreen = () => {
  document.exitFullscreen();
}

</script>

<style scoped>

#box{
  position: relative;
}

.but{
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 999;
  color: #fff;
}

.butExit{
  position: absolute;
  top: 20px;
  right: 100px;
  z-index: 999;
  color: #fff;
}

</style>