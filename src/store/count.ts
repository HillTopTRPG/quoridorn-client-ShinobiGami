import { reactive } from 'vue'
import { ExcludeFunctionProperty, makeStore } from '@/utility/vue3'

type Store = {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export default makeStore<Store>('countStore', () => {
  const state = reactive<ExcludeFunctionProperty<Store>>({
    count: 0
  })
  return {
    get count() {
      return state.count
    },
    increment() {
      state.count += 1
    },
    decrement() {
      state.count -= 1
    }
  }
})
