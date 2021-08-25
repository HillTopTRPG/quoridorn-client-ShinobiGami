import { reactive } from 'vue'
import { ExcludeFunctionProperty, makeStore, commonStoreDataProcess } from '@/utility/vue3'
import { StoreData } from '@/utility/FileUtility'

export type Character = {
  name: string;
  type: 'character';
  pcNo: number;
  plot: number;
  isFumble: boolean;
  isActed: boolean;
  color: string;
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
      'name',
      'type',
      'color',
      'isFumble',
      'pcNo',
      'plot',
      'isActed'
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
