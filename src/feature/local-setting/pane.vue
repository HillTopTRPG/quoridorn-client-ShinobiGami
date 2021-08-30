<template>
  <div class="sample">
    現在のSampleSettingの値：{{ setting.sample }}
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import Store from './data'

export default defineComponent({
  name: 'local-setting-pane',
  setup() {
    const state = Store.injector()
    const setting = computed(() => state.setting)

    return {
      setting
    }
  }
})
</script>

<style scoped lang="scss">
@use "../../components/common";

.sample {
  @include common.flex-box(row, flex-start, center);
}
</style>
