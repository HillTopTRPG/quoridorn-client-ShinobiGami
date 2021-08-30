<template>
  <div class="sample">
    現在のSampleSettingの値：{{ list.length }}
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import Store from './data'

export default defineComponent({
  name: 'cut-in-pane',
  setup() {
    const state = Store.injector()
    const list = computed(() => state.list)

    return {
      list
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
