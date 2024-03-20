<template>
  <div ref="main">
    <div class="sences" 
      style="position: fixed; 
        top: 0; 
        left: 0;
        z-index: 10;
        pointer-events: none;
        transition: all 1s;"
      :style="{
        transform: `translate3d(0, ${-index * 100}vh, 0)`
      }"
    >
      <div v-for="item in pages" :key="item.text" style="width: 100vw; height: 100vh;">
        <h1 style="position: relative; top: 148px; left: 68px; font-size: 50px; color: #fff;">{{ item.text }}</h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "圣诞贺卡"
}
</script>

<script setup >
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { onMounted, onUnmounted, ref } from 'vue';
/** 模型加载 */
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
/** 模型解压 */
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
/** rebeLoader */
import gsap from 'gsap';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { Water } from 'three/examples/jsm/objects/Water2.js';

const main = ref(null);

onMounted(() => {
  init();
})

let pages = ref([])
let index = ref(0);



let time = null;

const init =() =>{

  // 创建场景
  const scene = new THREE.Scene();

  /** 计算宽高比 */ 
  const rect = main.value.getBoundingClientRect();
  const width = rect.width;
  const height = window.innerHeight - rect.top;

  /** 创建相机 */
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(-3.23, 2.98, 4.06);
  camera.updateProjectionMatrix();

  

  // 定义补间动画移动相机
  const timeLine1 = gsap.timeline();
  const timeline2 = gsap.timeline();
  // 定义移动相机函数
  function translateCamera(position, target) {
    console.log(position ,"position : "  , position.x);
    timeLine1.to(camera.position, {
      duration: 1,
      x: position.x,
      y: position.y,
      z: position.z,
      ease: 'power2.inOut'
    })
    timeline2.to(controls.target, {
      duration: 1,
      x: target.x,
      y: target.y,
      z: target.z,
      ease: 'power2.inOut'
    })
  }

  pages.value = [
    {
      text: '圣诞快乐',
      callback: () => {
        translateCamera(
          new THREE.Vector3(-3.23, 3, 4.06),
          new THREE.Vector3(-8,2,0)
        )
      }
    },
    {
      text: '感谢在这么大的世界中遇见了你',
      callback: () => {
        translateCamera(
          new THREE.Vector3(7, 0, 23),
          new THREE.Vector3(0,0,0)
        )
      }
    },
    {
      text: '愿与你探寻世界的每一个角落',
      callback: () => {
        translateCamera(
          new THREE.Vector3(10,3,0),
          new THREE.Vector3(5,2,0)
        )
      }
    },
    {
      text: '愿将填上的星星送给你',
      callback: () => {
        translateCamera(
          new THREE.Vector3(7, 0, 23),
          new THREE.Vector3(0,0,0)
        )
        makeHeart();
      }
    },
    {
      text: '幸福美满',
      callback: () => {
        translateCamera(
          new THREE.Vector3(-20,1.3,6.6),
          new THREE.Vector3(5,2,0)
        )
        restoreHeart();
      }
    }

  ]

  /** 创建渲染器 */
  const renderer = new THREE.WebGLRenderer({ 
    // 抗锯齿
    antialias: true 
  });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.physicallyCorrectLights = true;
  // 设置色调映射
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.8;
  main.value.appendChild(renderer.domElement);

  /** 初始化控制器 */
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(-8, 2, 0);
  // 添加阻尼效果
  controls.enableDamping = true;

  /** 初始化解压模型 */
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/draco/');
  /** 初始化模型加载 */
  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  // 加载模型
  gltfLoader.load('/model/scene.glb', (gltf) => {
    const model = gltf.scene;
    model.traverse((child) => {
      if (child.name === 'Plane') {
        child.visible = false;
      }
      if(child.isMesh){
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(gltf.scene);
  });

  //添加平行光
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 50, 0);
  scene.add(light);

  // 加载hdr贴图
  const rgbeLoader = new RGBELoader();
  rgbeLoader.load('/textures/sky.hdr', (textures) => {
    textures.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = textures;
    scene.environment = textures;
  });

  // 创建水面
  const waterGeometry = new THREE.CircleGeometry(300, 32);
  const water = new Water(
    waterGeometry,
    {
      textureWidth: 1024,
      textureHeight: 1024,
      color: 0xeeeeff,
      flowDirection: new THREE.Vector2(1, 1),
      scale: 100,
    }
  );
  water.position.y = -0.5;
  water.rotation.x = Math.PI * -0.5;

  scene.add(water);

  // 添加点光源
  const pointLight = new THREE.PointLight(0xffffff, 1000);
  pointLight.position.set(0.1, 2.4, 0);
  pointLight.castShadow = true;
  scene.add(pointLight);

  // 添加三个点光源
  const pointLightGroup = new THREE.Group();
  pointLightGroup.position.set(-8,2.5,-1.5)
  let PLArray = [];
  const radius = 3;
  for (let i = 0; i < 3; i++) {

    const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 10
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(
      radius * Math.cos(i * 2 * Math.PI / 3) ,
      Math.cos(i * 2 * Math.PI / 3),
      radius * Math.sin(i * 2 * Math.PI / 3),
    );


    const pointLight = new THREE.PointLight(0xffffff, 100);
    sphere.add(pointLight);
    PLArray.push(sphere)
    // pointLight.position.set(0.1, 2.4, 0);
    // pointLight.castShadow = true;
    // PLArray.push(pointLight);
    // pointLightGroup.add(pointLight);
    pointLightGroup.add(sphere);
  }
  scene.add(pointLightGroup)

  const options = {
    angle: 0
  }

  gsap.to(options, {
    duration: 10,
    angle: Math.PI * 2,
    repeat: -1,
    ease: 'linear',
    onUpdate: () => {
      pointLightGroup.rotation.y = options.angle;
      PLArray.forEach((item, index) => {
        item.position.y = Math.cos(index * 2 * Math.PI / 3 + options.angle * 5);
      })
    }
  })


  // 实例化创建漫天的星星
  let starsInstances = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.08, 18, 18),
    new THREE.MeshBasicMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 100 }),
    100
  );

  // 随机生成星星的位置
  const startArr = [];
  const endArr = [];

  for(let i = 0; i < 100; i++){
    const x = Math.random() * 100 - 50;
    const y = Math.random() * 100 - 50;
    const z = Math.random() * 100 - 50;
    startArr.push(new THREE.Vector3(x, y, z));
    
    let matrix = new THREE.Matrix4();
    matrix.setPosition(x, y, z);
    starsInstances.setMatrixAt(i, matrix);
  }
  scene.add(starsInstances);

  // 生成贝塞尔曲线 - 爱心路径
  let heartShape = new THREE.Shape();
  heartShape.moveTo( 25, 25 );
  heartShape.bezierCurveTo( 25, 25, 20, 0, 0, 0 );
  heartShape.bezierCurveTo( - 30, 0, - 30, 35, - 30, 35 );
  heartShape.bezierCurveTo( - 30, 55, - 10, 77, 25, 95 );
  heartShape.bezierCurveTo( 60, 77, 80, 55, 80, 35 );
  heartShape.bezierCurveTo( 80, 35, 80, 0, 50, 0 );
  heartShape.bezierCurveTo( 35, 0, 25, 25, 25, 25 );

  // 根据爱心路径生成星星的终点
  const center = new THREE.Vector3(0, 1, 10);
  for(let i = 0; i < 100; i++){
    let point = heartShape.getPoint(i / 100);
    endArr.push(
      new THREE.Vector3(
        point.x * 0.05 + center.x, 
        point.y * 0.05 + center.y, 
        center.z 
     )
    );

  }

  // 创建星星的动画
  function makeHeart() {
    let params = {
      time: 0
    }

    gsap.to(
      params,
      {
        duration: 1,
        time: 1,
        onUpdate: () => {
          for(let i = 0; i < 100; i++){
            let x = startArr[i].x + (endArr[i].x - startArr[i].x) * params.time ;
            let y = startArr[i].y + (endArr[i].y - startArr[i].y) * params.time ;
            let z = startArr[i].z + (endArr[i].z - startArr[i].z) * params.time ;
            let matrix = new THREE.Matrix4();
            matrix.setPosition(x, y, z);
            starsInstances.setMatrixAt(i, matrix);
          }
          starsInstances.instanceMatrix.needsUpdate = true;
        }
      }
    )
  }

  // 创建星星的动画
  function restoreHeart() {
    let params = {
      time: 0
    }

    gsap.to(
      params,
      {
        duration: 1,
        time: 1,
        onUpdate: () => {
          for(let i = 0; i < 100; i++){
            let x = endArr[i].x + (startArr[i].x - endArr[i].x) * params.time ;
            let y = endArr[i].y + (startArr[i].y - endArr[i].y) * params.time ;
            let z = endArr[i].z + (startArr[i].z - endArr[i].z) * params.time ;
            let matrix = new THREE.Matrix4();
            matrix.setPosition(x, y, z);
            starsInstances.setMatrixAt(i, matrix);
          }
          starsInstances.instanceMatrix.needsUpdate = true;
        }
      }
    )
  }




  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
  }

  render();
  // 监听鼠标滚轮事件 - 页面切换
  let isAnimate = false;
  console.log(index.value)
  window.addEventListener('wheel', (e) => {
    if (isAnimate) return;
    isAnimate = true;
    if (e.deltaY > 0) {
      index.value++;
      if (index.value > pages.value.length - 1) {
        index.value = 0
      }
    }
    console.log("index: " , index.value);
    pages.value[index.value].callback();
    time = setTimeout(() => {
      isAnimate = false;
    }, 1000)
  })


}

onUnmounted(() => {
  time && clearTimeout(time);
})


</script>

<style scoped>

</style>