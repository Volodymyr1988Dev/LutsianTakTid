import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia';
import { router } from './router/index'
import { useAuthStore } from './stores/auth.store';
//import "@egjs/vue3-infinitegrid/dist/styles.css"

const app = createApp(App)
const pinia = createPinia();
app.use(pinia)
const authStore = useAuthStore()

document.addEventListener("visibilitychange", async () => {
  if (document.visibilityState === "visible") {
    try {
      await authStore.initAuth()
    } catch {
      console.log("Session restore failed")
    }
  }
})
app.use(router)
app.mount('#app')
