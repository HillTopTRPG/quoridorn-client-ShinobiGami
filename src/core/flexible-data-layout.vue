<template>
  <div class="slot-input-form">
    <slot />
    <suspense>
      <flexible-union-layout
        :definition="definition"
        :barList="barList"
        @tab-changed="_tab => $emit('tabChanged', _tab)"
        @open-tab-setting="_tabKey => $emit('openTabSetting', _tabKey)"
      >
        <template v-for="slotName in slotNameList" v-slot:[slotName]>
          <slot :name="slotName"></slot>
        </template>
      </flexible-union-layout>
    </suspense>
    <div
      class="bar"
      v-for="b in barList"
      :key="b.blockKey"
      :style="b.layout"
      :class="[b.direction, mouse.key === b.blockKey ? 'active' : '']"
      @mousedown="moveStart($event, b.blockKey)"
      @touchstart="moveStart($event, b.blockKey)"
      @touchmove="mouseMove"
      @mouseup="moveEnd"
      @touchend="moveEnd"
      @touchcancel="moveEnd"
    ></div>
    <div
      class="mouse-sensor"
      @mousemove="mouseMove"
      @touchmove="mouseMove"
      @mouseup="moveEnd"
      @touchend="moveEnd"
      @touchcancel="moveEnd"
      :class="[barList.find(b => b.blockKey === mouse.key)?.direction, barActive ? 'active' : '']"
    >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, onMounted, ref } from 'vue'
import { ComputedRef, UnwrapNestedRefs } from '@vue/reactivity'
import { convertNumberZero } from '@/core/utility/PrimaryDataUtility'

export type UiSize = {
  em?: number;
  rem?: number;
  px?: number;
  vw?: number;
  vh?: number;
  vmin?: number;
  vmax?: number;
  percent?: number;
};

export type TabInfo = {
  key: string;
  text: string;
  flex?: number;
  isDisabled: boolean;
  target:
    | string
    | {
    from: number;
    to: number;
  };
};

// eslint-disable-next-line no-use-before-define
export type SlotUnionInfo = SlotFlexInfo | SlotTabInfo;

type SlotBase = {
  key: string;
  layout: 'h-box' | 'v-box';
  slotName?: string;
  dynamicSize?: boolean;
  dynamicBarV?: 'none' | 'before' | 'after';
  dynamicBarH?: 'none' | 'before' | 'after';
  flex?: number;
  blockList?: SlotUnionInfo[];
}

export function uiSize2css(size: UiSize): string {
  const sizeCalc = [
    size.em ? `${size.em}em` : '',
    size.rem ? `${size.rem}rem` : '',
    size.px ? `${size.px}px` : '',
    size.vw ? `${size.vw}vw` : '',
    size.vh ? `${size.vh}vh` : '',
    size.vmin ? `${size.vmin}vmin` : '',
    size.vmax ? `${size.vmax}vmax` : '',
    size.percent ? `${size.percent}%` : ''
  ].filter(s => Boolean(s)).join(' + ')
  return `calc(${sizeCalc})`
}

export type BarInfo = {
  side: 'before' | 'after';
  direction: 'v' | 'h';
  blockKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  layout: any
}

