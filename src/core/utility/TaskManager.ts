import { ApplicationError } from '@/core/error/ApplicationError'
import uuid from 'uuid'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const taskDeclareJsonList = require('./task.yaml')

type StatusList = string[]

interface TaskDeclare {
  isIgniteWithParam: boolean
  isLastValueCapture: boolean
  isTraceFinally: boolean
  isTest: boolean
  statusList: StatusList
}

interface TaskInput<T> {
  type: string
  owner: string
  to?: string[]
  value: T | null
}

interface Task<T> extends TaskDeclare, TaskInput<T> {
  readonly key: string
  status: string
}

type TaskResult<U> = {
  nextStatus?: string
  value?: U
}

type TaskProcess<T, U> = (
  task: Task<T>,
  param: unknown,
  processorRemover: () => void
) => Promise<TaskResult<U>>

type TaskListenerContainer = Map<string, Map<string, TaskProcess<unknown, unknown>[]>>

type TaskListenerParameterContainer = Map<string, unknown>

interface TaskDeclareJson {
  types: string[]
  taskAttribute: TaskDeclare
}

// const taskDeclareJsonList: TaskDeclareJson[] = require("./task.yaml")

// export type MouseMoveParam = {
//   key: string
//   type: string | null
//   pieceKey?: string
// }

export default class TaskManager {
  // シングルトン
  private static _instance: TaskManager
  public static get instance (): TaskManager {
    if (!TaskManager._instance) TaskManager._instance = new TaskManager()
    return TaskManager._instance
  }

  // コンストラクタの隠蔽
  private constructor () { /**/ }

  private readonly taskStore: Map<string, Task<unknown>[]> = new Map<string, Task<unknown>[]>()
  private readonly taskListener: TaskListenerContainer = new Map<string, Map<string, TaskProcess<unknown, unknown>[]>>()
  private readonly taskParam: TaskListenerParameterContainer = new Map<string, unknown>()
  private readonly taskLastValue: Map<string, unknown> = new Map<string, unknown>()
  private readonly taskDeclareJsonList: TaskDeclareJson[] = taskDeclareJsonList

  public getTask (
    type: string,
    target?: string | number
  ): Task<unknown> | null {
    const list = this.taskStore.get(type)
    if (!list) return null
    if (target) {
      if (typeof target === 'string') return list.find(obj => obj.key === target) || null
      else return list[target]
    } else {
      return list[0]
    }
  }

  /**
   * タスクリスナーを追加する
   * @param type
   * @param process
   * @param key
   */
  public addTaskListener (
    type: string,
    process: TaskProcess<unknown, unknown>,
    key: string
  ): void {
    let processContainer = this.taskListener.get(type)
    if (!processContainer) {
      processContainer = new Map<string, TaskProcess<unknown, unknown>[]>()
      this.taskListener.set(type, processContainer)
    }

    let processList = processContainer.get(type)
    if (!processList) {
      processList = []
      processContainer.set(key, processList)
    }

    processList.push(process)
  }

  /**
   * タスクリスナーを削除する
   * @param type
   * @param key
   */
  public removeTaskListener (type: string, key?: string): void {
    if (key) {
      const m = this.taskListener.get(type)
      m?.delete(key)
      if (m?.size) return
    }
    this.taskListener.delete(type)
  }

  /**
   * タスクパラメータを設定する
   * @param type
   * @param param
   */
  public setTaskParam (type: string, param: unknown): void {
    this.taskParam.set(type, param)
  }

  /**
   * タスクの最後の値を取得する（タスク登録時にオプションを指定しないとundefinedになる）
   * @param type
   */
  public getLastValue<T> (type: string): T {
    return this.taskLastValue.get(type) as T
  }

