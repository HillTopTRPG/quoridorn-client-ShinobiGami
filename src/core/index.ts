import { App } from 'vue'
import FlexibleDataLayout from './flexible-data-layout.vue'
import FlexibleFlexLayout from './flexible-data-layout/flexible-flex-layout.vue'
import FlexibleTabLayout from './flexible-data-layout/flexible-tab-layout.vue'
import FlexibleUnionLayout from './flexible-data-layout/flexible-union-layout.vue'

const Plugin = {
  install(app: App): void {
    app.component('flexible-flex-layout', FlexibleFlexLayout)
    app.component('flexible-tab-layout', FlexibleTabLayout)
    app.component('flexible-union-layout', FlexibleUnionLayout)
    app.component('flexible-data-layout', FlexibleDataLayout)
  }
}

export default Plugin
