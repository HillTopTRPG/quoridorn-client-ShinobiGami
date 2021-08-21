<template>
  <div class="flexible-flex-layout" :class="flexClass" :style="styleObj">
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
import { SlotFlexInfo } from '@/types/common'
import * as uiSize from '@/composable/ui-size'
import { getSlotNameList } from '@/composable/changed-by'

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
    }
  },
  setup(props) {
    return {
      slotNameList: getSlotNameList(props.definition),
      flexClass: computed(() => [props.definition.slotName, props.definition.layout, props.definition.flexWrap ? 'wrap' : 'non-wrap']),
      styleObj: computed(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const styleObj: any = {}
        if (props.definition.minWidth) {
          styleObj['min-width'] = uiSize.uiSize2css(props.definition.minWidth)
        }
        if (props.definition.maxWidth) {
          styleObj['max-width'] = uiSize.uiSize2css(props.definition.maxWidth)
        }
        if (props.definition.minHeight) {
          styleObj['min-height'] = uiSize.uiSize2css(props.definition.minHeight)
        }
        if (props.definition.maxHeight) {
          styleObj['max-height'] = uiSize.uiSize2css(props.definition.maxHeight)
        }
        if (props.definition.flex) {
          styleObj.flex = props.definition.flex
        }
        if (props.definition.justifyContent) {
          styleObj['justify-content'] = props.definition.justifyContent
        }
        if (props.definition.alignContent) {
          styleObj['align-content'] = props.definition.alignContent
        }
        if (props.definition.overflowX) {
          styleObj['overflow-x'] = props.definition.overflowX
        }
        if (props.definition.overflowY) {
          styleObj['overflow-y'] = props.definition.overflowY
        }
        if (props.definition.viewWeight) {
          styleObj.flex = props.definition.viewWeight
        }
        return styleObj
      })
    }
  }
})
</script>

<style scoped>
.flexible-flex-layout {
  display: flex;
  overflow: auto;
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
