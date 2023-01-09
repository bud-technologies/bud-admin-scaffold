import { createApp } from 'vue'
import './style.css'
import 'ant-design-vue/dist/antd.css'
import '@bud/bud-admin-template/dist/style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)

const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
app.use(router).use(pinia).mount('#app')
