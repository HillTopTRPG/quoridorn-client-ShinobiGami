<template>
  <div class="slot-input-form">
    <suspense>
      <flexible-union-layout
        :definition="definition"
        @tab-changed="_tab => $emit('tabChanged', _tab)"
        @open-tab-setting="_tabKey => $emit('openTabSetting', _tabKey)"
      >
        <template v-for="slotName in slotNameList" v-slot:[slotName]>
          <slot :name="slotName"></slot>
        </template>
      </flexible-union-layout>
    </suspense>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { SlotUnionInfo } from '@/types/common'
import { getSlotNameList } from '@/composable/changed-by'

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
    }
  },
  setup(props) {
    return {
      slotNameList: getSlotNameList(props.definition)
    }
  }
})
</script>

<style scoped>
.slot-input-form {
  display: inline-flex;
  flex: 1;
}

::v-deep > .flexible-flex-layout {
  width: 100%;
  height: 100%;
}
</style>
