<template>
<slot />
</template>

<script lang="ts">
import CharacterStore from '@/store/character'

export default {
  name: 'GlobalDataProvider',
  setup(): void {
    CharacterStore.provider()
  }
}
</script>
