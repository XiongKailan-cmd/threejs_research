<template>
  <div id="box" ref="box">
  </div>
</template>

<script>
export default {
  name: "材质贴图"
}
</script>
<script setup >
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { onMounted, onUnmounted, ref } from 'vue';

const box = ref(null)

onMounted(() => {
  init();
})

const gui = new GUI();

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

  // 纹理加载器
  const loader = new THREE.TextureLoader(); 
  // 加载纹理
  const textures = loader.load('/public/textures/watercover/CityNewYork002_COL_VAR1_1K.png');
  // 设置纹理彩色空间
  // textures.colorSpace = THREE.SRGBColorSpace;
  // 环境遮挡贴图
  const aoMap = loader.load('/public/textures/watercover/CityNewYork002_AO_1K.jpg');
  // 透明度贴图
  const alphaMap = loader.load('/public/textures/door/height.jpg');
  // 光照贴图
  const lightMap = loader.load('/public/textures/colors.png');
  // HDR加载器
  const rgbeLoader = new RGBELoader();
  // HDR贴图
  rgbeLoader.load('/public/textures/Alex_Hart-Nature_Lab_Bones_2k.hdr', (envMap) => {
    // 球形映射
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    // 环境贴图
    scene.background = envMap;
    // 场景环境贴图
    scene.environment = envMap;

    planeMaterial.envMap = envMap; 
  })
  // 高光贴图
  const specularMap = loader.load('/public/textures/watercover/CityNewYork002_GLOSS_1K.jpg');

  const planeGeometry = new THREE.PlaneGeometry(1,1,1,1);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: textures,
    // 透明
    transparent: true,
    // 透明度贴图（黑色不显示 灰色0.5 白色显示）
    // alphaMap,
    side: THREE.DoubleSide,
    // 光照贴图(突出光照部分)
    // lightMap,
    // 高光贴图（用于反射光的强度 白色反射 黑色不反射 灰色0.5）
    specularMap,
  });

  gui.add(planeMaterial, 'aoMapIntensity').min(0).max(1).name('透明');
  gui.add(planeMaterial, 'reflectivity').min(0).max(1).name('反射效果');
  gui.add(planeMaterial, 'lightMapIntensity').min(0).max(1).name('光照强度');
  // 环境遮挡贴图(突出沟壑和阴影部分)
  const aoMapFolder = gui.addFolder('环境遮挡贴图');
  const aoMapControls = {
    showAO: () => {
      planeMaterial.aoMap = aoMap;
      planeMaterial.needsUpdate = true;
    },
    hideAO: () => {
      planeMaterial.aoMap = null;
      planeMaterial.needsUpdate = true;
    }
  }
  aoMapFolder.add(aoMapControls, 'showAO').name('显示环境遮挡贴图')
  aoMapFolder.add(aoMapControls, 'hideAO').name('隐藏环境遮挡贴图')
  aoMapFolder.add(planeMaterial, 'aoMapIntensity').min(0).max(1).name('环境遮挡贴图强度')
  
  // 
  gui.add(textures, 'colorSpace', {
    sRGB: THREE.SRGBColorSpace,
    Linear: THREE.LinearSRGBColorSpace
  }).name('纹理彩色空间').onChange(() => {
    textures.needsUpdate = true;
  });
  

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  scene.add(plane);


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

onUnmounted(() => {
  gui && gui.destroy()
})

</script>

<style lang="scss" scoped>

</style>