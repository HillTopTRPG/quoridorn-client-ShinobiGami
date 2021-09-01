<template>
  <div class="character-status-area">
    <template v-for="c in characterList" :key="c.key">
      <div class="character-status" v-if="c.data">
        <div
          class="character"
          :style="c.styleObj"
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
import { defineComponent } from 'vue'
import CharacterStore from '@/feature/character/data'
import PlotSelect from '@/components/the-play/select/plot-select.vue'

export default defineComponent({
  name: 'character-status-area',
  components: { PlotSelect },
  setup() {
    const characterStore = CharacterStore.injector()
    const characterList = characterStore.makeWrapCharacterList()
    return {
      characterList
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
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center top;
      background-image: var(--chit-image);

      &:before {
        content: '';
        display: block;
        padding-top: calc(100% + 2em);
      }

      span {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2em;
        @include common.flex-box(row, center, center);
        color: var(--color);
        font-weight: bold;
      }
    }

    select {
      height: 2em;
    }
  }
}
</style>
