<template>
  <div id="box" ref="box">
    <div class="gui-container" ref="gui_container"></div>
  </div>
</template>

<script>
export default {
  name: "灯光投射和阴影"
}
</script>
<script setup >
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { onMounted, ref } from 'vue';

const box = ref(null)
const gui_container = ref(null)

onMounted(() => {
  init();
})

const init = () => {

  const rect = box.value.getBoundingClientRect();
  const width = rect.width;
  const height = window.innerHeight - rect.top;

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(1, 1, 5);
  camera.lookAt(0,0,0);

  const renderer = new THREE.WebGLRenderer()
  // 开启阴影计算
  renderer.shadowMap.enabled = true;  
  renderer.setSize(width, height)
  box.value.appendChild(renderer.domElement)
  /** 创建1个球体 */
  const sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 20, 20),
    new THREE.MeshStandardMaterial()
  );
  sphere1.position.set(0, 0, 0);
  // 球阴影
  sphere1.castShadow = true;
  scene.add(sphere1);

  /** 创建一个平面 */
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshStandardMaterial()
  );
  plane.position.set(0,-1,0);
  plane.rotation.x =  -Math.PI / 2
  // 平面阴影
  plane.receiveShadow = true;
  scene.add(plane)

  /** GUI调试 */
  const gui = new GUI({
    autoPlace: false
  });

  /** 设置Gui所属的父盒子 */
  gui_container.value.appendChild(gui.domElement);

  /** 添加环境光 */
  const light = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light)

  /** 添加平行光 */
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(10, 10, 10);
  directionalLight.castShadow = true;
  /** 设置阴影模糊度 */
  directionalLight.shadow.radius = 10;
  /** 设置阴影分辨率 */
  directionalLight.shadow.mapSize.set(4096,4096);
  scene.add(directionalLight)

  /** 平行光投射原理 */
  const shadowFolder = gui.addFolder('阴影投射原理');
  shadowFolder.add(directionalLight.shadow.camera, 'near', 0, 50).name('近平面').onChange(() => {
    directionalLight.shadow.camera.updateProjectionMatrix();
  })
  shadowFolder.add(directionalLight.shadow.camera, 'far', 0, 500).name('远平面').onChange(() => {
    directionalLight.shadow.camera.updateProjectionMatrix();
  })
  shadowFolder.add(directionalLight.shadow.camera, 'left', -5, 5).name('左平面').onChange(() => {
    directionalLight.shadow.camera.updateProjectionMatrix();
  });
  shadowFolder.add(directionalLight.shadow.camera, 'right', -5, 5).name('右平面').onChange(() => {
    directionalLight.shadow.camera.updateProjectionMatrix();
  });
  shadowFolder.add(directionalLight.shadow.camera, 'top', -5, 5).name('上平面').onChange(() => {
    directionalLight.shadow.camera.updateProjectionMatrix();
  });
  shadowFolder.add(directionalLight.shadow.camera, 'bottom', -5, 5).name('下平面').onChange(() => {
    directionalLight.shadow.camera.updateProjectionMatrix();
  });





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

<style scoped>
#box{
  position: relative;
}
.gui-container{
  position: absolute;
  top: 0;
  right: 10px;
}

</style>