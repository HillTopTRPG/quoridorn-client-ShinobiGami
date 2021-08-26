<template>
  <quoridorn-login-wrapper>
    <global-data-provider>
      <the-play />
    </global-data-provider>
  </quoridorn-login-wrapper>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ThePlay from '@/components/the-play/the-play.vue'
import GlobalDataProvider from '@/components/GlobalDataProvider.vue'
import QuoridornLoginWrapper from '@/lib-components/quoridorn-login-wrapper.vue'

export default defineComponent({
  name: 'App',
  components: {
    QuoridornLoginWrapper,
    GlobalDataProvider,
    ThePlay
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
