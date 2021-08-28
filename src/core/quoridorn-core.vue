<template>
  <socket-sync-provider>
    <login-provider>
      <the-rooms />
      <login-sync-provider>
        <room-data-provider :modules="modules">
          <room-data-sync-provider :modules="modules">
            <slot />
          </room-data-sync-provider>
        </room-data-provider>
      </login-sync-provider>
    </login-provider>
  </socket-sync-provider>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import TheRooms from '@/core/the-rooms/the-rooms.vue'
import SocketStore from '@/core/data/socket'
import IgnoreWatchUpdateKeyStore from '@/core/data/ignore-watch-update-key'
import SocketSyncProvider from '@/core/provider/SocketSyncProvider.vue'
import LoginProvider from '@/core/provider/LoginProvider.vue'
import LoginSyncProvider from '@/core/provider/LoginSyncProvider.vue'
import { MadeStore } from '@/core/utility/vue3'
import RoomDataProvider from '@/core/provider/RoomDataProvider.vue'
import RoomDataSyncProvider from '@/core/provider/RoomDataSyncProvider.vue'

export default defineComponent({
  name: 'quoridorn-core',
  props: {
    modules: {
      type: Array as PropType<MadeStore<{ ready: boolean }>[]>,
      required: true
    }
  },
  components: {
    RoomDataSyncProvider,
    RoomDataProvider,
    LoginSyncProvider,
    LoginProvider,
    SocketSyncProvider,
    TheRooms
  },
  setup() {
    IgnoreWatchUpdateKeyStore.provider()
    SocketStore.provider()
  }
})
</script>
