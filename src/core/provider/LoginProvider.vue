<template>
  <the-login />
  <login-sync-provider>
    <slot />
  </login-sync-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import RoomStore from '@/core/data/room'
import UserStore from '@/core/data/user'
import TheLogin from '@/core/the-login/the-login.vue'
import LoginSyncProvider from '@/core/provider/LoginSyncProvider.vue'

export default defineComponent({
  name: 'LoginProvider',
  components: { LoginSyncProvider, TheLogin },
  setup() {
    RoomStore.provider()
    UserStore.provider()
  }
})
</script>
