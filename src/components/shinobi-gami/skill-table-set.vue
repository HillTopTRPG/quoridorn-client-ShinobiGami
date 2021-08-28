<template>
  <div class="skill-table-set">
    <skill-table :character="character" :character-key="characterKey" view-type="normal" v-model:target-skill="targetSkill" />
    <skill-table :character="character" :character-key="characterKey" view-type="comparison" v-model:target-skill="targetSkill" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import SkillTable from '@/components/shinobi-gami/skill-table.vue'
import { Character } from '@/feature/character/character'

export default defineComponent({
  name: 'skill-table-set',
  components: { SkillTable },
  props: {
    character: {
      type: Object as PropType<Character>,
      required: true
    },
    characterKey: {
      type: String,
      required: true
    }
  },
  setup() {
    return {
      targetSkill: ref<string | null>(null)
    }
  }
})
</script>

<style scoped lang="scss">
@use "../common";

.skill-table-set {
  @include common.flex-box(row, flex-start, flex-start, wrap);
}
</style>
