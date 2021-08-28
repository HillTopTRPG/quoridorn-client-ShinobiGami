<template>
    <transition name="character-fade">
      <div
        class="character"
        :style="{ '--color': character.data.color }"
      >
        <h2>{{ character.data.sheetInfo.characterName }}</h2>
        <div class="upper">{{ character.data.sheetInfo.upperStyle }}</div>
        <div class="sub">{{ character.data.sheetInfo.subStyle }}</div>
        <div class="background" v-for="(bg, ind) in character.data.sheetInfo.backgroundList" :key="ind">{{ bg.name }}</div>

        <ninja-arts-table :character="character.data" view-type="normal" />
        <skill-table-set :character="character.data" :character-key="character.key" />
      </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Character } from '@/feature/character/character'
import { StoreData } from '@/core/utility/FileUtility'
import SkillTableSet from '@/components/shinobi-gami/skill-table-set.vue'
import NinjaArtsTable from '@/components/shinobi-gami/ninja-arts-table.vue'

export default defineComponent({
  name: 'character-detail-view',
  components: { NinjaArtsTable, SkillTableSet },
  props: {
    character: {
      type: Object as PropType<StoreData<Character>>,
      required: true
    }
  }
})
</script>

<style scoped lang="scss">
@use "../common";

.character-fade-leave-active, .character-fade-enter-active {
  transition: opacity .5s;
}
.character-fade-leave-to, .character-fade-enter /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
