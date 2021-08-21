import { computed, ComputedRef } from '@vue/reactivity'
import * as common from '../types/common.d'
import { SlotUnionInfo } from '@/types/common'

export function getSlotNameList(data: common.SlotUnionInfo): string[] {
  const resultList: string[] = []
  if (data.layout === 'v-box' || data.layout === 'h-box') {
    if (data.slotName) resultList.push(data.slotName)
    else if (data.blockList) {
      resultList.push(
        ...data.blockList.flatMap((block: SlotUnionInfo) => getSlotNameList(block))
      )
    }
  } else if (data.layout === 'tab') {
    data.tabList.forEach(tab => {
      if (tab.slotName) resultList.push(tab.slotName)
      else if (tab.blockList) {
        resultList.push(
          ...tab.blockList.flatMap((block: SlotUnionInfo) => getSlotNameList(block))
        )
      }
    })
  }
  return resultList
}

export function useChangedBy(data: common.SampleData): {
  changedBy: ComputedRef<string>
  increment: (arg: Event | number) => void
  decrement: (arg: Event | number) => void
  reset: () => void
} {
  const changedBy = computed(() => {
    if (!data.message.action) return 'initialized'
    return `${data.message.action} ${data.message.amount || ''}`.trim()
  })

  const increment = (arg: Event | number): void => {
    const amount = (typeof arg !== 'number') ? 1 : arg
    data.counter += amount
    data.message.action = 'incremented by'
    data.message.amount = amount
  }
  const decrement = (arg: Event | number): void => {
    const amount = (typeof arg !== 'number') ? 1 : arg
    data.counter -= amount
    data.message.action = 'decremented by'
    data.message.amount = amount
  }
  const reset = (): void => {
    data.counter = data.initCounter
    data.message.action = 'reset'
    data.message.amount = null
  }

  return {
    changedBy,
    increment,
    decrement,
    reset
  }
}
