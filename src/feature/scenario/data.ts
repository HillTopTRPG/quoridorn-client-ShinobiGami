import { reactive } from 'vue'
import { commonStoreDataProcess, makeStore, StoreUpdateProperties } from '@/core/utility/vue3'
import { StoreData } from '@/core/utility/FileUtility'
import { ShinobiGamiScenario } from '@/core/utility/shinobigamiScenario'
import { ApplicationError } from '@/core/error/ApplicationError'

export type Scenario = {
  url: string;
  sheetViewPass: string;
  sheetInfo: ShinobiGamiScenario;
}

type Store = {
  ready: boolean,
  list: StoreData<Scenario>[];
  currentIndex: number;
  requestData: () => Promise<void>;
  insertData: (...c: Scenario[]) => Promise<void>;
  currentScenario: Scenario;
}

export default makeStore<Store>('scenario-store', () => {
  const state = reactive<StoreUpdateProperties<Store, 'currentScenario'>>({
    ready: false,
    currentIndex: 0,
    list: []
  })

  const { requestData, insertData } = commonStoreDataProcess(
    state.list,
    'scenario',
    [
      'url',
      'sheetViewPass',
      'sheetInfo'
    ]
  )

  const setup = async (): Promise<void> => {
    await requestData()
    if (state.list.length) {
      state.ready = true
      return
    }
    await insertData({
      url: '',
      sheetViewPass: '',
      sheetInfo: {
        base: {
          author: '',
          boss: {
            name: '',
            secret: false
          },
          limit: '',
          name: '',
          num: '',
          menace: '',
          menacePC: '',
          publicview: false,
          scene: '',
          seq1: false,
          seq2: false,
          seq3: false,
          type1: false,
          type2: false,
          type3: false,
          type4: false,
          stage: ''
        },
        npc: [],
        pc: [],
        enigma: [],
        characters: [],
        prize: [],
        righthand: [],
        summary: []
      }
    })
    let intervalId: number | null = null
    return new Promise((resolve) => {
      intervalId = window.setInterval(() => {
        if (state.list.length) {
          if (intervalId !== null) {
            window.clearInterval(intervalId)
            intervalId = null
            state.ready = true
            resolve()
          }
        }
      }, 50)
    })
  }
  setup().then()

  return {
    get ready() {
      return state.ready
    },
    get currentIndex() {
      return state.currentIndex
    },
    get list() {
      return state.list
    },
    get currentScenario() {
      const scenario = state.list[state.currentIndex]?.data || null
      if (!scenario) {
        throw new ApplicationError('Not found scenario error.')
      }
      return scenario
    },
    requestData,
    insertData
  }
})
