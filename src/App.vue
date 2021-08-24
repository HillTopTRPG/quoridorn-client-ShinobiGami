<template>
  <global-data-provider>
    <the-rooms @loggedIn="onLoggedIn()" v-if="!isLoggedIn" />
    <the-play v-if="isLoggedIn" />
  </global-data-provider>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import TheRooms from '@/components/the-rooms/the-rooms.vue'
import ThePlay from '@/components/the-play/the-play.vue'
import IgnoreWatchUpdateKeyStore from '@/store/ignore-watch-update-key'
import GlobalDataProvider from '@/components/GlobalDataProvider.vue'

export default defineComponent({
  name: 'App',
  components: {
    GlobalDataProvider,
    TheRooms,
    ThePlay
  },
  setup() {
    const isLoggedIn = ref(false)
    const onLoggedIn = (): void => {
      isLoggedIn.value = true
      console.log('onLoggedIn')
    }
    IgnoreWatchUpdateKeyStore.provider()
    return {
      isLoggedIn,
      onLoggedIn
    }
  }
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
