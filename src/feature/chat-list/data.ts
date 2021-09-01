import { reactive } from 'vue'
import { commonStoreDataProcess, makeStore, StoreUpdateProperties } from '@/core/utility/vue3'
import { StoreData } from '@/core/utility/FileUtility'

type DiceResult = {
  kind: 'normal' | 'tens_d10' | 'd9';
  sides: number;
  value: number;
};

export type BcdiceDiceRollResult = {
  text?: string;
  secret?: boolean;
  success?: boolean;
  failure?: boolean;
  critical?: boolean;
  fumble?: boolean;
  rands?: DiceResult[];
};

export type ChatStore = {
  type: 'system' | 'character' | 'user' | 'dice-roll' | 'dice-roll-scf';
  raw: string;
  tag: string[];
  tab: string;
  from: string;
  diceRollResult: string | null;
};

type Store = {
  ready: boolean,
  list: StoreData<ChatStore>[];
  requestData: () => Promise<void>;
  insertData: (...list: ChatStore[]) => Promise<void>;
  diceRoll: (command: string) => Promise<BcdiceDiceRollResult>;
}

export default makeStore<Store>('chat-list-store', () => {
  const state = reactive<StoreUpdateProperties<Store, never>>({
    ready: true,
    list: []
  })

  const { requestData, insertData } = commonStoreDataProcess(
    state.list,
    'chat-list',
    [
      'type',
      'raw',
      'tag'
    ]
  )

  const setup = async (): Promise<void> => {
    await requestData()
    state.ready = true
  }
  setup().then()

  return {
    get ready() {
      return state.ready
    },
    get list() {
      return state.list
    },
    requestData,
    insertData,
    diceRoll: async (command: string): Promise<BcdiceDiceRollResult> => {
      const baseUrl = 'https://bcdice.onlinesession.app'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const json: any = await (await fetch(`${baseUrl}/v2/game_system/ShinobiGami/roll?command=${encodeURIComponent(command)}`)).json()
      console.log(JSON.stringify(json, null, '  '))

      if (!json.ok) throw json
      delete json.ok

      json.text = json.text.replace(/(^: )/g, '').replace(/＞/g, '→')

      return json as BcdiceDiceRollResult
    }
  }
})
