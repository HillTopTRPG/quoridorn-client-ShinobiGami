import {
  createEmotion,
  createTokugi,
  Personality,
  SaikoroFictionTokugi
} from '@/core/utility/SaikoroFiction'
import { convertNumberZero } from '@/core/utility/PrimaryDataUtility'
import { getJsonByGet, getJsonByJsonp } from '@/core/utility/Utility'

export type Background = {
  name: string;
  type: string;
  point: string;
  effect: string;
};

export type SpecialArts = {
  name: string;
  skill: string;
  effect: string;
  direction: string;
}

export type NinjaTool = {
  name: string;
  count: number;
  effect: string;
}

export type NinjaArts = {
  secret: boolean;
  name: string;
  type: string;
  targetSkill: string;
  range: string;
  cost: string;
  effect: string;
  page: string;
};

export type ShinobiGami = {
  url: string;
  playerName: string;
  characterName: string;
  characterNameKana: string;
  regulation: string;
  foe: string;
  exp: string;
  memo: string;
  upperStyle: string;
  subStyle: string;
  level: string;
  age: string;
  sex: string;
  cover: string;
  belief: string;
  stylerule: string;
  ninjaArtsList: NinjaArts[]; // 忍法
  personalityList: Personality[]; // 人物欄
  scenario: {
    handout: string;
    mission: string;
    name: string;
    pcno: string;
  };
  backgroundList: Background[]; // 背景
  specialArtsList: SpecialArts[]; // 奥義
  ninjaToolList: NinjaTool[]; // 忍具
  skill: SaikoroFictionTokugi; // 特技
};

export class ShinobigamiHelper {
  protected readonly url: string;
  protected readonly sheetViewPass: string;
  protected readonly urlRegExp: RegExp;
  protected readonly jsonpUrlFormat: string;
  protected readonly jsonpUrlSecretFormat: string;

  public constructor(url: string, sheetViewPass: string) {
    this.url = url
    this.sheetViewPass = sheetViewPass
    this.urlRegExp = /https?:\/\/character-sheets\.appspot\.com\/shinobigami\/.+\?key=([^&]+)/
    this.jsonpUrlFormat = 'https://character-sheets.appspot.com/shinobigami/display?ajax=1&key={key}'
    this.jsonpUrlSecretFormat = 'https://character-sheets.appspot.com/shinobigami/openSecret?ajax=1&key={key}&pass={sheetViewPass}'
  }

