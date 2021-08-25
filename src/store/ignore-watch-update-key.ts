import { reactive } from 'vue'
import { ExcludeFunctionProperty, makeStore } from '@/utility/vue3'
import { removeFilter } from '@/utility/typescript'

type Store = {
  ignoreUpdateKeyList: string[];
  setIgnoreWatchKey: (...keys: string[]) => void;
  removeWatchKey: (...keys: (string | undefined)[]) => string[];
}

export default makeStore<Store>('ignoreUpdateKeyStore', () => {
  const state = reactive<ExcludeFunctionProperty<Store>>({
    ignoreUpdateKeyList: []
  })

  const setIgnoreWatchKey = (...keys: string[]) => {
    state.ignoreUpdateKeyList.push(...keys)
  }
  const removeWatchKey = (...removeKeys: (string | undefined)[]) =>
    removeFilter(state.ignoreUpdateKeyList, k => removeKeys.some(rk => rk === k))

  return {
    get ignoreUpdateKeyList() {
      return state.ignoreUpdateKeyList
    },
    setIgnoreWatchKey,
    removeWatchKey
  }
})
