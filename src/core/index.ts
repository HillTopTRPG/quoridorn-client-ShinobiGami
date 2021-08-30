import { App, ComponentPublicInstance } from 'vue'
import QuoridornCore from './quoridorn-core.vue'
import FlexibleDataLayout from './flexible-data-layout.vue'
import FlexibleFlexLayout from './flexible-data-layout/flexible-flex-layout.vue'
import FlexibleTabLayout from './flexible-data-layout/flexible-tab-layout.vue'
import FlexibleUnionLayout from './flexible-data-layout/flexible-union-layout.vue'
import { MadeStore } from '@/core/utility/vue3'
import { ComputedOptions, MethodOptions } from '@vue/runtime-core'

const Plugin = {
  install(app: App): void {
    app.component('flexible-flex-layout', FlexibleFlexLayout)
    app.component('flexible-tab-layout', FlexibleTabLayout)
    app.component('flexible-union-layout', FlexibleUnionLayout)
    app.component('flexible-data-layout', FlexibleDataLayout)
    app.component('quoridorn-core', QuoridornCore)
  }
}

// eslint-disable-next-line no-use-before-define, @typescript-eslint/no-explicit-any
declare type ComponentPublicInstanceConstructor<T extends ComponentPublicInstance<Props, RawBindings, D, C, M> = ComponentPublicInstance<any>, Props = any, RawBindings = any, D = any, C extends ComputedOptions = ComputedOptions, M extends MethodOptions = MethodOptions> = {
  __isFragment?: never;
  __isTeleport?: never;
  __isSuspense?: never;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
};

export function installFeatures (
  app: App,
  features: { data: MadeStore<unknown>, pane: ComponentPublicInstanceConstructor }[]
): void {
  features.forEach(f => {
    app.component(f.pane.name, f.pane)
  })
  const featureStores = features.map(f => f.data)

  app.config.globalProperties.$featureStores = featureStores
  app.provide('$featureStores', featureStores)
}

export default Plugin
