<template>
  <div id="box" ref="box">
  </div>
</template>

<script>
export default {
  name: "模型加载器"
}
</script>
<script setup >
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
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

  

  /** 创建RGBELoader */
  // const rgbeLoader = new RGBELoader();
  // rgbeLoader.load('/public/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', (envMap) => {
  //   // 球形映射
  //   envMap.mapping = THREE.EquirectangularReflectionMapping;
  //   // 环境贴图
  //   scene.background = envMap;
  // });

  // 创建环境光
  // const light = new THREE.AmbientLight( 0xffffff ); // 柔和的白光
  // scene.add( light );

  /** 创建平行光 */
  // const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  // scene.add( directionalLight );

  /** 创建半球光 */
  // const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
  // scene.add( light );

  /** 创建点光源 */
  const light = new THREE.PointLight( 0xffffff, 1 );
  light.add(new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })) );
  light.position.set( 5, 5, -5 );
  light.scale.set( 10,10,10 );
  console.log(light);
  scene.add( light );

  // 创建模型加载器
  const gltfLoader = new GLTFLoader();
  gltfLoader.load('/public/model/Duck.glb', (gltf) => {
    console.log(gltf);
    // gltf.scene.
    scene.add(gltf.scene);
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

<style lang="scss" scoped>

</style>