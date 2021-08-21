import { inject, InjectionKey, provide, computed } from 'vue'
import { ComputedRef } from '@vue/reactivity'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComputedObject<T> = { [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : ComputedRef<T[K]> }

export function makeStore<T>(storeName: string, f: () => T): {
  provider: () => void,
  injector: () => ComputedObject<T>
} {
  const StoreInjectionKey: InjectionKey<ReturnType<() => T>> = Symbol(storeName)
  return {
    provider: () => {
      provide(StoreInjectionKey, f())
    },
    injector: () => {
      const store = inject(StoreInjectionKey)
      if (!store) throw new Error(`Not yet provide ${storeName}.`)
      return makeComputedObject<T>(store)
    }
  }
}

function makeComputedObject<T extends { /**/ }>(src: T): ComputedObject<T> {
  const keys = Object.keys(src) as (keyof T)[]
  return keys.reduce((dst, key) => {
    if (typeof src[key] === 'function') {
      return {
        ...dst,
        [key]: src[key]
      }
    } else {
      return {
        ...dst,
        [key]: computed(() => src[key])
      }
    }
  }, {}) as ComputedObject<T>
}