export function updateBarList(
  data: SlotUnionInfo,
  barInfoList: UnwrapNestedRefs<BarInfo[]>,
  ignoreUpdateKey?: string
): void {
  if ((data.layout === 'v-box' || data.layout === 'h-box') && data.blockList) {
    if (data.dynamicSize) {
      let side: 'before' | 'after' = 'after'
      const direction: 'v' | 'h' = data.layout === 'v-box' ? 'v' : 'h'
      data.blockList.forEach((block, idx) => {
        if (block.dynamicBarH === undefined) block.dynamicBarH = 'none'
        if (block.dynamicBarV === undefined) block.dynamicBarV = 'none'
        if (block.flex) {
          side = 'before'
          return
        }
        if (!data.blockList) return
        if (side === 'after' && idx === (data.blockList.length || 0) - 1) return
        if (direction === 'v' && (block.minHeight === undefined || block.minHeight.px === undefined || block.maxHeight === undefined || block.maxHeight.px === undefined)) return
        if (direction === 'h' && (block.minWidth === undefined || block.minWidth.px === undefined || block.maxWidth === undefined || block.maxWidth.px === undefined)) return

        // dynamicBarV?: 'none' | 'before' | 'after';
        // dynamicBarH?: 'none' | 'before' | 'after';
        block[direction === 'v' ? 'dynamicBarV' : 'dynamicBarH'] = side
        const neighbor = data.blockList[idx + (side === 'after' ? 1 : -1)]
        if (neighbor && (neighbor.layout === 'h-box' || neighbor.layout === 'v-box')) {
          neighbor[direction === 'v' ? 'dynamicBarV' : 'dynamicBarH'] = (side === 'before' ? 'after' : 'before')
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const layout: any = {}
        const elm: HTMLElement | null = document.getElementById(block.key)
        if (elm) {
          const rect = elm.getBoundingClientRect()
          if (data.layout === 'v-box') {
            layout.left = rect.x + 'px'
            layout.top = (side === 'after' ? rect.bottom : rect.top) + 'px'
            layout.width = rect.width + 'px'
          }
          if (data.layout === 'h-box') {
            layout.left = (side === 'after' ? rect.right : rect.left) + 'px'
            layout.top = rect.y + 'px'
            layout.height = rect.height + 'px'
          }
          if (ignoreUpdateKey === block.key) return
          const index = barInfoList.findIndex(r => r.blockKey === block.key)
          if (index >= 0) {
            barInfoList.splice(index, 1, { side, direction, blockKey: block.key, layout })
          } else {
            barInfoList.push({ side, direction, blockKey: block.key, layout })
          }
        }
      })
    }
    data.blockList.forEach(block => updateBarList(block, barInfoList, ignoreUpdateKey))
  }
}

export function getBlock(data: SlotUnionInfo, key: string): SlotUnionInfo | null {
  if (data.key === key) return data
  if (data.layout === 'v-box' || data.layout === 'h-box') {
    return data.blockList?.map(block => getBlock(block, key))?.find(block => block) || null
  }
  return null
}

export function getSlotNameList(data: SlotUnionInfo): string[] {
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

export type SlotFlexInfo = SlotBase & {
  minWidth?: UiSize;
  maxWidth?: UiSize;
  minHeight?: UiSize;
  maxHeight?: UiSize;
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto';
  justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
  justifyItems?: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
  alignContent?: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
  flexWrap: boolean;
  toggle?: ComputedRef<boolean>;
  viewWeight?: number;
};

export type SlotTab = TabInfo & SlotBase;

export type SlotTabInfo = {
  key: string;
  layout: 'tab';
  tabKey: string;
  flex?: number;
  dynamicBarV?: 'none' | 'before' | 'after';
  dynamicBarH?: 'none' | 'before' | 'after';
  tabList: SlotTab[];
  hasSetting: boolean;
  minWidth?: UiSize;
  maxWidth?: UiSize;
  minHeight?: UiSize;
  maxHeight?: UiSize;
  toggle?: ComputedRef<boolean>;
  viewWeight?: number;
}

type MouseMove = {
  key: string;
  old: {
    x: number;
    y: number;
  },
  start: {
    x: number;
    y: number;
  },
  current: {
    x: number;
    y: number;
  }
}

export default defineComponent({
  name: 'FlexibleDataLayout',
  emits: ['tabChanged', 'openTabSetting'],
  props: {
    definition: {
      type: Object as PropType<SlotUnionInfo>,
      required: true,
      validator: (definition: SlotUnionInfo) =>
        definition.layout === 'h-box' ||
          definition.layout === 'v-box' ||
          definition.layout === 'tab'
    },
    barSetDelay: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const barList = reactive<BarInfo[]>([])
    const barActive = ref(false)
    onMounted(() => {
      setTimeout(() => {
        // 初期配置
        updateBarList(props.definition, barList)

        // 初回の配置によって起きるズレのために再配置することでズレを解消
        setTimeout(() => {
          updateBarList(props.definition, barList)
        })

        if (barList.length) {
          window.addEventListener('resize', () => {
            updateBarList(props.definition, barList)
          })
        }
      }, props.barSetDelay)
    })
    const oldBlockSize = reactive<{ w: number; h: number }>({ w: 0, h: 0 })
    const mouse = reactive<MouseMove>({
      key: '',
      old: { x: -1, y: -1 },
      start: { x: -1, y: -1 },
      current: { x: -1, y: -1 }
    })
    const getMousePoint = (event: MouseEvent | TouchEvent) => ({
      x: 'touches' in event ? event.changedTouches[0].pageX : event.pageX,
      y: 'touches' in event ? event.changedTouches[0].pageY : event.pageY
    })
    const reflectSize = (bar: BarInfo, block: SlotUnionInfo) => {
      const diffX = mouse.current.x - mouse.start.x
      const diffY = mouse.current.y - mouse.start.y
      const ratio = bar.side === 'after' ? 1 : -1
      if (bar.direction === 'v') {
        if (block.minHeight && block.minHeight.px !== undefined) block.minHeight.px = oldBlockSize.h + ratio * diffY
        if (block.maxHeight && block.maxHeight.px !== undefined) block.maxHeight.px = oldBlockSize.h + ratio * diffY
      }
      if (bar.direction === 'h') {
        if (block.minWidth && block.minWidth.px !== undefined) block.minWidth.px = oldBlockSize.w + ratio * diffX
        if (block.maxWidth && block.maxWidth.px !== undefined) block.maxWidth.px = oldBlockSize.w + ratio * diffX
      }
      setTimeout(() => {
        updateBarList(props.definition, barList, block.key)
      })
    }
    const intervalKey = ref<number | null>(null)

    const moveEnd = () => {
      // console.log('moveEnd')
      const bar = barList.find(b => b.blockKey === mouse.key)
      if (!bar) return
      const block = getBlock(props.definition, mouse.key)
      if (!block) return

      if (intervalKey.value !== null) {
        window.clearTimeout(intervalKey.value)
        intervalKey.value = null
      }

      // サイズ反映
      reflectSize(bar, block)

      barActive.value = false
      mouse.key = ''
    }
    return {
      slotNameList: getSlotNameList(props.definition),
      barList,
      barActive,
      mouse,
      moveStart: (event: MouseEvent | TouchEvent, key: string) => {
        // console.log('mouseStart')
        const bar = barList.find(b => b.blockKey === key)
        if (!bar) return
        const block = getBlock(props.definition, key)
        if (!block) return
        mouse.key = key
        const p = getMousePoint(event)
        mouse.start.x = p.x
        mouse.start.y = p.y
        mouse.current.x = p.x
        mouse.current.y = p.y
        mouse.old.x = convertNumberZero(bar.layout.left.replace('px', ''))
        mouse.old.y = convertNumberZero(bar.layout.top.replace('px', ''))
        oldBlockSize.w = block?.minWidth?.px || 0
        oldBlockSize.h = block?.minHeight?.px || 0
        setTimeout(() => {
          barActive.value = true
        })
      },
      moveEnd,
      mouseMove: (event: MouseEvent | TouchEvent) => {
        // console.log('mouseMove')
        const bar = barList.find(b => b.blockKey === mouse.key)
        if (!bar) return
        const block = getBlock(props.definition, mouse.key)
        if (!block) return
        const p = getMousePoint(event)
        const diffX = p.x - mouse.start.x
        const diffY = p.y - mouse.start.y
        mouse.current.x = p.x
        mouse.current.y = p.y
        if (bar.direction === 'v') {
          bar.layout.top = (diffY + mouse.old.y) + 'px'
        }
        if (bar.direction === 'h') {
          bar.layout.left = (diffX + mouse.old.x) + 'px'
        }

        // if (intervalKey.value === null) {
        //   intervalKey.value = window.setTimeout(() => {
        //     reflectSize(bar, block)
        //     intervalKey.value = null
        //   }, 100)
        //
        //   // サイズ反映
        //   reflectSize(bar, block)
        // }

        // サイズ反映
        reflectSize(bar, block)
        // updateBarList(props.definition, barList)
      }
    }
  }
})
</script>

<style scoped lang="scss">
.slot-input-form {
  display: inline-flex;
  flex: 1;
  position: relative;
}

:deep(> .flexible-flex-layout) {
  width: 100%;
  height: 100%;
}

.mouse-sensor {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  pointer-events: none;

  &.active {
    pointer-events: all;
  }

  &.v {
    cursor: row-resize;
  }

  &.h {
    cursor: col-resize;
  }
}

.bar {
  position: absolute;
  //background-color: rgba(0, 0, 0, 0);
  background-color: #495478;
  cursor: pointer;
  user-select: none;
  animation-name: fade-in;
  animation-fill-mode: none;
  animation-duration: 1s;
  animation-iteration-count: 1;
  animation-timing-function: linear;
  animation-delay: 0s;
  animation-direction: normal;

  &.active {
    background-color: #495478;
  }

  &.v {
    transform: translate(0, -50%);
    height: 0.5em;
    cursor: row-resize;
  }

  &.h {
    transform: translate(-50%, 0);
    width: 0.5em;
    cursor: col-resize;
  }
}
</style>
