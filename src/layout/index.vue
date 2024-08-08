<script setup>
import { onBeforeMount, ref } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import { routes } from '../router';

const router = useRouter();

const options = ref([]);

onBeforeMount(() => {

  options.value = routes.map((route) => ({
    content: route.meta.title + "  " + route.path,
    value: route.path,
  }));
});

const clickHandler = (dropdownItem, content) => {
  router.push({
    path: dropdownItem.value,
  });
};

</script>

<template>
  <t-layout class="flex flex-col h-screen">
    <t-header class="flex flex-row !h-16 justify-start items-center px-12 gap-8" >
      <img width="136" height="48" src="https://www.tencent.com/img/index/menu_logo_hover.png" alt="logo" />
      <t-dropdown :options="options" :maxColumnWidth="200" trigger="click" @click="clickHandler">
        <t-space>
          <t-button variant="text">
            页面跳转
            <template #suffix> <t-icon name="chevron-down" size="16" /></template>
          </t-button>
        </t-space>
      </t-dropdown>
    </t-header>
    <t-content class="!w-full" ref="content">
        <RouterView />
    </t-content>
  </t-layout>
</template>
