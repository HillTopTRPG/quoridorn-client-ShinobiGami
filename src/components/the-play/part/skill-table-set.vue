<template>
  <div class="skill-table-set">
    <skill-table :character-key="characterKey" v-model:target-skill="targetSkill" />
    <skill-table :character-key="characterKey" :is-comp="true" v-model:target-skill="targetSkill" v-if="viewComp" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SkillTable from '@/components/the-play/part/skill-table.vue'

export default defineComponent({
  name: 'skill-table-set',
  components: { SkillTable },
  props: {
    characterKey: {
      type: String,
      required: true
    },
    viewComp: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const targetSkill = ref<string | null>(null)
    return {
      targetSkill
    }
  }
})
</script>

<style scoped lang="scss">
@use "../../common";

.skill-table-set {
  @include common.flex-box(row, flex-start, flex-start, wrap);
}
</style>
