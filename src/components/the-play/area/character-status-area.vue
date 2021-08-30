<template>
  <div class="character-status-area">
    <template v-for="c in characterList" :key="c.key">
      <div class="character-status" v-if="c.data">
        <div
          class="character"
          :style="{ backgroundColor: c.data.color }"
        ><span>{{ c.data.sheetInfo.characterName }}</span></div>
        <select v-model="c.data.isActed">
          <option disabled>行動</option>
          <option :value="false">未</option>
          <option :value="true">済</option>
        </select>
        <plot-select v-model="c.data.plot" />
        <select v-model="c.data.isFumble">
          <option disabled>凪</option>
          <option :value="false">通常</option>
          <option :value="true">逆凪</option>
        </select>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Character } from '@/feature/character/data'
import { StoreData } from '@/core/utility/FileUtility'
import PlotSelect from '@/components/the-play/select/plot-select.vue'

export default defineComponent({
  name: 'character-status-area',
  components: { PlotSelect },
  props: {
    characterList: {
      type: Array as PropType<StoreData<Character>[]>,
      required: true
    }
  }
})
</script>

<style scoped lang="scss">
@use "../../common";

.character-status-area {
  @include common.flex-box(row);
  max-width: 100vw;
  overflow-x: auto;
  gap: 0 0.2rem;

  .character-status {
    min-width: 3em;
    max-width: 5em;
    overflow: hidden;
    position: relative;
    @include common.flex-box(column, null, stretch);

    .character {
      width: 100%;
      font-size: 80%;
      overflow: hidden;
      position: relative;
      @include common.flex-box(row, center, center);
      color: white;

      &:before {
        content: '';
        display: block;
        padding-top: 100%;
      }

      span {
        @include common.position-full-size();
        @include common.flex-box(row, center, center);
      }
    }

    select {
      height: 2em;
    }
  }
}
</style>
