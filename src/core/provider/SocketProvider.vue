<template>
  <socket-sync-provider>
    <slot />
  </socket-sync-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SocketStore from '@/core/data/socket'
import SocketSyncProvider from '@/core/provider/SocketSyncProvider.vue'

export default defineComponent({
  name: 'SocketProvider',
  components: { SocketSyncProvider },
  setup() {
    SocketStore.provider()
  }
})
</script>
