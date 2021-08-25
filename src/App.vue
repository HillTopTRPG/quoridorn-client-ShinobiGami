<template>
  <socket-async-provider>
    <login-provider>
      <the-rooms />
      <login-async-provider>
        <global-data-provider>
          <the-play />
        </global-data-provider>
      </login-async-provider>
    </login-provider>
  </socket-async-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TheRooms from '@/components/the-rooms/the-rooms.vue'
import ThePlay from '@/components/the-play/the-play.vue'
import SocketStore from '@/store/socket'
import IgnoreWatchUpdateKeyStore from '@/store/ignore-watch-update-key'
import GlobalDataProvider from '@/components/GlobalDataProvider.vue'
import SocketAsyncProvider from '@/components/SocketAsyncProvider.vue'
import LoginProvider from '@/components/LoginProvider.vue'
import LoginAsyncProvider from '@/components/LoginAsyncProvider.vue'

export default defineComponent({
  name: 'App',
  components: {
    LoginAsyncProvider,
    LoginProvider,
    SocketAsyncProvider,
    GlobalDataProvider,
    TheRooms,
    ThePlay
  },
  setup() {
    IgnoreWatchUpdateKeyStore.provider()
    SocketStore.provider()
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
