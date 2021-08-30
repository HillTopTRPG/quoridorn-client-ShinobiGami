import { reactive } from 'vue'
import { commonStoreDataProcess, makeStore, StoreUpdateProperties } from '@/core/utility/vue3'
import { StoreData } from '@/core/utility/FileUtility'

export type Scenario = {
  sample: boolean;
}

type Store = {
  ready: boolean,
  list: StoreData<Scenario>[];
  requestData: () => Promise<void>;
  insertData: (...c: Scenario[]) => Promise<void>;
}

export default makeStore<Store>('scenario-store', () => {
  const state = reactive<StoreUpdateProperties<Store, never>>({
    ready: true,
    list: []
  })

  const { requestData, insertData } = commonStoreDataProcess(
    state.list,
    'scenario',
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
