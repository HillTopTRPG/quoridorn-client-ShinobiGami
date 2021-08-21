import { UnwrapNestedRefs } from '@vue/reactivity'
import { reactive } from 'vue'

export function refObj<T>(obj: T): UnwrapNestedRefs<{ val: T }> {
  return reactive({ val: obj })
}
