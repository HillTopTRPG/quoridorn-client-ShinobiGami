import { StoreData } from '@/core/utility/FileUtility'
import LanguageManager from './LanguageManager'
import jsonp from 'jsonp'
import { errorDialog, successDialog } from '@/core/utility/dialog'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const urljoin = require('url-join')

export function getSrc(
  path: string
): { url: string; dataLocation: 'server' | 'direct' } {
  if (!path) return { url: path, dataLocation: 'direct' }
  if (path.startsWith('http')) return { url: path, dataLocation: 'direct' }
  if (path.startsWith('data:')) return { url: path, dataLocation: 'direct' }
  if (path.startsWith('.')) path = path.replace(/^\./, '')
  const protocol = window.location.protocol
  const host = window.location.host
  const baseUrl = process.env.BASE_URL
  const url = urljoin(protocol, host, baseUrl, path)
  return { url, dataLocation: 'server' }
}

export function shuffleOrder(list: StoreData<unknown>[]): void {
  for (let i = list.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1))
    const tmpOrder = list[i].order
    list[i].order = list[r].order
    list[r].order = tmpOrder
  }
}

/**
 * 文字列をクリップボードにコピーする
 *
 * @param text
 */
export function execCopy(text: string): boolean {
  const temp = document.createElement('div')

  temp.appendChild(document.createElement('pre')).textContent = text

  const s = temp.style
  s.position = 'fixed'
  s.left = '-100%'

  document.body.appendChild(temp)
  document.getSelection()?.selectAllChildren(temp)

  const result = document.execCommand('copy')

  document.body.removeChild(temp)
  // true なら実行できている falseなら失敗か対応していないか

  if (result) {
    const message = LanguageManager.instance.getText(
      'message.copy-to-clipboard'
    )
    successDialog({
      title: LanguageManager.instance.getText('message.success'),
      text: `${message}\n${text}`
    }).then()
  }

  return result
}

export async function getJsonByGet<T>(
  url: string,
  authorization?: string
): Promise<T> {
  const headers: HeadersInit = {}
  if (authorization !== undefined) {
    headers.Authorization = authorization
  }

  let result: Response
  try {
    result = await window.fetch(url, { method: 'GET', headers })
  } catch (err) {
    await errorDialog({
      title: 'Please specify a valid server URL.',
      text: `URL: ${url}`
    })
    throw err
  }

  const status = result.status
  if (status !== 200) {
    const errMsg = await result.text()
    console.log(`${status}: ${errMsg} [GET] ${url}`)
    if (
      status !== 401 ||
      (errMsg !== 'Expired token.' &&
        !errMsg.startsWith('Invalid token.') &&
        !errMsg.startsWith('Need token.'))
    ) {
      await errorDialog({
        title: status.toString(),
        text: errMsg
      })
    }
    throw new Error(`${status}: ${errMsg} [GET] ${url}`)
  }

  try {
    return await result.json() as T
  } catch (err) {
    await errorDialog({
      title: 'Please specify a valid server URL.',
      text: `URL: ${url}`
    })
    throw err
  }
}

export async function getJsonByJsonp<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    jsonp(url, { name: 'getJson', timeout: 500 }, (error: Error | null, data: unknown) => {
      if (error) reject(error)
      resolve(data as T)
    })
  })
}
