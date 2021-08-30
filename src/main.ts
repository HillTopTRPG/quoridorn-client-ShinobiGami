import { createApp } from 'vue'
import App from './App.vue'
import LanguageManager from '@/core/utility/LanguageManager'
import CorePlugin from '@/core'
import FeaturePlugin from '@/feature'
import Vue3TouchEvents from 'vue3-touch-events'

(async () => {
  const app = createApp(App)
  app.use(await LanguageManager.instance.init())
  app.use(FeaturePlugin)
  app.use(CorePlugin)
  app.use(Vue3TouchEvents)
  app.mount('#app')
})()
