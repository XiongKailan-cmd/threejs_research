<template>
    <view ref="screenDom" class="screenDom">

    </view>
</template>

<script>
export default {
    name: "球形机器人"
}
</script>
<script setup>
import * as THREE from 'three'
import { ref, onMounted } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// 获取屏幕dom实例
const screenDom = ref(null)

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight-88), 0.1, 1000);
camera.position.set(0, 1.5, 6);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
    // 抗锯齿
    antialias: true
});

// 创建辅助坐标系
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 控制器变量
let controls = null;

// 创建渲染函数
const render = () => {
    renderer.render(scene, camera)
    controls && controls.update()
    requestAnimationFrame(render)
}

// 创建模型加载器
onMounted(() => {
    // 创建控制器
    controls = new OrbitControls(camera, renderer.domElement);

    // 添加渲染器到Dom实例
    screenDom.value.appendChild(renderer.domElement)
    // 设置渲染器大小
    renderer.setSize(screenDom.value.clientHeight, screenDom.value.clientHeight);
    // 调用渲染函数
    render()
})


</script>

<style scoped lang="scss">
.screenDom{
    width: 100vw;
    height: calc(100vh - 88px);
}

</style>