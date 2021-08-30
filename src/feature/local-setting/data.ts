import { reactive } from 'vue'
import { makeStore, StoreUpdateProperties } from '@/core/utility/vue3'

export type LocalSetting = {
  sample: boolean;
}

type Store = {
  ready: boolean,
  setting: LocalSetting;
}

export default makeStore<Store>('local-setting-store', () => {
  const state = reactive<StoreUpdateProperties<Store, never>>({
    ready: true,
    setting: { sample: false }
  })

  return {
    get ready() {
      return state.ready
    },
    get setting() {
      return state.setting
    }
  }
})
