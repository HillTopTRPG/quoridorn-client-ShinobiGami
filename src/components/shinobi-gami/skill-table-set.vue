<template>
  <div class="skill-table-set">
    <skill-table
      :character="character"
      @clearArts="onClearArts()"
      :target-arts="targetArts"
      :character-key="characterKey"
      mode="normal"
      v-model:target-skill="targetSkillRaw"
    />
    <skill-table
      :character="character"
      :character-key="characterKey"
      mode="comparison"
      v-model:other-character-key="otherCharaKey"
      v-model:target-skill="targetSkillRaw"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import SkillTable from '@/components/shinobi-gami/skill-table.vue'
import { Character } from '@/feature/character/data'

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
    },
    otherCharacterKey: {
      type: String,
      default: null
    },
    targetSkill: {
      type: String,
      default: null
    },
    targetArts: {
      type: String,
      default: null
    }
  },
  emits: ['update:targetSkill', 'update:otherCharacterKey', 'clear-arts'],
  setup(props, { emit }) {
    const targetSkillRaw = ref<string | null>(props.targetSkill)
    const otherCharaKey = ref<string | null>(props.otherCharacterKey)
    watch(() => props.targetSkill, () => {
      targetSkillRaw.value = props.targetSkill
    })
    watch(targetSkillRaw, () => {
      emit('update:targetSkill', targetSkillRaw.value)
    })
    watch(() => props.otherCharacterKey, () => {
      otherCharaKey.value = props.otherCharacterKey
    })
    watch(otherCharaKey, () => {
      emit('update:otherCharacterKey', otherCharaKey.value)
    })
    return {
      targetSkillRaw,
      otherCharaKey,
      onClearArts: () => {
        emit('clear-arts')
      }
    }
  }
})
</script>

<style scoped lang="scss">
@use "../common";

.skill-table-set {
  @include common.flex-box(row, flex-start, flex-start, wrap);
  gap: 0.5rem;
  box-sizing: border-box;
}
</style>
