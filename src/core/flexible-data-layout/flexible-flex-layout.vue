<template>
  <div class="flexible-flex-layout" :id="definition.key" :class="flexClass" :style="styleObj">
    <template v-if="definition.slotName">
      <slot :name="definition.slotName"></slot>
    </template>
    <template v-else-if="definition.blockList">
      <suspense
        v-for="(block, idx) in definition.blockList"
        :key="idx"
      >
        <flexible-union-layout
          :definition="block"
          :barList="barList"
          @tab-changed="_tab => $emit('tabChanged', _tab)"
          @open-tab-setting="_tabKey => $emit('openTabSetting', _tabKey)"
        >
          <template v-for="slotName in slotNameList" v-slot:[slotName]>
            <slot :name="slotName"></slot>
          </template>
        </flexible-union-layout>
      </suspense>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { getSlotNameList, SlotFlexInfo, UiSize, uiSize2css, BarInfo } from '@/core/flexible-data-layout.vue'
import { PickPropTypeKeys } from '@/core/utility/typescript'

export default defineComponent({
  name: 'FlexibleFlexLayout',
  emits: ['tabChanged', 'openTabSetting'],
  props: {
    definition: {
      type: Object as PropType<SlotFlexInfo>,
      required: true,
      validator: (definition: SlotFlexInfo) =>
        (definition.layout === 'h-box' ||
        definition.layout === 'v-box') &&
        (Boolean(definition.slotName) ||
        Boolean(definition.blockList))
    },
    barList: {
      type: Array as PropType<BarInfo[]>,
      required: true
    }
  },
  setup(props) {
    return {
      slotNameList: getSlotNameList(props.definition),
      flexClass: computed(() => {
        let barClass = ''
        if (props.definition.dynamicBarH !== undefined && props.definition.dynamicBarH !== 'none') {
          barClass = props.definition.dynamicBarH === 'before' ? 'bar-left' : 'bar-right'
        }
        if (props.definition.dynamicBarV !== undefined && props.definition.dynamicBarV !== 'none') {
          barClass = props.definition.dynamicBarV === 'before' ? 'bar-top' : 'bar-bottom'
        }
        // const barInfo = props.barList.find(b => b.blockKey === props.definition.key)
        // if (barInfo) {
        //   if (barInfo.direction === 'v') {
        //     barClass = barInfo?.side === 'before' ? 'bar-top' : 'bar-bottom'
        //   } else if (barInfo.direction === 'h') {
        //     barClass = barInfo?.side === 'before' ? 'bar-left' : 'bar-right'
        //   }
        // }
        return [
          props.definition.slotName,
          props.definition.layout,
          props.definition.flexWrap ? 'wrap' : 'non-wrap',
          barClass
        ]
      }),
      styleObj: computed(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const styleObj: any = {}
        const setUiSize = (p: PickPropTypeKeys<SlotFlexInfo, UiSize>) => {
          const size = props.definition[p]
          if (size) styleObj[p] = uiSize2css(size)
        }
        const setProp = (prop: keyof SlotFlexInfo, cssName?: string) => {
          if (props.definition[prop]) styleObj[cssName || prop] = props.definition[prop]
        }
        if (props.definition.minWidth) styleObj.minWidth = uiSize2css(props.definition.minWidth)
        // setUiSize('minWidth' as PickPropTypeKeys<SlotFlexInfo, UiSize>)
        setUiSize('maxWidth' as PickPropTypeKeys<SlotFlexInfo, UiSize>)
        setUiSize('minHeight' as PickPropTypeKeys<SlotFlexInfo, UiSize>)
        setUiSize('maxHeight' as PickPropTypeKeys<SlotFlexInfo, UiSize>)
        setProp('flex')
        setProp('justifyContent')
        setProp('justifyItems')
        setProp('alignContent')
        setProp('alignItems')
        setProp('overflowX', 'overflow-x')
        setProp('overflowY', 'overflow-y')
        if (props.definition.viewWeight) {
          styleObj.flex = props.definition.viewWeight
        }
        return styleObj
      })
    }
  }
})
</script>

<style scoped lang="scss">
.flexible-flex-layout {
  display: flex;
  overflow: auto;

  &.bar-top {
    padding-top: 0.25em;
  }

  &.bar-left {
    padding-left: 0.25em;
  }

  &.bar-right {
    padding-right: 0.25em;
  }

  &.bar-bottom {
    padding-bottom: 0.25em;
  }
}

.wrap {
  flex-wrap: wrap;
}

.h-box {
  flex-direction: row;
}

.v-box {
  flex-direction: column;
}
</style>
