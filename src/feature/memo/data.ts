import { reactive } from 'vue'
import { commonStoreDataProcess, makeStore, StoreUpdateProperties } from '@/core/utility/vue3'
import { StoreData } from '@/core/utility/FileUtility'

export type Memo = {
  sample: boolean;
}

type Store = {
  ready: boolean,
  list: StoreData<Memo>[];
  requestData: () => Promise<void>;
  insertData: (...c: Memo[]) => Promise<void>;
}

export default makeStore<Store>('memo-store', () => {
  const state = reactive<StoreUpdateProperties<Store, never>>({
    ready: false,
    list: []
  })

  const { requestData, insertData } = commonStoreDataProcess(
    state.list,
    'memo',
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
