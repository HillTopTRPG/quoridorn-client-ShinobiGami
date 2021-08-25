import { reactive, ref } from 'vue'
import { ExcludeFunctionProperty, makeStore } from '@/utility/vue3'
import { loadYaml, StoreData } from '@/utility/FileUtility'
import { io, Socket } from 'socket.io-client'
import { errorDialog } from '@/utility/Utility'

type ConnectInfo = {
  quoridornServer: string;
  bcdiceServer: string;
  skywayApiKey: string;
  skywayConnectType: string;
  socketTimeout: number;
};

export type SendDataRequest<T> = {
  target: string[] | 'self' | 'room' | 'room-mate' | 'all';
  event: string;
  data?: T;
  error?: Error;
};

export type AddDirectRequest<T> = {
  collectionSuffix: string;
  share: 'room' | 'room-mate';
  list: (Partial<StoreData<T>> & { data: T })[];
  force: boolean;
};

export type Store = {
  status: 'connecting' | 'ready' | 'error';
  userKey: string;
  destroy: () => void,
  sendSocketServerRoundTripRequest: <T, U>(event: string, args?: T) => Promise<U>;
  sendSocketServerRequest: <T>(event: string, args?: T) => void;
  sendSocketClientRequest: <T>(
    event: string,
    target: string[] | 'self' | 'room' | 'room-mate' | 'all',
    data?: T,
    error?: Error
  ) => Promise<void>;
  socketOn: <T>(
    event: string,
    callback: (err: Error, result: T) => void
  ) => void;
  socketOff: (event: string) => void;
}

export default makeStore<Store>('socketStore', () => {
  const state = reactive<ExcludeFunctionProperty<Store>>({
    userKey: '',
    status: 'connecting'
  })
  const socket = ref<Socket | null>(null)

  const connect = async (url: string): Promise<Socket> => {
    const socket = io(url)

    socket.on('connect', async () => {
      console.log('socket connected.')
    })
    socket.on('reconnecting', async () => {
      console.log('socket reconnecting.')
    })

    return new Promise((resolve, reject) => {
      socket.on('error', async (err) => {
        console.error('socket error', err)
        await errorDialog({ title: 'Socket Error', text: err.message })
        reject(err)
      })
      socket.on('connect_error', async (err) => {
        console.error('socket connect_error', err)
        await errorDialog({ title: 'Socket Connect Error', text: err.message })
        reject(err)
      })
      socket.on('connect_timeout', async reason => {
        console.error('socket connect_timeout', reason)
        await errorDialog({ title: 'Socket Connect Timeout', text: reason.message })
        reject(reason)
      })
      socket.on('server-ready', (err, payload) => {
        if (err) {
          console.error(err)
          reject(err)
        }
        console.log('server is ready!!!!!.')
        console.log(payload)
        resolve(socket)
      })
    })
  }

  (async (): Promise<void> => {
    // 読み込み必須のためthrowは伝搬させる
    const connectInfo = await loadYaml<ConnectInfo>(
      'static/conf/connect.yaml'
    )

    try {
      socket.value = await connect(connectInfo.quoridornServer)
      state.status = 'ready'
    } catch (err) {
      await errorDialog({
        title: '通信エラー',
        text: '有効なアプリケーションサーバに接続できませんでした。'
      })
      // TODO 処理中の解除
      state.status = 'error'
      throw err
    }
  })()

  const destroy = (): void => {
    socket.value?.disconnect()
    socket.value?.close()
  }

  const sendSocketServerRoundTripRequest = async <T, U>(event: string, args?: T): Promise<U> => {
    return new Promise<U>((resolve, reject) => {
      socket.value?.once(`result-${event}`, (err: Error, result: U) => {
        if (err) {
          errorDialog({ title: 'Server Error', text: err.message })
          reject(err)
          return
        }
        resolve(result)
      })
      sendSocketServerRequest<T>(event, args)
    })
  }

  const sendSocketServerRequest = <T> (event: string, args?: T): void => {
    socket.value?.emit(event, args)
  }

  const sendSocketClientRequest = async <T> (
    event: string,
    target: string[] | 'self' | 'room' | 'room-mate' | 'all',
    data?: T,
    error?: Error
  ): Promise<void> => {
    sendSocketServerRequest<SendDataRequest<T>>('socket-api-emit-event', {
      event,
      target,
      error,
      data
    })
  }

  const socketOn = <T> (
    event: string,
    callback: (err: Error, result: T) => void
  ): void => {
    socket.value?.on(event, (err: Error, result: T) => {
      // eslint-disable-next-line no-console
      if (err) console.error(err)
      callback(err, result)
    })
  }

  const socketOff = (event: string): void => {
    socket.value?.off(event)
  }

  return {
    get status() { return state.status },
    get userKey() { return state.userKey },
    destroy,
    sendSocketServerRoundTripRequest,
    sendSocketServerRequest,
    sendSocketClientRequest,
    socketOn,
    socketOff
  }
})
