import TDesign from 'tdesign-vue-next';
import { createApp } from 'vue';
import App from './App.vue';
import { router as VueRouter } from './router';
import './style.css';
// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css';



const app = createApp(App)

app.use(VueRouter);
app.use(TDesign);

app.config.devtools = true

app.mount('#app')
