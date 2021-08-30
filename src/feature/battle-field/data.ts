import { reactive } from 'vue'
import { commonStoreDataProcess, makeStore, StoreUpdateProperties } from '@/core/utility/vue3'
import { StoreData } from '@/core/utility/FileUtility'

export type BattleField = {
  sample: boolean;
}

type Store = {
  ready: boolean,
  list: StoreData<BattleField>[];
  requestData: () => Promise<void>;
  insertData: (...c: BattleField[]) => Promise<void>;
}

export default makeStore<Store>('battle-field-store', () => {
  const state = reactive<StoreUpdateProperties<Store, never>>({
    ready: true,
    list: []
  })

  const { requestData, insertData } = commonStoreDataProcess(
    state.list,
    'battle-field',
    [
      'sample'
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
    insertData
  }
})
