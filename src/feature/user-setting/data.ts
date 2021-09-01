import { reactive } from 'vue'
import { commonStoreDataProcess, makeStore, StoreUpdateProperties } from '@/core/utility/vue3'
import { StoreData } from '@/core/utility/FileUtility'
import UserStore from '@/core/data/user'
import { ApplicationError } from '@/core/error/ApplicationError'

export type UserSetting = {
  userName: string;
  fontColor: string;
  accent1Color: string;
  accent2Color: string;
  skillTableFontSize: number;
  ninjaArtsTableFontSize: number;
  backgroundTableFontSize: number;
  specialArtsTableFontSize: number;
  ninjaToolTableFontSize: number;
}

type Store = {
  ready: boolean,
  userSettingList: StoreData<UserSetting>[];
  userSetting: UserSetting | null;
  // getUserSetting(name?: string): Promise<StoreData<UserSetting>>;
  insertData: (...c: UserSetting[]) => Promise<void>;
  requestData: () => Promise<void>;
}

export default makeStore<Store>('user-setting-store', () => {
  const state = reactive<StoreUpdateProperties<Store, 'userSetting'>>({
    ready: false,
    userSettingList: []
  })

  const userStore = UserStore.injector()

  const { requestData, insertData } = commonStoreDataProcess(
    state.userSettingList,
    'user-setting',
    [
      'userName',
      'fontColor',
      'accent1Color',
      'accent2Color',
      'skillTableFontSize',
      'ninjaArtsTableFontSize',
      'backgroundTableFontSize',
      'specialArtsTableFontSize',
      'ninjaToolTableFontSize'
    ]
  )

  const setup = async (): Promise<void> => {
    const user = userStore.userList.find(u => u.key === userStore.userLoginResponse?.userKey)
    if (!user) throw new ApplicationError('You are not logged in yet.(2)')

    const getUserSetting = (): UserSetting | null => state.userSettingList.find(us => us.data?.userName === user.name)?.data || null

    await requestData()
    const userSetting = getUserSetting()
    if (userSetting) {
      state.ready = true
      return
    }
    await insertData({
      userName: user.name,
      accent1Color: 'rgba(255, 40, 0, 1)',
      accent2Color: 'rgba(0, 111, 255, 1)',
      fontColor: '#3E2723',
      skillTableFontSize: 11,
      ninjaArtsTableFontSize: 11,
      backgroundTableFontSize: 11,
      specialArtsTableFontSize: 11,
      ninjaToolTableFontSize: 11
    })
    let intervalId: number | null = null
    return new Promise((resolve) => {
      intervalId = window.setInterval(() => {
        if (getUserSetting()) {
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
    get userSettingList() {
      return state.userSettingList
    },
    get ready() {
      return state.ready
    },
    get userSetting() {
      const user = userStore.userList.find(u => u.key === userStore.userLoginResponse?.userKey)
      const userName = user?.name
      if (!userName) throw new ApplicationError('You are not logged in yet.(3)')
      const userSetting = state.userSettingList.find(us => us.data?.userName === userName)
      return userSetting?.data || null
    },
    requestData,
    insertData
  }
})
