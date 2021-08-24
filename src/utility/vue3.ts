import { inject, InjectionKey, provide, computed, watch } from 'vue'
import { ComputedRef } from '@vue/reactivity'
import { clone, compare, ExcludePropType, removeFilter } from '@/utility/typescript'
import { StoreData } from '@/utility/FileUtility'
import IgnoreWatchUpdateKeyStore from '@/store/ignore-watch-update-key'
import SocketFacade from '@/utility/SocketFacade'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComputedObject<T> = { [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : ComputedRef<T[K]> }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExcludeFunctionProperty<T> = ExcludePropType<T, (...args: any[]) => any>;

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

type DiffInfo<T> = {
  n: Partial<StoreData<Partial<T>>> & { key: string },
  o: Partial<StoreData<Partial<T>>> & { key: string }
}

function outputDiffContents(diffInfoList: DiffInfo<unknown>[]) {
  diffInfoList.map(d => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reportObj: any = { key: d.n.key }
    Object.keys(d.n).forEach((k) => {
      if (k === 'key') return
      if (k === 'data') {
        if (d.n.data !== undefined) {
          reportObj.data = {}
          Object.keys(d.n.data).forEach((dk) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            reportObj.data[dk] = `${(d.o.data as any)[dk]} -> ${(d.n.data as any)[dk]}`
          })
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        reportObj[k] = `${JSON.stringify((d.o as any)[k])} -> ${JSON.stringify((d.n as any)[k])}`
      }
    })
    return reportObj
  }).forEach(r => (console.log('diff', JSON.stringify(r, null, '  '))))
}

export type UpdateDataRequest<T> = {
  collectionSuffix: string;
  share: 'room' | 'room-mate';
  list: (Partial<StoreData<Partial<T>>> & { key: string })[];
};

export function makeStoreDataWatch<T, U extends keyof T>(
  dataList: StoreData<T>[],
  ...dataProperties: U[]
): void {
  const { removeWatchKey } = IgnoreWatchUpdateKeyStore.injector()
  watch(() => clone(dataList), (newList, oldList) => {
    // if (removeWatchKey(n.key).length) return false
    const diffInfoList = getWatchDiffForDbUpdate(
      newList,
      oldList,
      ['order', 'owner', 'ownerType', 'permission'],
      dataProperties
    )
    // 削除もここでは無視（削除用のサーバーAPIを叩くことで削除すること！）
    const ignoreKeyList = removeWatchKey(...diffInfoList.map(d => d.n.key))
    removeFilter(diffInfoList, d => ignoreKeyList.includes(d.n.key || ''))

    if (diffInfoList.length) {
      (async () => {
        SocketFacade.instance.sendSocketServerRoundTripRequest<UpdateDataRequest<T>, never>(
          'db-api-update',
          {
            collectionSuffix: newList[0].collection,
            share: 'room-mate',
            list: diffInfoList.map(d => d.n)
          }
        )
      })()
      outputDiffContents(diffInfoList)
    }
  }, { deep: true, immediate: false })
}

export function getWatchDiffForDbUpdate<T, U extends keyof StoreData<T>, V extends keyof T>(
  newList: StoreData<T>[],
  oldList: StoreData<T>[],
  storeDataPropertyList: U[],
  dataPropertyList: V[]
): DiffInfo<T>[] {
  const diffInfoList: DiffInfo<T>[] = []
  newList
    .forEach(n => {
      const o = oldList.find(o => o.key === n.key)
      if (!o) return false // 追加は無視（追加用のサーバーAPIを叩くことで追加すること！）
      const diffN: Partial<StoreData<Partial<T>>> & { key: string } = { key: n.key }
      const diffO: Partial<StoreData<Partial<T>>> & { key: string } = { key: o.key }
      let count = 0
      storeDataPropertyList.forEach(p => {
        if (n[p] !== undefined && o[p] !== undefined && n[p] !== o[p] && !compare(n[p], o[p])) {
          diffN[p] = n[p]
          diffO[p] = o[p]
          count++
        }
      })
      dataPropertyList.forEach(p => {
        if (n.data !== undefined && o.data !== undefined && n.data[p] !== o.data[p] && !compare(n.data[p], o.data[p])) {
          if (diffN.data === undefined) diffN.data = {}
          if (diffO.data === undefined) diffO.data = {}
          diffN.data[p] = n.data[p]
          diffO.data[p] = o.data[p]
          count++
        }
      })
      if (count) {
        diffInfoList.push({ n: diffN, o: diffO })
      }
    })
  return diffInfoList
}
