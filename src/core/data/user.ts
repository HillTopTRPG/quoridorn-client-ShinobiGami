import { reactive } from 'vue'
import { makeStore, StoreUpdateProperties } from '@/core/utility/vue3'
import { RoomInfoExtend } from '@/core/data/room'
import SocketStore from '@/core/data/socket'

export type UserType = 'gm' | 'pl' | 'visitor';

export type UserLoginRequest = {
  name: string;
  password: string;
  type?: UserType;
};

export type UserLoginResponse = {
  userKey: string;
  token: string;
}

export type DataReference = {
  type: string | null;
  key: string | null;
}

export type CreateRoomRequest = {
  roomPassword: string;
  name: string;
  bcdiceServer: string;
  bcdiceVersion: string;
  system: string;
  extend?: RoomInfoExtend; // 一時的措置
  roomCreatePassword?: string;
}

export type RoomLoginRequest = {
  roomNo: number;
  roomPassword: string;
}

export type ClientUserData = {
  key?: string;
  refList: DataReference[];
  name: string;
  type: UserType;
  login: number;
}

type Store = {
  userList: ClientUserData[];
  selfUser: ClientUserData | null;
  selectedRoomNo: number,
  lastRoomLoginType: 'create' | 'login' | 'touch' | '',
  userLoginResponse: UserLoginResponse | null;
  createRoom: (roomNo: number, roomName: string, roomPassword: string) => Promise<void>;
  touchRoom: (roomNo: number) => Promise<void>;
  selectRoom: (roomNo: number) => Promise<void>;
  loginRoom: (roomNo: number, roomPassword: string) => Promise<void>;
  loginUser: (userName: string, userType: UserType, userPassword: string) => Promise<void>;
}

export default makeStore<Store>('userStore', () => {
  const state = reactive<StoreUpdateProperties<Store, 'selfUser'>>({
    userList: [],
    selectedRoomNo: 0,
    lastRoomLoginType: '',
    userLoginResponse: null
  })

  const socketStore = SocketStore.injector()

  socketStore.socketOn<ClientUserData>('notify-user-update', (err, payload) => {
    if (err) {
      console.error(err)
      return
    }
    const index = state.userList.findIndex(r => r.name === payload.name)
    if (index < 0) {
      state.userList.push(payload)
    } else {
      state.userList.splice(index, 1, payload)
    }
  })

  return {
    get userList() {
      return state.userList
    },
    get selfUser() {
      return state.userList.find(u => u.key === state.userLoginResponse?.userKey) || null
    },
    get selectedRoomNo() {
      return state.selectedRoomNo
    },
    get lastRoomLoginType() {
      return state.lastRoomLoginType
    },
    get userLoginResponse() {
      return state.userLoginResponse
    },
    touchRoom: async (roomNo: number): Promise<void> => {
      // 部屋作成準備
      try {
        await socketStore.sendSocketServerRoundTripRequest<number, string>('room-api-touch-room', roomNo)
      } catch (err) {
        console.error(err)
        return
      }
      state.userList.splice(0, state.userList.length)
      state.userLoginResponse = null
      state.selectedRoomNo = roomNo
      state.lastRoomLoginType = 'touch'
    },
    createRoom: async (roomNo: number, roomName: string, roomPassword: string): Promise<void> => {
      // 部屋作成
      const crReq: CreateRoomRequest = {
        name: roomName,
        system: 'ShinobiGami',
        bcdiceServer: 'https://bcdice.onlinesession.app',
        bcdiceVersion: 'v3',
        roomPassword: roomPassword
      }
      state.userList.splice(0, state.userList.length, ...await socketStore.sendSocketServerRoundTripRequest<CreateRoomRequest,
        ClientUserData[]>('room-api-create-room', crReq))
      state.userList.splice(0, state.userList.length)
      state.userLoginResponse = null
      state.selectedRoomNo = roomNo
      state.lastRoomLoginType = 'create'
    },
    selectRoom: async (roomNo: number) => {
      // 入室準備
      state.userList.splice(0, state.userList.length)
      state.userLoginResponse = null
      state.selectedRoomNo = roomNo
      state.lastRoomLoginType = ''
    },
    loginRoom: async (roomNo: number, roomPassword: string) => {
      // 入室
      const crReq: RoomLoginRequest = {
        roomNo: roomNo,
        roomPassword: roomPassword
      }
      state.userList.splice(0, state.userList.length, ...await socketStore.sendSocketServerRoundTripRequest<RoomLoginRequest,
        ClientUserData[]>('room-api-login-room', crReq))
      state.userLoginResponse = null
      state.lastRoomLoginType = 'login'
    },
    loginUser: async (userName: string, userType: UserType, userPassword: string): Promise<void> => {
      // 入室
      const crReq: UserLoginRequest = {
        type: userType,
        name: userName,
        password: userPassword
      }
      state.userLoginResponse = await socketStore.sendSocketServerRoundTripRequest<UserLoginRequest, UserLoginResponse>('room-api-login-user', crReq)
    }
  }
})
