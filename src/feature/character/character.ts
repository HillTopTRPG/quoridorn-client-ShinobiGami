import { reactive } from 'vue'
import { makeStore, commonStoreDataProcess, StoreUpdateProperties } from '@/core/utility/vue3'
import { StoreData } from '@/core/utility/FileUtility'
import { Shinobigami } from '@/core/utility/shinobigami'

export type Character = {
  type: 'character';
  plot: number;
  pcNo: number;
  isFumble: boolean;
  isActed: boolean;
  color: string;
  sheetInfo: Shinobigami;
}

type Store = {
  ready: boolean,
  characterList: StoreData<Character>[];
  insertData: (...c: Character[]) => Promise<void>;
  requestData: () => Promise<void>;
}

export default makeStore<Store>('characterStore', () => {
  const state = reactive<StoreUpdateProperties<Store, never>>({
    ready: false,
    characterList: []
  })

  const { requestData, insertData } = commonStoreDataProcess(
    state.characterList,
    'character',
    [
      'type',
      'plot',
      'pcNo',
      'isFumble',
      'isActed',
      'color',
      'sheetInfo'
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
    get characterList() {
      return state.characterList
    },
    requestData,
    insertData
  }
})
