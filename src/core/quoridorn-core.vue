<template>
  <socket-provider>
    <login-provider>
      <room-data-provider :modules="modules">
        <slot />
      </room-data-provider>
    </login-provider>
  </socket-provider>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import IgnoreWatchUpdateKeyStore from '@/core/data/ignore-watch-update-key'
import LoginProvider from '@/core/provider/LoginProvider.vue'
import { MadeStore } from '@/core/utility/vue3'
import RoomDataProvider from '@/core/provider/RoomDataProvider.vue'
import SocketProvider from '@/core/provider/SocketProvider.vue'

export default defineComponent({
  name: 'quoridorn-core',
  components: {
    SocketProvider,
    RoomDataProvider,
    LoginProvider
  },
  setup() {
    IgnoreWatchUpdateKeyStore.provider()
    const modules = inject<MadeStore<{ ready: boolean }>[]>('$featureStores')
    return {
      modules
    }
  }
})
</script>
