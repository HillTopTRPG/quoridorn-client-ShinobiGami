<template>
<slot />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CharacterStore from '@/store/character'

export default defineComponent({
  name: 'GlobalDataProvider',
  setup() {
    CharacterStore.provider()
  }
})
</script>
