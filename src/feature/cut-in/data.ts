import { reactive } from 'vue'
import { commonStoreDataProcess, makeStore, StoreUpdateProperties } from '@/core/utility/vue3'
import { StoreData } from '@/core/utility/FileUtility'

export type CutIn = {
  sample: boolean;
}

type Store = {
  ready: boolean,
  list: StoreData<CutIn>[];
  requestData: () => Promise<void>;
  insertData: (...c: CutIn[]) => Promise<void>;
}

export default makeStore<Store>('cut-in-store', () => {
  const state = reactive<StoreUpdateProperties<Store, never>>({
    ready: false,
    list: []
  })

  const { requestData, insertData } = commonStoreDataProcess(
    state.list,
    'cut-in',
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
