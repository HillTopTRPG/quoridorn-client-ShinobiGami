// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExcludedFunctionKeys<T> = { [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K }[keyof T];
export type ExcludeFunctionProperty<T> = Pick<T, ExcludedFunctionKeys<T>>;

export function makeNumberArray(length: number, start = 0): number[] {
  return [...Array(length)].map((_, i) => i + start)
}

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
