<template>
  <suspense v-if="definition.layout === 'h-box' || definition.layout === 'v-box'">
    <flexible-flex-layout
      :definition="definition"
      :barList="barList"
      @tab-changed="_tab => $emit('tabChanged', _tab)"
      @open-tab-setting="_tabKey => $emit('openTabSetting', _tabKey)"
    >
      <template v-for="slotName in slotNameList" v-slot:[slotName]>
        <slot :name="slotName"></slot>
      </template>
    </flexible-flex-layout>
  </suspense>
  <suspense v-if="definition.layout === 'tab'">
    <flexible-tab-layout
      :definition="definition"
      :barList="barList"
      @tab-changed="_tab => $emit('tabChanged', _tab)"
      @open-tab-setting="_tabKey => $emit('openTabSetting', _tabKey)"
    >
      <template v-for="slotName in slotNameList" v-slot:[slotName]>
        <slot :name="slotName"></slot>
      </template>
    </flexible-tab-layout>
  </suspense>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { getSlotNameList, SlotUnionInfo, BarInfo } from '@/core/flexible-data-layout.vue'

export default defineComponent({
  name: 'FlexibleUnionLayout',
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
    barList: {
      type: Array as PropType<BarInfo[]>,
      required: true
    }
  },
  setup(props) {
    return {
      slotNameList: computed(() => getSlotNameList(props.definition))
    }
  }
})
</script>

<style scoped>
</style>
