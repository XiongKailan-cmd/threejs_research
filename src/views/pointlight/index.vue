<template>
  <div id="box" ref="box">
    <div class="gui-container" ref="gui_container"></div>
  </div>
</template>

<script>
export default {
  name: "点光源"
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
  camera.position.set(-5, 5, 5);
  camera.lookAt(0,0,0);

  const renderer = new THREE.WebGLRenderer()
  // 开启阴影计算
  renderer.shadowMap.enabled = true;
  renderer.physicallyCorrectLights = true;
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
    new THREE.PlaneGeometry(10, 10),
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
  const light = new THREE.AmbientLight(0xffffff);
  scene.add(light)

  /** 添加点光源 */
  const pointLight = new THREE.PointLight(0xff0000,1,10,0);
  pointLight.castShadow = true;

  const sqhere = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 20, 20),
    new THREE.MeshBasicMaterial({color: 0xff0000})
  );
  sqhere.position.set(2, 2, 2);
  sqhere.add(pointLight);

  scene.add(sqhere)

  

  /** gui调试 */


  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.update()
  
  /** 设置时钟 */
  const clock = new THREE.Clock()

  const animate = function () {
    const time = clock.getElapsedTime();
    console.log(time);
    sqhere.position.x = Math.sin(time) * 3;
    sqhere.position.z = Math.cos(time) * 3;//sin(time) * 3;
    // sqhere.position.y = Math.cos(time) *3;
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