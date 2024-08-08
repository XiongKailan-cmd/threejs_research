<template>
    <div class="home" ref="home">
        <div class="convas-container" ref="canvas"></div>
    </div>
</template>

<script>
export default {
    name: "材质-玻璃材质",
}
</script>

<script setup>
    import * as THREE from 'three'
    import { ref, onMounted } from 'vue'
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
    import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
    import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    gltfLoader.setDRACOLoader(dracoLoader);

    const canvas = ref(null)

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

    // 添加控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    
    // 创建环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // 添加点光源
    let pointLight = new THREE.PointLight(0xffffff, 2);
    pointLight.position.set(0, 3, 0);
    scene.add(pointLight);

    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('/textures/Alex_Hart-Nature_Lab_Bones_2k.hdr', (textures) => {
        // textures.mapping = THREE.EquirectangularReflectionMapping; // 反射
        textures.mapping = THREE.EquirectangularRefractionMapping; // 折射
        scene.background = textures;
        scene.environment = textures;

        // 环境贴图
        // planeMaterial.envMap = textures;

        gltfLoader.load('/model/Duck.glb', (gltf) => {
            const duck = gltf.scene.getObjectByName('LOD3spShape');
            duck.material = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                envMap: textures,
                refractionRatio: 0.7,
                reflectivity: 1,
            });
            scene.add(gltf.scene);
            // 测试将小鸭子直接放入场景：会没有缩放效果导致变大
            // scene.add(duck);
        })
    })

    


    




    const render = () => {
        renderer.render(scene, camera);
        controls && controls.update();
        requestAnimationFrame(render);
    }

    onMounted(() => {
        canvas.value.appendChild(renderer.domElement);
        render();
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