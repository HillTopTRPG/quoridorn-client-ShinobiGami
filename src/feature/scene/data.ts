import { reactive } from 'vue'
import { commonStoreDataProcess, makeStore, StoreUpdateProperties } from '@/core/utility/vue3'
import { StoreData } from '@/core/utility/FileUtility'

export type Scene = {
  sample: boolean;
}

type Store = {
  ready: boolean,
  list: StoreData<Scene>[];
  requestData: () => Promise<void>;
  insertData: (...c: Scene[]) => Promise<void>;
}

export default makeStore<Store>('scene-store', () => {
  const state = reactive<StoreUpdateProperties<Store, never>>({
    ready: false,
    list: []
  })

  const { requestData, insertData } = commonStoreDataProcess(
    state.list,
    'scene',
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
