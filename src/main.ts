import { createApp } from 'vue'
import App from './App.vue'
import LanguageManager from '@/utility/LanguageManager'
import libComponentPlugin from '@/lib-components'
import Vue3TouchEvents from 'vue3-touch-events'

(async () => {
  const app = createApp(App)
  app.use(await LanguageManager.instance.init())
  app.use(libComponentPlugin)
  app.use(Vue3TouchEvents)
  app.mount('#app')
})()
