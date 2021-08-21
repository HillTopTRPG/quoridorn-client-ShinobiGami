import { io, Socket } from 'socket.io-client'
import { loadYaml } from '@/FileUtility'
import { errorDialog } from '@/Utility'
import { SystemError } from '@/error/SystemError'

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

export default class SocketFacade {
  private static _instance: SocketFacade | null = null;

  public static get instance(): SocketFacade {
    if (!SocketFacade._instance) throw new SystemError('Not yet init SocketFacade.')
    return SocketFacade._instance
  }

  private socket: Socket;
  public userKey: string | null = null;

  // コンストラクタの隠蔽
  private constructor(socket: Socket) {
    this.socket = socket
  }

  private static async connect(url: string): Promise<Socket> {
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

  public static async init(): Promise<void> {
    // 読み込み必須のためthrowは伝搬させる
    const connectInfo = await loadYaml<ConnectInfo>(
      'static/conf/connect.yaml'
    )

    let socket: Socket
    try {
      socket = await SocketFacade.connect(connectInfo.quoridornServer)
    } catch (err) {
      await errorDialog({
        title: '通信エラー',
        text: '有効なアプリケーションサーバに接続できませんでした。'
      })
      // TODO 処理中の解除
      throw err
    }

    SocketFacade._instance = new SocketFacade(socket)
  }

  public async destroy(): Promise<void> {
    this.socket.disconnect()
  }

  public async sendSocketServerRoundTripRequest<T, U>(event: string, args?: T): Promise<U> {
    return new Promise<U>((resolve, reject) => {
      this.socket.once(`result-${event}`, (err: Error, result: U) => {
        if (err) {
          errorDialog({ title: 'Server Error', text: err.message })
          reject(err)
          return
        }
        resolve(result)
      })
      this.sendSocketServerRequest<T>(event, args)
    })
  }

  public sendSocketServerRequest<T> (event: string, args?: T): void {
    this.socket.emit(event, args)
  }

  public async sendSocketClientRequest<T> (
    event: string,
    target: string[] | 'self' | 'room' | 'room-mate' | 'all',
    data?: T,
    error?: Error
  ): Promise<void> {
    this.sendSocketServerRequest<SendDataRequest<T>>('socket-api-emit-event', {
      event,
      target,
      error,
      data
    })
  }

  public socketOn<T> (
    event: string,
    callback: (err: Error, result: T) => void
  ): void {
    this.socket.on(event, (err: Error, result: T) => {
      // eslint-disable-next-line no-console
      if (err) console.error(err)
      callback(err, result)
    })
  }

  public socketOff(event: string): void {
    this.socket.off(event)
  }
}
