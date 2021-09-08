/**
 * 合計値を算出する
 *
 * @param list
 */
export function sum(list: number[]): number {
  return list.reduce((accumlator, current) => accumlator + current, 0)
}

/**
 * 平均を算出する
 *
 * @param list
 */
export function average(list: number[]): number | null {
  if (!list.length) return null
  return sum(list) / list.length
}

/**
 * クローンを生成する
 * @param obj
 */
export function clone<T>(obj: T | null): T | null {
  if (!obj) return obj
  return JSON.parse(JSON.stringify(obj)) as T
}

/**
 * 文字列を数値に変換する
 * 変換できない場合は null を返却する
 * @param str
 * @param radix
 */
export function convertNumberNull(
  str: string | null,
  radix = 10
): number | null {
  if (!str) return null
  str = str.trim().replace(/^\+/, '')
  if (radix === 16 && /^-?[0-9a-fA-F]+$/.test(str)) return parseInt(str, 16)
  if (radix === 10 && /^-?[0-9]+$/.test(str)) return parseInt(str, radix)
  if (radix === 10 && /^-?[0-9]*\.[0-9]+$/.test(str)) return parseFloat(str)
  return null
}

/**
 * 文字列を数値に変換する
 * 変換できない場合は 0 を返却する
 * @param str
 * @param radix
 */
export function convertNumberZero(
  str: string | null,
  radix = 10
): number {
  return convertNumberNull(str, radix) || 0
}

/**
 * 文字列をbooleanに変換する
 * 変換できない場合は false を返却する
 * @param str
 */
export function convertBooleanFalse(str: string | null): boolean {
  if (str === null) return false
  return str.toLowerCase() === 'true'
}
export function convertBooleanNull(str: string | null): boolean | null {
  if (str === null) return null
  if (str.toLowerCase() === 'true') return true
  if (str.toLowerCase() === 'false') return false
  return null
}

/**
 * リストから特定の要素を削除する
 *
 * @param list
 * @param filterFunc
 */
export function listDelete<T>(
  list: T[],
  filterFunc: (item: T, index: number) => boolean
): void {
  const deleteIndexList = list
    .map((item, index) => ({ item, index }))
    .filter(info => filterFunc(info.item, info.index))
    .map(info => info.index)
  deleteIndexList.sort((n1, n2) => {
    if (n1 > n2) return -1
    if (n1 < n2) return 1
    return 0
  })
  deleteIndexList.forEach(deleteIndex => list.splice(deleteIndex, 1))
}

/**
 * ゼロパディング処理
 *
 * @param num
 * @param length
 */
export function zeroPadding(num: number | string, length: number): string {
  return ('0'.repeat(length) + num).slice(-length)
}

/**
 * 拡張子を除去する
 *
 * @param fileName
 */
export function removeExt(fileName: string): string {
  const matchExt: string[] | null = fileName.match(/(.*)(?:\.([^.]+$))/)
  return matchExt ? matchExt[1] : fileName
}

/**
 * 拡張子を取得する
 *
 * @param fileName
 */
export function getExt(fileName: string): string {
  const matchExt: string[] | null = fileName.match(/[^.]+$/)
  return matchExt ? matchExt[0] : ''
}

/**
 * ファイル名を取得する
 *
 * @param url
 */
export function getFileName(url: string): string {
  const matchExt: string[] | null = url.match(/[^/]+$/)
  return matchExt ? matchExt[0] : ''
}

export function hoseiStr(n: number): string {
  return n > 0 ? `+${n}` : n.toString(10)
}
