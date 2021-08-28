<template>
  <tab-layout-component
    :id="definition.key"
    v-if="definition.layout === 'tab'"
    :tab-list="definition.tabList"
    :model-value="currentTab.val"
    :tab-key="definition.tabKey"
    :has-setting="definition.hasSetting"
    :size="size"
    @input="onInput"
    @open-tab-setting="tabKey => $emit('openTabSetting', tabKey)"
  >
    <template #default="{tab}">
      <div class="tab-contents" :class="tab.layout">
        <template v-if="tab.slotName">
          <slot :name="tab.slotName"></slot>
        </template>
        <suspense v-else-if="tab.blockList">
          <flexible-union-layout
            :definition="tab.block"
            :barList="barList"
            @tab-changed="_tab => $emit('tabChanged', _tab)"
            @open-tab-setting="_tabKey => $emit('openTabSetting', _tabKey)"
          >
            <template v-for="slotName in slotNameList">
              <slot :name="slotName"></slot>
            </template>
          </flexible-union-layout>
        </suspense>
      </div>
    </template>
  </tab-layout-component>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, reactive } from 'vue'
import TabLayoutComponent from '@/core/tab-layout-component.vue'
import { refObj } from '@/core/utility/vue-util'
import { BarInfo, getSlotNameList, SlotTab, SlotTabInfo, UiSize } from '@/core/flexible-data-layout.vue'

export default defineComponent({
  name: 'FlexibleTabLayout',
  components: { TabLayoutComponent },
  emits: ['tabChanged', 'openTabSetting'],
  props: {
    definition: {
      type: Object as PropType<SlotTabInfo>,
      required: true,
      validator: (definition: SlotTabInfo) =>
        definition.layout === 'tab' &&
        !definition.tabList.some(tab => !(tab.slotName ?? tab.blockList))
    },
    barList: {
      type: Array as PropType<BarInfo[]>,
      required: true
    }
  },
  setup(props, { emit }) {
    const currentTab = refObj<SlotTab>(props.definition.tabList[0])

    return {
      slotNameList: getSlotNameList(props.definition),
      currentTab,
      onInput: (data: SlotTab) => {
        currentTab.val = reactive(data)
        emit('tabChanged', data)
      },
      size: computed(() => {
        const obj: {
          minWidth?: UiSize;
          maxWidth?: UiSize;
          minHeight?: UiSize;
          maxHeight?: UiSize;
          viewWeight?: number;
        } = {
          minWidth: props.definition.minWidth,
          maxWidth: props.definition.maxWidth,
          minHeight: props.definition.minHeight,
          maxHeight: props.definition.maxHeight,
          viewWeight: props.definition.viewWeight
        }
        return obj
      })
    }
  }
})
</script>

<style scoped>
.tab-contents {
  display: flex;
}
</style>
