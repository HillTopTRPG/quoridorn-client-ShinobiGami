<template>
  <div class="scene-status-area">
    <cycle-select v-model="cycle" />
    <span>/参</span>
    <round-select v-model="round" />
    <battle-field-select v-model="battleField" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import CycleSelect from '@/components/the-play/select/cycle-select.vue'
import BattleFieldSelect from '@/components/the-play/select/battle-field-select.vue'
import RoundSelect from '@/components/the-play/select/round-select.vue'
export default defineComponent({
  name: 'scene-status-area',
  components: { RoundSelect, BattleFieldSelect, CycleSelect },
  setup() {
    const cycle = ref(0)
    const round = ref(0)
    const battleField = ref(0)
    return {
      cycle,
      round,
      battleField
    }
  }
})
</script>

<style scoped lang="scss">
@use "../../common";

.scene-status-area {
  @include common.flex-box(row, null, flex-end, wrap);

  label {
    @include common.flex-box(column, null, flex-start);

    select {
      font-size: 120%;
    }
  }
}
</style>
