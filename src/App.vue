<template>
  <quoridorn-core :modules="modules">
    <the-play />
  </quoridorn-core>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import QuoridornCore from '@/core/quoridorn-core.vue'
import ThePlay from '@/components/the-play/the-play.vue'

import CharacterStore from '@/feature/character/character'
import UserSettingStore from '@/feature/user-setting/user-setting'

export default defineComponent({
  name: 'App',
  components: {
    QuoridornCore,
    ThePlay
  },
  setup() {
    return {
      modules: [CharacterStore, UserSettingStore]
    }
  }
})
</script>

<style lang="scss">
@use "./components/animations";
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
}
</style>
