<template>
    <div class="home" ref="home">
        <div class="convas-container" ref="canvas"></div>
        <div class="operate">
            <h1>宝马I8-801</h1>
            <h2>车身选择</h2>
            <div class="color">
                <div class="color-item" v-for="(color, index) in colors" :key="index" :style="{background: color}" @click="changePartMaterial( bodyMaterial, color)"></div>
            </div>
            <h2>引擎盖选择</h2>
            <div class="color">
                <div class="color-item" v-for="(color, index) in colors" :key="index" :style="{background: color}" @click="changePartMaterial( hoodMaterial, color)"></div>
            </div>
            <h2>前脸材质选择</h2>
            <div class="color">
                <div class="color-item" v-for="(color, index) in colors" :key="index" :style="{background: color}" @click="changePartMaterial( frontMaterial, color)"></div>
            </div>
            <h2>车身贴膜选择</h2>
            <div class="color">
                <button @click="changeFilmMaterial('磨砂')">磨砂</button>
                <button @click="changeFilmMaterial('光亮')">光亮</button>
            </div>
            <h2>挡风玻璃选择</h2>
            <div class="color">
                <button @click="changeGlassMaterial('普通')">普通</button>
                <button @click="changeGlassMaterial('透亮')">透亮</button>
            </div>
            <h2>轮毂选择</h2>
            <div class="color">
                <div class="color-item" v-for="(color, index) in colors" :key="index" :style="{background: color}" @click="changePartMaterial( wheelsMaterial, color)"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "VR看车"
}
</script>

