import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia';
import { router } from './router/index'
//import "@egjs/vue3-infinitegrid/dist/styles.css"

const app = createApp(App)
const pinia = createPinia();
app.use(pinia)
app.use(router)
app.mount('#app')
