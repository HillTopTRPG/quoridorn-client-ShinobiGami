import { createI18n, I18n, useI18n } from 'vue-i18n'
import { loadYaml } from './FileUtility'
import TaskManager from './TaskManager'

export function listToEmpty (list: Array<unknown>): void {
  list.splice(0, list.length)
}

type LangInfo = {
  lang: string;
  path: string;
};

type Message = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [lang: string]: any;
};

export type SupportLangInfo = {
  lang: string;
  title: string;
  isDefault?: boolean;
};

export const supportLangList: SupportLangInfo[] = []

export default class LanguageManager {
  // シングルトン
  public static get instance (): LanguageManager {
    if (!LanguageManager._instance) { LanguageManager._instance = new LanguageManager() }
    return LanguageManager._instance
  }

  private static _instance: LanguageManager;
  private messages: Message = {};

  // コンストラクタの隠蔽
  private constructor () { /**/ }

  private async loadLanguage(langInfo: LangInfo) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.messages[langInfo.lang] = await loadYaml<any>(langInfo.path)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.toString())
    }
  }

  public set language(locale: string) {
    const { locale: l } = useI18n()
    l.value = locale
    TaskManager.instance
      .ignition<never, never>({
        type: 'language-change',
        owner: 'Quoridorn',
        value: null
      })
      .then()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  public getText (target: string, arg?: any): string {
    const { t } = useI18n()
    return t(target, arg)
  }

  public static get defaultLanguage(): string {
    const langInfo = supportLangList.find(l => l.isDefault)
    return langInfo ? langInfo.lang : navigator.language
  }

  public async init(): Promise<I18n<Message, unknown, unknown, true>> {
    // 読み込み必須のためthrowは伝搬させる
    const supportLangInfo = await loadYaml<SupportLangInfo[]>(
      'static/lang/support-lang-list.yaml'
    )
    listToEmpty(supportLangList)
    supportLangList.push(...supportLangInfo)

    // loadLanguageを直列の非同期で全部実行する
    await supportLangList
      .map((langInfo: SupportLangInfo) => () =>
        this.loadLanguage({
          lang: langInfo.lang,
          path: `static/lang/${langInfo.lang}.yaml`
        })
      )
      .reduce((prev, curr) => prev.then(curr), Promise.resolve())

    const r = createI18n({
      locale: navigator.language,
      fallbackLocale: 'en',
      messages: this.messages
    })
    r.global.locale = navigator.language
    return r
  }
}