  /**
   * タスク実行
   * @param taskInput タスク情報
   */
  public async ignition<T, U> (
    taskInput: TaskInput<T>
  ): Promise<U[] | null> {
    const taskKey: string = uuid.v4()
    const taskDeclareJson = this.taskDeclareJsonList.find(tdj =>
      tdj.types.some((t: string) => t === taskInput.type)
    )
    if (!taskDeclareJson) {
      throw new ApplicationError(`No such declare. task='${taskInput.type}'`)
    }
    const taskDeclare = taskDeclareJson.taskAttribute
    if (!taskDeclare) {
      throw new ApplicationError(`Illegal task.yaml. task='${taskInput.type}'`)
    }
    if (taskDeclare.isLastValueCapture) {
      this.taskLastValue.set(taskInput.type, JSON.parse(
        JSON.stringify(taskInput.value)
      ))
    }

    // 一定時間以上放置されたタスクを警告する
    const timeoutID = window.setTimeout(() => {
      console.warn(`🐧💢${taskInput.type}`)
    }, 300)

    const task: Task<T> = {
      ...taskInput,
      ...taskDeclare,
      key: taskKey,
      status: taskDeclare.statusList[0]
    }
    let taskList = this.taskStore.get(taskInput.type)
    if (!taskList) {
      taskList = []
      this.taskStore.set(taskInput.type, taskList)
    }
    taskList.push(task)
    const result = await this.process<T, U>(task)
    clearTimeout(timeoutID)
    this.dequeTask(taskInput.type, taskKey)

    return result
  }

  private dequeTask (type: string, taskKey: string): void {
    const list = this.taskStore.get(type)
    if (!list) return
    const index = list.findIndex(task => task.key === taskKey)
    if (index < 0) return
    list.splice(index, 1)
  }

  private async process<T, U> (task: Task<T>): Promise<U[] | null> {
    const resultList = await this.callProcess<T, U>(task)

    // 受け取った次のステータスの中で最も進んでいるものを採用
    let nextStatusIndex = -1
    let processResult: U[] = []
    if (resultList && resultList.length) {
      const useStatusList: string[] = resultList
        .filter(result => result?.nextStatus)
        .map(result => result.nextStatus) as string[]
      if (useStatusList.length) {
        nextStatusIndex = Math.max(
          ...useStatusList.map((nextStatus: string) =>
            task.statusList.findIndex(
              (status: string) => status === nextStatus
            )
          )
        )
      }
      processResult = resultList
        .filter(result => result?.value)
        .map(result => result.value) as U[]
    }

    const nextStatus = task.statusList[
      nextStatusIndex === -1
        ? task.statusList.findIndex(status => status === task.status) + 1
        : nextStatusIndex
    ]

    // 最終ステータスに到達するまでステータスを進めながら呼び出していく
    if (nextStatus) {
      task.status = nextStatus
      return await this.process<T, U>(task)
    } else {
      // 最終ステータスの処理が終わった
      return processResult
    }
  }

  private async callProcess<T, U> (
    task: Task<T>
  ): Promise<TaskResult<U>[] | null> {
    const eventName = `${task.type}-${task.status}`
    const logText = `🐧💣${eventName}`

    // 登録された処理の呼び出し
    const param: unknown = this.taskParam.get(eventName)
    if (task.isIgniteWithParam && !param) {
      // パラメータ必須タスクでパラメータがないため実施しない
      if (task.isTest) console.log(`${logText}🏷️🈚`)
      return null
    }
    const processContainer = this.taskListener.get(eventName)
    const processList: TaskProcess<unknown, unknown>[] =
      processContainer && processContainer.size
        ? Array.from(processContainer.values()).flatMap(x => x)
        : []
    if (!processList || !processList.length) {
      // 登録された処理がない
      if (task.isTest) console.log(`${logText}🈳`)
      return null
    }

    if (task.isTest) {
      console.warn(
        `${logText}💥`,
        task.value,
        '🏷️' + (param ? '' : '️🈚'),
        param || ''
      )
    }
    const processRemover = (taskProcess: TaskProcess<unknown, unknown>) => () => {
      const index: number = processList.findIndex(process => process === taskProcess)
      processList.splice(index, 1)
    }
    const promiseList: Promise<TaskResult<unknown>>[] = processList.map(taskProcess =>
      taskProcess(task, param, processRemover(taskProcess))
    )

    // 登録された処理を全部非同期実行する
    return (await Promise.all(promiseList)) as TaskResult<U>[]
  }
}
