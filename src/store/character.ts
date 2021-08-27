import { reactive } from 'vue'
import { ExcludeFunctionProperty, makeStore, commonStoreDataProcess } from '@/utility/vue3'
import { StoreData } from '@/utility/FileUtility'
import { Shinobigami } from '@/components/the-play/ope-part/shinobigami'

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
  characterList: StoreData<Character>[];
  insertData: (...c: Character[]) => Promise<void>;
  requestData: () => Promise<void>;
}

export default makeStore<Store>('characterStore', () => {
  console.log('character makeStore')

  const state = reactive<ExcludeFunctionProperty<Store>>({
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

  return {
    get characterList() {
      return state.characterList
    },
    requestData,
    insertData
  }
})
