import { reactive } from 'vue'
import { makeStore, StoreUpdateProperties } from '@/core/utility/vue3'
import { removeFilter } from '@/core/utility/typescript'

type Store = {
  ignoreUpdateKeyList: string[];
  setIgnoreWatchKey: (...keys: string[]) => void;
  removeWatchKey: (...keys: (string | undefined)[]) => string[];
}

export default makeStore<Store>('ignoreUpdateKeyStore', () => {
  const state = reactive<StoreUpdateProperties<Store, never>>({
    ignoreUpdateKeyList: []
  })

  const setIgnoreWatchKey = (...keys: string[]) => {
    state.ignoreUpdateKeyList.push(...keys)
  }
  const removeWatchKey = (...removeKeys: (string | undefined)[]) =>
    state.ignoreUpdateKeyList.length ? removeFilter(state.ignoreUpdateKeyList, k => removeKeys.some(rk => rk === k)) : []

  return {
    get ignoreUpdateKeyList() {
      return state.ignoreUpdateKeyList
    },
    setIgnoreWatchKey,
    removeWatchKey
  }
})
