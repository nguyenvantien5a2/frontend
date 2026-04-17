import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(vue3GoogleLogin, {
  clientId: '1035492525999-adtoohic0i56pu2l7tasnftk97pq3aqt.apps.googleusercontent.com'
})

app.mount('#app')
