<template>
  <template v-for="c in characterList" :key="c.key">
    <transition name="character-fade">
      <div
        class="character"
        :style="{ backgroundColor: c.data.color }"
        v-if="c.data && c.data.plot === -1"
      >{{ c.data.sheetInfo.characterName }}</div>
    </transition>
  </template>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Character } from '@/store/character'
import { StoreData } from '@/utility/FileUtility'

export default defineComponent({
  name: 'dramatic-scene',
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
  color: white;

  &:last-child {
    margin-right: 3px;
  }
}
</style>