<script setup>
    import * as THREE from 'three'
    import { ref, onMounted } from 'vue'
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
    import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

    const canvas = ref(null)

    // 创建模型加载器
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/public/draco/');
    loader.setDRACOLoader(dracoLoader);


    // 创建场景
    const scene = new THREE.Scene();
    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight-88), 0.1, 1000);
    camera.position.set(0, 2, 6);
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
        // 抗锯齿
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight-88);

    let controls = null;

    // 创建汽车模型构件
    let wheels = [];
    let carBody, frontCar, hoodCar, glassCar;

    // 创建物理材质
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: '#ff0000',
        // 金属度
        metalness: 1,
        // 粗糙度
        roughness: 0.5,
        // 清漆
        clearcoat: 1,
        // 清漆粗糙度
        clearcoatRoughness: 0
    })

    const frontMaterial = new THREE.MeshPhysicalMaterial({
        color: '#ff0000',
        // 金属度
        metalness: 1,
        // 粗糙度
        roughness: 0.5,
        // 清漆
        clearcoat: 1,
        // 清漆粗糙度
        clearcoatRoughness: 0
    })

    const hoodMaterial = new THREE.MeshPhysicalMaterial({
        color: '#ff0000',
        // 金属度
        metalness: 1,
        // 粗糙度
        roughness: 0.5,
        // 清漆
        clearcoat: 1,
        // 清漆粗糙度
        clearcoatRoughness: 0
    })

    const wheelsMaterial = new THREE.MeshPhysicalMaterial({
        color: '#ff0000',
        // 金属度
        metalness: 1,
        // 粗糙度
        roughness: 0
    })

    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        // 透明
        transparent: true,
        // 透明度
        transmission: 1,
        // 金属度
        metalness: 0,
        // 粗糙度
        roughness: 0.15
    })

    const colors = ref(['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'])

    // 加载GLTF汽车模型
    loader.load('/public/model/bmw01.glb', (gltf) => {
        const bmw = gltf.scene;
        bmw.traverse(item => {
            // 判断是否是车轮
            if (item.name.includes('轮毂')) {
                wheels.push(item);
                item.material = wheelsMaterial;
            }
            // 判断是否是车身 Mesh002
            if (item.name.includes('Mesh002')) {
                carBody = item;
                carBody.material = bodyMaterial;
            }
            // 判断是否为前脸
            if (item.name.includes('前脸')) {
                frontCar = item;
                frontCar.material = frontMaterial;
            }
            // 判断是否为引擎盖
            if (item.name.includes('引擎盖_1')) {
                hoodCar = item;
                hoodCar.material = hoodMaterial;
            }
            // 判断是否为挡风玻璃
            if (item.name.includes('挡风玻璃')) {
                glassCar = item;
                glassCar.material = glassMaterial;
            }
        })
        
        scene.add(gltf.scene);
        console.log(gltf.scene)
    })

    // 改变车辆构件材质
    function changePartMaterial(part, color) {
        part.color.set(color)
    }

    // 改变车膜材质
    function changeFilmMaterial(type) {
        bodyMaterial.clearcoat = type === '磨砂' ? 0 : 1;
        bodyMaterial.clearcoatRoughness = type === '磨砂' ? 0.5 : 0;
        frontMaterial.clearcoat = type === '磨砂' ? 0 : 1;
        frontMaterial.clearcoatRoughness = type === '磨砂' ? 0.5 : 0;
        hoodMaterial.clearcoat = type === '磨砂' ? 0 : 1;
        hoodMaterial.clearcoatRoughness = type === '磨砂' ? 0.5 : 0;        
    }

    // 改变车玻璃材质
    function changeGlassMaterial(type) {
        glassMaterial.roughness = type === '普通' ?  0.15: 0;
    }
    


    // 给场景添加灯光
    const light1 = new THREE.DirectionalLight('#ffffff', 1);
    light1.position.set(0, 10, 0)
    scene.add(light1);
    const light2 = new THREE.DirectionalLight('#ffffff', 1);
    light2.position.set(0, 10, 10)
    scene.add(light2);
    const light3 = new THREE.DirectionalLight('#ffffff', 1);
    light3.position.set(5, 10, 0)
    scene.add(light3);
    const light4 = new THREE.DirectionalLight('#ffffff', 1);
    light4.position.set(-5, 10, 0)
    scene.add(light4);
    const light5 = new THREE.DirectionalLight('#ffffff', 1);
    light5.position.set(0, 10, -10)
    scene.add(light5);
    const light6 = new THREE.DirectionalLight('#ffffff', 1);
    light6.position.set(0, -10, 0)
    scene.add(light6);
    const light7 = new THREE.DirectionalLight('#ffffff', 1);
    light7.position.set(-10, 10, 0)
    scene.add(light7);
    const light8 = new THREE.DirectionalLight('#ffffff', 1);
    light8.position.set(10, 10, 0)
    scene.add(light8);



    const render = () => {
        renderer.render(scene, camera);
        controls && controls.update();
        requestAnimationFrame(render);
    }

    onMounted(() => {
        canvas.value.appendChild(renderer.domElement);

        renderer.setClearColor('#000')
        scene.background = new THREE.Color(0xcccccc);
        scene.environment = new THREE.Color(0xcccccc);
        render();

        //  创建网格
        const gridHelper = new THREE.GridHelper(10, 10);
        gridHelper.material.opacity = 0.2;
        gridHelper.material.transparent = true;
        scene.add(gridHelper);

        // 添加控制器
        controls = new OrbitControls(camera, renderer.domElement);

        // 创建模型加载器
        
        
    })

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / (window.innerHeight-88);
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight-88);
    })




</script>

<style scoped lang="scss">
    .home{
        position: relative;
    }

    .operate{
        width: 320px;
        position: absolute;
        top: 0;
        right: 0;

        h1{
            font-size: 20px;
            margin: 20px 0;
            font-weight: bold;
            // text-align: center;
        }

        h2{
            font-size: 14px;
            margin: 10px 0;
            font-weight: 900;
            // text-align: center;
        }

        .color{
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            // justify-content: space-around;
            // margin-bottom: 20px;
            gap: 10px;

            .color-item{
                width: 30px;
                height: 30px;
                border-radius: 10px;
                cursor: pointer;
            }


            button{
                width: 100px;
                height: 30px;
                background-color: #ffffff;
                border: 1px solid #eee;
                border-radius: 10px;
                cursor: pointer;
                margin-right: 10px;
            }
        }
    }
</style>