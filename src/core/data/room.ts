import { reactive } from 'vue'
import SocketStore from '@/core/data/socket'
import { makeNumberArray } from '@/core/utility/typescript'
import { makeStore, StoreUpdateProperties } from '@/core/utility/vue3'

export type WindowSetting =
  | 'not-use' // 使えなくします
  | 'free' // 特に指定はありません
  | 'init-view' // 入室時に表示します
  | 'always-open'; // 常に開いています。閉じることはできません。

export type WindowSettings = {
  chat: WindowSetting;
  initiative: WindowSetting;
  'chat-palette': WindowSetting;
  'counter-remocon': WindowSetting;
};

export type RoomInfoExtend = {
  visitable: boolean; // 見学許可
  isFitGrid: boolean; // マップオブジェクトをセルに自動調整するか
  isViewDice: boolean; // ダイスを表示するか
  isViewCutIn: boolean; // カットインを表示するか
  isDrawGridId: boolean; // マップ座標を表示するか
  mapRotatable: boolean; // マップを回転させるか
  isShowStandImage: boolean; // 立ち絵を表示するか,
  standImageGridNum: number; // 立ち絵を表示する位置の数
  isShowRotateMarker: boolean; // マップオブジェクトの回転マーカーを表示するか
  windowSettings: WindowSettings;
};

export type ClientRoomDataStatus = 'none' | 'initial-touched' | 'added' | 'modified'
export type ClientRoomDataDetail = {
  roomName: string;
  loggedIn: number;
  memberNum: number;
  extend?: RoomInfoExtend;
}
export type ClientRoomData = {
  roomNo: number;
  status: ClientRoomDataStatus;
  operator: string; // socket.id
  createDateTime: number;
  updateDateTime: number;
  detail: ClientRoomDataDetail | null
}

export type GetRoomListResponse = {
  roomList: ClientRoomData[] | null;
  maxRoomNo: number;
  appServerInfo: {
    title: string;
    descriptions: string[];
    termsOfUse: string;
  };
  isNeedRoomCreatePassword: boolean;
};

type Store = {
  roomList: ClientRoomData[];
  maxRoomNo: number;
  serverName: string;
  serverDescription: string[];
  termsOfUse: string;
  isNeedRoomCreatePassword: boolean;
}

export default makeStore<Store>('roomStore', () => {
  const roomListRaw: ClientRoomData[] = []
  const state = reactive<StoreUpdateProperties<Store, never>>({
    roomList: roomListRaw,
    maxRoomNo: -1,
    serverName: '',
    serverDescription: [],
    termsOfUse: '',
    isNeedRoomCreatePassword: false
  })

  const socketStore = SocketStore.injector();

  (async () => {
    console.log('部屋一覧取得開始')
    // 部屋一覧を取得
    const result = await socketStore.sendSocketServerRoundTripRequest<string, GetRoomListResponse>(
      'room-api-get-room-list',
      '0.0.1'
    )
    state.serverName = result.appServerInfo.title
    state.serverDescription = result.appServerInfo.descriptions.map(d =>
      d
        .replace('<', '&lt;')
        .replace('>', '&gt;')
        .replace(/\[([^"<>\]]+)]\(([^)"<>]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    )
    state.maxRoomNo = result.maxRoomNo
    state.termsOfUse = result.appServerInfo.termsOfUse
    state.isNeedRoomCreatePassword = result.isNeedRoomCreatePassword
    if (!result.roomList) {
      // TODO バージョン依存性NGパターン
    } else {
      const roomList = result.roomList
      // eslint-disable-next-line no-console
      state.roomList.splice(0, state.roomList.length, ...makeNumberArray(state.maxRoomNo, 1)
        .map((roomNo): ClientRoomData => {
          const obj: ClientRoomData = {
            roomNo,
            status: 'none' as ClientRoomDataStatus,
            operator: '',
            createDateTime: -1,
            updateDateTime: -1,
            detail: null
          }
          return roomList.find(r => r.roomNo === roomNo) || obj
        }))
      socketStore.socketOn<ClientRoomData>('notify-room-update', (err, payload) => {
        if (err) {
          console.error(err)
          return
        }
        const index = state.roomList.findIndex(r => r.roomNo === payload.roomNo)
        if (index < 0) return
        state.roomList.splice(index, 1, payload)
      })
      socketStore.socketOn<number[]>('notify-room-delete', (err, roomNoList) => {
        if (err) {
          console.error(err)
          return
        }
        state.roomList
          .map((r, idx): { idx: number; roomNo: number } => ({
            idx,
            roomNo: roomNoList.some(rn => rn === r.roomNo) ? r.roomNo : -1
          }))
          .filter(({ roomNo }) => roomNo > -1)
          .forEach(({ idx, roomNo }) => {
            state.roomList.splice(idx, 1, {
              roomNo,
              status: 'none' as ClientRoomDataStatus,
              operator: '',
              createDateTime: -1,
              updateDateTime: -1,
              detail: null
            })
          })
      })
      console.log('room store is ready.')
    }
  })()

  return {
    get roomList() {
      return state.roomList
    },
    get serverName() {
      return state.serverName
    },
    get maxRoomNo() {
      return state.maxRoomNo
    },
    get serverDescription() {
      return state.serverDescription
    },
    get termsOfUse() {
      return state.termsOfUse
    },
    get isNeedRoomCreatePassword() {
      return state.isNeedRoomCreatePassword
    }
  }
})
