import { reactive, ref } from 'vue'
import SocketFacade, { AddDirectRequest } from '@/utility/SocketFacade'
import { ExcludeFunctionProperty, makeStore, makeStoreDataWatch } from '@/utility/vue3'
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
  addCharacterForTest: (...c: Character[]) => Promise<void>;
  requestData: () => Promise<void>;
}

export default makeStore<Store>('characterStore', () => {
  const state = reactive<ExcludeFunctionProperty<Store>>({
    characterList: []
  })
  const ready = ref(false)
  console.log('character makeStore')
  makeStoreDataWatch(state.characterList, 'name', 'type', 'color', 'isFumble', 'pcNo', 'plot', 'isActed')

  SocketFacade.instance.socketOn<StoreData<Character>>('notify-update-data', (err, payload) => {
    if (err) {
      console.error(err)
      return
    }
    if (payload.collection !== 'character') return
    if (!ready.value) {
      console.warn('!!WARNING!!WARNING!!WARNING!!WARNING!!WARNING!!')
      console.warn('notify-insert-dataを読み飛ばした！！！！！！')
    }
    const index = state.characterList.findIndex(r => r.key === payload.key)
    if (index < 0) return
    state.characterList.splice(index, 1, payload)
  })

  SocketFacade.instance.socketOn<StoreData<Character>>('notify-insert-data', (err, payload) => {
    if (err) {
      console.error(err)
      return
    }
    if (payload.collection !== 'character') return
    if (!ready.value) {
      console.warn('!!WARNING!!WARNING!!WARNING!!WARNING!!WARNING!!')
      console.warn('notify-insert-dataを読み飛ばした！！！！！！')
    }
    const list = [payload]
    console.log('notify-insert-data', list.length)
    list.forEach(upData => {
      const index = state.characterList.findIndex(r => r.key === upData.key)
      if (index > -1) {
        state.characterList.splice(index, 1, upData)
      } else {
        const insertIndex = state.characterList.findIndex(r => upData.order < r.order)
        if (insertIndex === -1) {
          state.characterList.push(upData)
        } else {
          state.characterList.splice(insertIndex, 0, upData)
        }
      }
    })
  })

  return {
    get characterList() {
      return state.characterList
    },
    requestData: async () => {
      state.characterList.splice(0, state.characterList.length, ...await SocketFacade.instance.sendSocketServerRoundTripRequest<string, StoreData<Character>[]>(
        'db-api-get',
        'character'
      ))
      ready.value = true
    },
    addCharacterForTest: async (...list): Promise<void> => {
      console.log('addCharacterForTest')
      const result = await SocketFacade.instance.sendSocketServerRoundTripRequest<AddDirectRequest<Character>, string[]>(
        'db-api-insert',
        {
          collectionSuffix: 'character',
          share: 'room',
          force: true,
          list: list.map(data => ({ data }))
        }
      )
      console.log(result)
      // state.characterList.push(...list.map((c): StoreData<Character> => ({
      //   key: uuidV4(),
      //   collection: '',
      //   createDateTime: 0,
      //   order: 0,
      //   owner: null,
      //   ownerType: null,
      //   permission: null,
      //   refList: [],
      //   status: 'added',
      //   updateDateTime: Date.now(),
      //   data: c
      // })))
    }
  }
})
