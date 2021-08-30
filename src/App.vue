<template>
  <quoridorn-core>
    <the-play />
  </quoridorn-core>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ThePlay from '@/components/the-play/the-play.vue'

export default defineComponent({
  name: 'App',
  components: { ThePlay }
})
</script>

<style lang="scss">
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
