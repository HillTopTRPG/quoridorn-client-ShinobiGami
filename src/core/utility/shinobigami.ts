import {
  createEmotion, createTokugi,
  outputTokugiChatPalette, Personality, SaikoroFictionTokugi
} from '@/core/utility/SaikoroFiction'
import { TrpgSystemHelper } from '@/core/utility/TrpgSystemHelper'

type Haikei = {
  name: string;
  type: string;
  point: string;
  effect: string;
};

type SpecialArts = {
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

export type Ninpou = {
  secret: boolean;
  name: string;
  type: string;
  targetSkill: string;
  range: string;
  cost: string;
  effect: string;
  page: string;
};

export type Shinobigami = {
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
  ninpouList: Ninpou[]; // 忍法
  personalityList: Personality[]; // 人物欄
  scenario: {
    handout: string;
    mission: string;
    name: string;
    pcno: string;
  };
  backgroundList: Haikei[]; // 背景
  specialArtsList: SpecialArts[]; // 奥義
  ninjaToolList: NinjaTool[]; // 忍具
  tokugi: SaikoroFictionTokugi; // 特技
};

export class ShinobigamiHelper extends TrpgSystemHelper<Shinobigami> {
  public readonly isSupportedOtherText = true;
  public readonly isSupportedChatPalette = true;

  public constructor(url: string) {
    super(
      url,
      /https?:\/\/character-sheets\.appspot\.com\/shinobigami\/.+\?key=([^&]+)/,
      'https://character-sheets.appspot.com/shinobigami/display?ajax=1&key={key}'
    )
  }

  /**
   * このシステムに対応しているキャラシのURLかどうかを判定する
   * @return true: 対応したキャラシである, false: 対応したキャラシではない
   */
  public async isThis(): Promise<boolean> {
    return this.urlRegExp.test(this.url)
  }

  /**
   * チャットパレットの情報を生成する
   */
  public async createChatPalette(): Promise<
    {
      name: string;
      paletteText: string;
    }[]
    > {
    const { data } = await this.createResultList<string>()
    if (!data) return []

    return [
      {
        name: `◆${data.characterName}`,
        paletteText: [
          '2D6',
          '2D6>=',
          ...outputTokugiChatPalette(data.tokugi),
          'ST (無印)シーン表',
          'FT ファンブル表',
          'ET 感情表',
          'KWT 変調表',
          'RTT ランダム特技決定表',
          'D66',
          'choice[〇〇,△△,□□]',
          '',
          '兵糧丸を１つ使用',
          '兵糧丸を１つ獲得',
          '神通丸を１つ使用',
          '神通丸を１つ獲得',
          '遁甲符を１つ使用',
          '遁甲符を１つ獲得',
          ...data.ninpouList
            .flatMap(n => [
              '',
              `【${n.name}】《${n.targetSkill}》ｺｽﾄ：${n.cost ||
                'なし'}／間合:${n.range || 'なし'}`,
              `効果:${n.effect}`
            ])
            .map(text => text.replaceAll(/\r?\n/g, ''))
        ].join('\n')
      }
    ]
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getData(): Promise<{ json: any; data: Shinobigami | null; }> {
    const json = await this.getJsonData('jsonp', this.url)
    const data = this.createData(json)
    return {
      json, data
    }
  }

  /**
   * JSONPから取得した生データから処理用のデータを生成する
   * @param json JSONPから取得した生データ
   * @protected
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  protected createData(json: any): Shinobigami | null {
    if (!json) return null
    const textFilter = (text: string | null) => {
      if (!text) return ''
      return text.trim().replace(/\r?\n/g, '\n')
    }
    return {
      url: this.url,
      playerName: textFilter(json.base.player),
      characterName: textFilter(json.base.name),
      characterNameKana: textFilter(json.base.nameKana),
      regulation: textFilter(json.base.regulation),
      foe: textFilter(json.base.foe),
      exp: textFilter(json.base.exp),
      memo: textFilter(json.base.memo),
      upperStyle: upperStyleDict[json.base.upperstyle] || '',
      subStyle: textFilter(json.base.substyle),
      level: textFilter(json.base.level),
      age: textFilter(json.base.age),
      sex: textFilter(json.base.sex),
      cover: textFilter(json.base.cover),
      belief: textFilter(json.base.belief),
      stylerule: textFilter(json.base.stylerule),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ninpouList: (json.ninpou as any[]).map(n => ({
        secret: !!n.secret,
        name: textFilter(n.name),
        type: textFilter(n.type),
        targetSkill: textFilter(n.targetSkill),
        range: textFilter(n.range),
        cost: textFilter(n.cost),
        effect: textFilter(n.effect),
        page: textFilter(n.page)
      })),
      personalityList: createEmotion(json),
      scenario: {
        handout: textFilter(json.scenario.handout),
        mission: textFilter(json.scenario.mission),
        name: textFilter(json.scenario.name),
        pcno: textFilter(json.scenario.pcno)
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      backgroundList: (json.background as any[]).map(b => ({
        name: textFilter(b.name),
        type: textFilter(b.type),
        point: b.point || '0',
        effect: textFilter(b.effect)
      })),
      tokugi: createTokugi(
        json,
        tokugiTable,
        true,
        false,
        false
      ),
      specialArtsList: [],
      ninjaToolList: []
    }
  }
}

// const gapColList = [
//   { spaceIndex: 5, colText: '器術' },
//   { spaceIndex: 0, colText: '体術' },
//   { spaceIndex: 1, colText: '忍術' },
//   { spaceIndex: 2, colText: '謀術' },
//   { spaceIndex: 3, colText: '戦術' },
//   { spaceIndex: 4, colText: '妖術' }
// ]

const upperStyleDict: { [key: string]: string } = {
  a: '斜歯忍軍',
  ab: '鞍馬神流',
  bc: 'ハグレモノ',
  cd: '比良坂機関',
  de: '私立御斎学園',
  e: '隠忍の血統'
}

export const tokugiTable: string[][] = [
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
