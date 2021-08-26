<template>
  <socket-async-provider>
    <login-provider>
      <the-rooms />
      <login-async-provider>
        <slot></slot>
      </login-async-provider>
    </login-provider>
  </socket-async-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TheRooms from '@/components/the-rooms/the-rooms.vue'
import SocketStore from '@/store/socket'
import IgnoreWatchUpdateKeyStore from '@/store/ignore-watch-update-key'
import SocketAsyncProvider from '@/components/SocketAsyncProvider.vue'
import LoginProvider from '@/components/LoginProvider.vue'
import LoginAsyncProvider from '@/components/LoginAsyncProvider.vue'

export default defineComponent({
  name: 'quoridorn-login-wrapper',
  components: {
    LoginAsyncProvider,
    LoginProvider,
    SocketAsyncProvider,
    TheRooms
  },
  setup() {
    IgnoreWatchUpdateKeyStore.provider()
    SocketStore.provider()
  }
})
</script>
