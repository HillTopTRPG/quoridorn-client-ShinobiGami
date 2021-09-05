import { ApplicationError } from '@/core/error/ApplicationError'
import yaml from 'js-yaml'

/**
 * 権限対象の種別
 */
type PermissionNodeType = 'group' | 'actor' | 'owner'

/**
 * 権限対象1件の表現
 */
type PermissionNode = {
  type: PermissionNodeType
  key?: string
}

/**
 * 権限のルールタイプ
 */
type PermissionRuleType = 'none' | 'allow' | 'deny'

/**
 * 権限のルール単位の表現
 */
type PermissionRule = {
  type: PermissionRuleType
  list: PermissionNode[]
}

export type DataReference = {
  type: string
  key: string
}

/**
 * 表示・編集・権限編集の3種の権限の集合体。
 * これがDBデータ1件ごとに設定される
 */
type Permission = {
  view: PermissionRule
  edit: PermissionRule
  chmod: PermissionRule
}

export type StoreData<T> = {
  collection: string
  key: string
  order: number
  ownerType: string | null
  owner: string | null // 部屋データに含まれるデータのオーナー。部屋データにはオーナーは存在しない
  permission: Permission | null // 通常はnullではない
  status:
    | 'initial-touched'
    | 'added'
    | 'modify-touched'
    | 'touched-released'
    | 'modified'
    | null
  createDateTime: number
  updateDateTime: number
  refList: DataReference[] // このデータへの参照
  data?: T
}

type Size = {
  width: number
  height: number
}

export type ExportDataFormat<T> = {
  type: string
  version: string
  data: T
}

export function createSize(width: number, height: number): Size {
  return { width, height }
}

/**
 * テキストファイルをロードする
 *
 * @param path
 */
export async function loadText(
  path: string
): Promise<string> {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}${path}?version=${process.env.VUE_APP_VERSION}`
    )
    return await response.text()
  } catch (err) {
    throw new ApplicationError(`textファイルの読み込みに失敗しました：${path}`)
  }
}

export function unicodeEscape(str: string): string {
  let code = ''
  const head: { [key: number]: string } = {
    1: '\\u000',
    2: '\\u00',
    3: '\\u0',
    4: '\\u'
  }
  return str.replace(/[^./a-zA-Z0-9]/g, function (c) {
    return head[(code = c.charCodeAt(0).toString(16)).length] + code
  })
}

/**
 * Yamlファイルをロードする
 *
 * @param path
 */
export async function loadYaml<T>(path: string): Promise<T> {
  let text: string
  try {
    text = await loadText(path)
  } catch (err) {
    throw new ApplicationError(
      `yamlファイルが存在しませんでした。 path:${path}`
    )
  }
  try {
    return yaml.load(text) as unknown as T
  } catch (err) {
    throw new ApplicationError(`yaml形式が壊れています。 path:${path}`)
  }
}

/**
 * Jsonファイルをロードする
 *
 * @param path
 */
export async function loadJson<T>(path: string): Promise<T> {
  try {
    const text = await loadText(path)
    return JSON.parse(text)
  } catch (err) {
    throw new ApplicationError(
      `jsonファイルの読み込みに失敗しました path:${path}`
    )
  }
}

export async function getImageSize(path: string): Promise<Size | null> {
  const loadImage = async (): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = e => reject(e)
      img.src = path
    })
  }
  try {
    const res = await loadImage()
    return createSize(res.width, res.height)
  } catch (e) {
    return null
  }
}

async function showOpenFileDialog(): Promise<File | null> {
  return new Promise(resolve => {
    const input: HTMLInputElement = document.createElement('input')
    input.type = 'file'
    input.accept = '.json, text/plain'
    input.onchange = () => {
      resolve(input.files ? input.files[0] : null)
    }
    input.click()
  })
}

async function readAsText(file: File | null): Promise<string | null> {
  return new Promise(resolve => {
    if (!file) return null
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = () => {
      resolve(String(reader.result))
    }
  })
}

export async function readJsonFiles<T>(fileList: File[]): Promise<T[]> {
  return (await Promise.all(fileList.map(f => readAsText(f))))
    .filter((t): t is string => Boolean(t))
    .map(t => JSON.parse(t)) as T[]
}

/**
 * Jsonファイルをインポートする
 *
 * @param type
 */
export async function importJson<T>(
  type: string
): Promise<ExportDataFormat<T> | null> {
  const file = await showOpenFileDialog()
  const text = await readAsText(file)
  if (!text) return null
  try {
    const obj: ExportDataFormat<T> = JSON.parse(text)
    return obj.type === type ? obj : null
  } catch (err) {
    return null
  }
}

/**
 * Textファイルをインポートする
 */
export async function importText(): Promise<string | null> {
  const file = await showOpenFileDialog()
  return await readAsText(file)
}

/**
 * テキストファイルをセーブする
 *
 * @param name
 * @param text
 */
export function saveText(name: string, text: string): void {
  const blob = new Blob([text], {
    type: 'text/plain'
  })
  saveFile(`${name}.txt`, blob)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function createJsonBlob(type: string, payload: any): Blob {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saveData: ExportDataFormat<any> = {
    version: process.env.VUE_APP_VERSION,
    type,
    data: payload
  }
  return new Blob([JSON.stringify(saveData, null, '  ')], {
    type: 'application/json'
  })
}

/**
 * Jsonファイルをセーブする
 *
 * @param name
 * @param type
 * @param data
 */
export function saveJson<T>(name: string, type: string, data: T): void {
  saveFile(`${name}.json`, createJsonBlob(type, data))
}

/**
 * HTMLファイルをセーブする
 *
 * @param name
 * @param text
 */
export function saveHTML(name: string, text: string): void {
  const blob = new Blob([text], {
    type: 'text/html'
  })
  saveFile(`${name}.html`, blob)
}

/**
 * 適当ファイルをセーブする
 *
 * @param name
 * @param blob
 */
export function saveFile(name: string, blob: Blob): void {
  const url = URL.createObjectURL(blob)

  const anchor = document.createElement('a')
  anchor.download = name
  anchor.href = url
  anchor.click()
}

export function getUrlParam(
  name: string,
  url: string = window.location.href
): string | null {
  name = name.replace(/[[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/(\+)|(¥%20)/g, ' '))
}

export function getYoutubeThunbnail(url: string): string {
  return `https://i.ytimg.com/vi/${getUrlParam('v', url)}/default.jpg`
}

export function getFileName(url: string): string {
  const matchExt: string[] | null = url.match(/[^/]+$/)
  return matchExt ? matchExt[0] : ''
}

export function extname(path: string): string {
  return path.replace(/^.+\./, '')
}

export async function blob2ArrayBuffer(blob: Blob | File | null): Promise<ArrayBuffer | null> {
  if (!blob) return null
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const fr = new FileReader()
    fr.readAsArrayBuffer(blob)
    fr.onload = () => {
      resolve(fr.result as ArrayBuffer)
    }
    fr.onerror = err => {
      reject(err)
    }
  })
}

export async function file2Base64(file: File | null): Promise<string | null> {
  if (!file) return null
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result?.toString() || null)
    reader.onerror = error => reject(error)
    reader.readAsDataURL(file)
  })
}
