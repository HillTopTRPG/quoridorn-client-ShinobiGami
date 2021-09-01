<template>
  <template v-for="c in characterList" :key="c.key">
    <transition name="character-fade">
      <div
        class="character"
        :style="c.styleObj"
        v-if="c.data && c.data.plot === -1"
      ></div>
    </transition>
  </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CharacterStore from '@/feature/character/data'

export default defineComponent({
  name: 'dramatic-scene-area',
  setup() {
    const characterStore = CharacterStore.injector()
    return {
      characterList: characterStore.makeWrapCharacterList()
    }
  }
})
</script>

<style scoped lang="scss">
@use "../../common";

.character-fade-leave-active, .character-fade-enter-active {
  transition: opacity .5s;
}
.character-fade-leave-to, .character-fade-enter /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.character {
  width: 4em;
  height: 4em;
  overflow: hidden;
  margin: 3px 0 3px 3px;
  @include common.flex-box(row, center, center);
  border-color: var(--color);
  border-width: 3px;
  border-style: solid;
  box-sizing: border-box;
  background-image: var(--chit-image);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;

  &:last-child {
    margin-right: 3px;
  }
}
</style>
