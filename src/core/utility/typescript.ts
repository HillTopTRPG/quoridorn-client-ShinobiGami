import { StoreData } from '@/core/utility/FileUtility'

export type PickPropTypeKeys<T, U> = Exclude<{ [K in keyof T]: T[K] extends U ? K : never }[keyof T], undefined>;
export type ExcludePropTypeKeys<T, U> = Exclude<{ [K in keyof T]: T[K] extends U ? never : K }[keyof T], undefined>;

export type PickPropType<T, U> = Pick<T, PickPropTypeKeys<T, U>>;
export type ExcludePropType<T, U> = Pick<T, ExcludePropTypeKeys<T, U>>;

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export function makeNumberArray(length: number, start = 0): number[] {
  return [...Array(length)].map((_, i) => i + start)
}

export function clone<T>(d: T): T { return JSON.parse(JSON.stringify(d)) as T }
export function compare<T>(d1: T, d2: T): boolean { return JSON.stringify(d1) === JSON.stringify(d2) }

export function omit<T extends { /**/ }, U extends keyof T>(src: T, ...omitKeys: U[]): Omit<T, U> {
  const keys = Object.keys(src) as (keyof T)[]
  return keys.reduce((dst, key) => {
    if ((omitKeys as (keyof T)[]).some(k => k === key)) return dst
    return {
      ...dst,
      [key]: src[key]
    }
  }, {}) as Omit<T, U>
}

export function pick<T extends { /**/ }, U extends keyof T>(src: T, ...pickKeys: U[]): Pick<T, U> {
  const keys = Object.keys(src) as (keyof T)[]
  return keys.reduce((dst, key) => {
    if ((pickKeys as (keyof T)[]).some(k => k === key)) {
      return {
        ...dst,
        [key]: src[key]
      }
    }
    return dst
  }, {}) as Pick<T, U>
}

type ObjIndex<T> = { data: T; index: number }
export function removeFilter<T>(list: (T)[], filterFunc: (d: T) => boolean): T[] {
  return list
    .map((data, idx): ObjIndex<T> => ({ data, index: filterFunc(data) ? idx : -1 }))
    .filter(info => info.index > -1)
    .sort((i1, i2) => i1.index < i2.index ? 1 : i2.index < i1.index ? -1 : 0)
    .map(info => {
      list.splice(info.index, 1)
      return info.data
    })
}

export interface HtmlEvent<T = EventTarget> {
  target: T;
}

export function replaceArrayElements(
  list: unknown[],
  targetIdx: number,
  sourceIdx: number
): unknown[] {
  const cloneArray = [...list];
  [cloneArray[targetIdx], cloneArray[sourceIdx]] = [
    list[sourceIdx],
    list[targetIdx]
  ]
  return cloneArray
}

export function setOrderByListOrder(dataList: StoreData<unknown>[]): void {
  const orderList: number[] = dataList.map(data => data.order)
  orderList.sort()
  dataList.forEach((data, idx) => (data.order = orderList[idx]))
}
