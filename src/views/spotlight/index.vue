<template>
  <div id="box" ref="box">
    <div class="gui-container" ref="gui_container"></div>
  </div>
</template>

<script>
export default {
  name: "聚光灯"
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
  const light = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light)

  /** 添加聚光灯 */
  const spotLight = new THREE.SpotLight(0xff0000,1);
  spotLight.castShadow = true;
  /** 设置阴影模糊度 */
  spotLight.shadow.radius = 10;
  /** 设置阴影分辨率 */
  spotLight.shadow.mapSize.set(4096,4096);
  spotLight.target = sphere1;

  spotLight.shadow.camera.near = 0.2;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  spotLight.decay = 0;

  spotLight.position.set(5,5,5);
  scene.add(spotLight.target);
  scene.add(spotLight);

  /** gui调试 */
  const spotLightFolder = gui.addFolder('聚光灯');
  spotLightFolder.add(spotLight.shadow.camera, 'fov', 0, 180).name('聚光灯视角').onChange(() => {
    spotLight.shadow.camera.updateProjectionMatrix();
  })
  spotLightFolder.add(spotLight.shadow.camera, 'near', 0, 10).name('近平面').onChange(() => {
    spotLight.shadow.camera.updateProjectionMatrix();
  })
  spotLightFolder.add(spotLight.shadow.camera, 'far', 0, 100).name('远平面').onChange(() => {
    spotLight.shadow.camera.updateProjectionMatrix();
  })
  spotLightFolder.add(spotLight, 'angle', 0, Math.PI/2 ).name('聚光灯角度')
  spotLightFolder.add(spotLight, 'penumbra', 0, 1).name('聚光灯阴影过渡')
  spotLightFolder.add(spotLight, 'decay', 0, 10).name('聚光灯衰减')
  spotLightFolder.add(spotLight, 'distance', 0, 100).name('聚光灯距离')







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