  /**
   * このシステムに対応しているキャラシのURLかどうかを判定する
   * @return true: 対応したキャラシである, false: 対応したキャラシではない
   */
  public isThis(): boolean {
    return this.urlRegExp.test(this.url)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getData(): Promise<{ jsons: any[] | null; data: ShinobiGami | null; }> {
    const jsons = await this.getJsonData()
    const data = this.createData(jsons)
    return {
      jsons, data
    }
  }

  /**
   * JSONPで対象のURLのデータを取得する
   * @param url 省略された場合はコンストラクタに引き渡されたURLが利用される
   * @param type jsonp or get 省略された場合は jsonp
   * @protected
   * @return JSONPの生データ
   */
  private async getJsonData(
    type: 'jsonp' | 'get' = 'jsonp',
    url: string = this.url
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any[] | null> {
    try {
      const matchResult = url.match(this.urlRegExp)
      const key = matchResult ? matchResult[1] : null
      const jsonUrl = this.jsonpUrlFormat
        .replace('{key}', key || '')
      const jsonSecretUrl = this.jsonpUrlSecretFormat
        .replace('{key}', key || '')
        .replace('{sheetViewPass}', this.sheetViewPass || '')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const results: any[] = []
      results.push(type === 'jsonp' ? await getJsonByJsonp(jsonUrl) : await getJsonByGet(jsonUrl))
      results.push(type === 'jsonp' ? await getJsonByJsonp(jsonSecretUrl) : await getJsonByGet(jsonSecretUrl))
      return results
    } catch (err) {
      return null
    }
  }

  /**
   * JSONPから取得した生データから処理用のデータを生成する
   * @param jsons JSONPから取得した生データ
   * @protected
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  private createData(jsons: any[] | null): ShinobiGami | null {
    if (!jsons) return null
    const textFilter = (text: string | null) => {
      if (!text) return ''
      return text.trim().replace(/\r?\n/g, '\n')
    }
    return {
      url: this.url,
      playerName: textFilter(jsons[0].base.player),
      characterName: textFilter(jsons[0].base.name),
      characterNameKana: textFilter(jsons[0].base.nameKana),
      regulation: textFilter(jsons[0].base.regulation),
      foe: textFilter(jsons[0].base.foe),
      exp: textFilter(jsons[0].base.exp),
      memo: textFilter(jsons[0].base.memo),
      upperStyle: upperStyleDict[jsons[0].base.upperstyle] || '',
      subStyle: textFilter(jsons[0].base.substyle),
      level: textFilter(jsons[0].base.level),
      age: textFilter(jsons[0].base.age),
      sex: textFilter(jsons[0].base.sex),
      cover: textFilter(jsons[0].base.cover),
      belief: textFilter(jsons[0].base.belief),
      stylerule: textFilter(jsons[0].base.stylerule),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ninjaArtsList: (jsons[1].ninpou as any[]).map(n => ({
        secret: !!n.secret,
        name: textFilter(n.name),
        type: textFilter(n.type),
        targetSkill: textFilter(n.targetSkill),
        range: textFilter(n.range),
        cost: textFilter(n.cost),
        effect: textFilter(n.effect),
        page: textFilter(n.page)
      })),
      personalityList: createEmotion(jsons[0]),
      scenario: {
        handout: textFilter(jsons[0].scenario.handout),
        mission: textFilter(jsons[0].scenario.mission),
        name: textFilter(jsons[0].scenario.name),
        pcno: textFilter(jsons[0].scenario.pcno)
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      backgroundList: (jsons[0].background as any[]).map(b => ({
        name: textFilter(b.name),
        type: textFilter(b.type),
        point: b.point || '0',
        effect: textFilter(b.effect)
      })),
      skill: createTokugi(
        jsons[0],
        SkillTable,
        true,
        false,
        false
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      specialArtsList: jsons[1].specialEffect.map((s: any) => ({
        name: textFilter(s.name),
        skill: textFilter(s.skill),
        effect: textFilter(s.effect),
        direction: textFilter(s.explain)
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ninjaToolList: jsons[1].item.map((t: any) => ({
        name: textFilter(t.name),
        effect: textFilter(t.effect),
        count: convertNumberZero(t.count)
      }))
    }
  }
}

const upperStyleDict: { [key: string]: string } = {
  a: '斜歯忍軍',
  ab: '鞍馬神流',
  bc: 'ハグレモノ',
  cd: '比良坂機関',
  de: '私立御斎学園',
  e: '隠忍の血統'
}

export const SkillTable: string[][] = [
  ['絡繰術', '騎乗術', '生存術', '医術', '兵糧術', '異形化'],
  ['火術', '砲術', '潜伏術', '毒術', '鳥獣術', '召喚術'],
  ['水術', '手裏剣術', '遁走術', '罠術', '野戦術', '死霊術'],
  ['針術', '手練', '盗聴術', '調査術', '地の利', '結界術'],
  ['仕込み', '身体操術', '腹話術', '詐術', '意気', '封術'],
  ['衣装術', '歩法', '隠形術', '対人術', '用兵術', '言霊術'],
  ['縄術', '走法', '変装術', '遊芸', '記憶術', '幻術'],
  ['登術', '飛術', '香術', '九ノ一の術', '見敵術', '瞳術'],
  ['拷問術', '骨法術', '分身の術', '傀儡の術', '暗号術', '千里眼の術'],
  ['壊器術', '刀術', '隠蔽術', '流言の術', '伝達術', '憑依術'],
  ['掘削術', '怪力', '第六感', '経済力', '人脈', '呪術']
]
