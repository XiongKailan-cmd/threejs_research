<template>
    <div class="home" ref="home">
        <div class="convas-container" ref="canvas"></div>
    </div>
</template>

<script>
export default {
    name: "材质-Lambert",
}
</script>

<script setup>
    import * as THREE from 'three'
    import { ref, onMounted } from 'vue'
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
    import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
    import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

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
    
    // 创建一个平面几何体
    const planeGeometry = new THREE.PlaneGeometry(2, 2, 200, 200);
    // 贴图
    const texture = new THREE.TextureLoader()

    // 加载颜色贴图
    const colorTexture = texture.load('/textures/watercover/CityNewYork002_COL_VAR1_1K.png');
    // 高光贴图
    const specularTexture = texture.load('/textures/watercover/CityNewYork002_GLOSS_1K.jpg');
    // 法线贴图
    const normalTexture = texture.load('/textures/watercover/CityNewYork002_NRM_1K.jpg');
    // 凹凸贴图
    const bumpTexture = texture.load('/textures/watercover/CityNewYork002_DISP_1K.jpg');
    // 环境光遮蔽贴图
    const aoTexture = texture.load('/textures/watercover/CityNewYork002_AO_1K.jpg');

    colorTexture.colorSpace = THREE.SRGBColorSpace;
    // 创建一个平面材质
    // const planeMaterial = new THREE.MeshPhongMaterial({
    //     map: colorTexture,
    //     specularMap: specularTexture,
    //     // normalMap: normalTexture,
    //     bumpMap: bumpTexture,
    //     displacementMap: bumpTexture,
    //     displacementScale: 0.08,
    //     aoMap: aoTexture,
    //     aoMapIntensity: 0.8,
    //     transparent: true,
    //     side: THREE.DoubleSide,
    // });
    // 创建一个平面材质
    const planeMaterial = new THREE.MeshLambertMaterial({
        map: colorTexture,
        specularMap: specularTexture,
        normalMap: normalTexture,
        bumpMap: bumpTexture,
        displacementMap: bumpTexture,
        displacementScale: 0.08,
        aoMap: aoTexture,
        aoMapIntensity: 0.8,
        transparent: true,
        side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = - Math.PI / 2;
    scene.add(plane);

    // 创建环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // 添加点光源
    let pointLight = new THREE.PointLight(0xffffff, 2);
    pointLight.position.set(0, 3, 0);
    scene.add(pointLight);

    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('/textures/Alex_Hart-Nature_Lab_Bones_2k.hdr', (textures) => {
        textures.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = textures;
        scene.environment = textures;

        // 环境贴图
        planeMaterial.envMap = textures;
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