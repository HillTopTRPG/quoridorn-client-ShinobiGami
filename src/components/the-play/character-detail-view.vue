<template>
    <transition name="character-fade">
      <div
        class="character-detail-view"
        :style="{ '--color': character.data.color }"
      >
        <div class="header">
          <div class="main">
            <h2>
              <ruby>
                {{ character.data.sheetInfo.characterName }}
                <rp>（</rp>
                <rt>{{ character.data.sheetInfo.characterNameKana }}</rt>
                <rp>）</rp>
              </ruby>
            </h2>
            <div class="player">{{ character.data.sheetInfo.playerName }}</div>
          </div>
          <div class="other">
            <div class="style">{{ character.data.sheetInfo.upperStyle }} - {{ character.data.sheetInfo.subStyle || '上位流派' }} - {{ character.data.sheetInfo.level }}</div>
            <div class="style-rule">{{ character.data.sheetInfo.stylerule }}</div>
            <div class="personal">{{ character.data.sheetInfo.belief }} - {{ character.data.sheetInfo.cover }} - {{ character.data.sheetInfo.age }} - {{ character.data.sheetInfo.sex }}</div>
          </div>
        </div>
        <div class="backgrounds">
          <div class="background" v-for="(bg, ind) in character.data.sheetInfo.backgroundList" :key="ind">{{ bg.name }}</div>
        </div>

        <div class="part-wrap">
          <skill-table-set
            :character="character.data"
            @clearArts="onClearArts()"
            :target-arts="selectedNinjaArtsIndex !== null ? character.data?.sheetInfo.ninjaArtsList[selectedNinjaArtsIndex]?.name || null : null"
            :character-key="character.key"
            v-model:other-character-key="otherCharacterKey"
            v-model:target-skill="targetSkill"
          />
        </div>
        <div class="part-wrap">
          <ninja-arts-table
            :character="character.data"
            :character-key="character.key"
            mode="normal"
            v-model:select-index="selectedNinjaArtsIndex"
          />
        </div>
      </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import { Character } from '@/feature/character/data'
import { StoreData } from '@/core/utility/FileUtility'
import SkillTableSet from '@/components/shinobi-gami/skill-table-set.vue'
import NinjaArtsTable from '@/components/shinobi-gami/ninja-arts-table.vue'
import { SkillTable } from '@/core/utility/shinobigami'

export default defineComponent({
  name: 'character-detail-view',
  components: { NinjaArtsTable, SkillTableSet },
  props: {
    character: {
      type: Object as PropType<StoreData<Character>>,
      required: true
    }
  },
  setup(props) {
    const selectedNinjaArtsIndex = ref<number | null>(null)
    const targetSkill = ref<string | null>(null)
    const otherCharacterKey = ref<string | null>(null)

    watch(selectedNinjaArtsIndex, () => {
      if (selectedNinjaArtsIndex.value === null) {
        targetSkill.value = null
        return
      }
      const targetSkillRaw = props.character.data?.sheetInfo.ninjaArtsList[selectedNinjaArtsIndex.value || 0]?.targetSkill
      if (SkillTable.flatMap(tt => tt).some(t => t === targetSkillRaw)) {
        targetSkill.value = targetSkillRaw || null
      } else {
        targetSkill.value = null
      }
    })

    return {
      selectedNinjaArtsIndex,
      targetSkill,
      otherCharacterKey,
      onClearArts: () => {
        selectedNinjaArtsIndex.value = null
      }
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

.header {
  @include common.flex-box(row, flex-start, center, wrap);
  gap: 0.5rem;
  width: 100%;
  background-color: var(--color);
  color: white;

  h2 {
    margin: 0;
    padding: 0;
    text-align: left;
    font-size: 1.3em;
    flex: 1;
    white-space: nowrap;

    &.style {
      font-size: 1em;
    }
  }

  .main {
    flex: 1;
    max-width: 100%;
    @include common.flex-box(column, flex-start, center);

    > * {
      text-align: left;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      max-width: 100%;
    }
  }

  .other {
    @include common.flex-box(column, flex-start, center);
    > * {
      text-align: left;
      font-size: 1em;
    }
  }
}

.backgrounds {
  @include common.flex-box(row, flex-start, center, wrap);
  gap: 0.5rem;
  width: 100%;

  .background {
    border: 1px solid gray;
    border-radius: 5px;
    padding: 0 0.5rem;
  }
}

.part-wrap {
  max-width: 100%;
  overflow-x: auto;
}

.character-detail-view {
  @include common.flex-box(row, flex-start, flex-start, wrap);
  gap: 0.5em;
}
</style>
