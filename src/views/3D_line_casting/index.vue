<template>
  <div id="box" ref="box">
  </div>
</template>

<script>
export default {
  name: "3D射线投射"
}
</script>
<script setup >
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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
  /** 创建3个球体 */
  const sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  );
  sphere1.position.set(-2, 0, 0);
  scene.add(sphere1);

  const sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
  );
  sphere2.position.set(0, 0, 0);
  scene.add(sphere2);

  const sphere3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xff00ff })
  );
  sphere3.position.set(2, 0, 0);
  scene.add(sphere3);

  /** 光线投射Raycaster */
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const onMouseClick = (event) => {
    // 通过鼠标点击的位置计算出射线所需要的点的位置
    mouse.x = (event.clientX / width) * 2 - 1;
    mouse.y = -(event.clientY / height) * 2 + 1;

    console.log(mouse.x,mouse.y);

    // 通过鼠标点击的位置和当前相机的矩阵计算出射线的起点和终点
    raycaster.setFromCamera(mouse, camera);

    // 获取射线直线和球体的焦点
    const intersects = raycaster.intersectObjects([sphere1, sphere2, sphere3]);

    if (intersects.length > 0) {
      console.log(intersects);//[0].object.material.color

      if (intersects[0].object._isSelect) {
        intersects[0].object.material.color.set(intersects[0].object._originColor);
        intersects[0].object._isSelect = false;
        return;
      }

      intersects[0].object._isSelect = true;
      intersects[0].object._originColor = intersects[0].object.material.color.getHex()
      intersects[0].object.material.color.set(0xff0000);
    }

    
  };

  /** 监听鼠标移动事件 */
  box.value.addEventListener('click', onMouseClick, false);

  

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