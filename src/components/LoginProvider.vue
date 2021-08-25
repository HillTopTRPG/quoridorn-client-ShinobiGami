<template>
<slot />
</template>

<script lang="ts">
import RoomStore from '@/store/room'
import UserStore from '@/store/user'

export default {
  name: 'LoginProvider',
  setup(): void {
    RoomStore.provider()
    UserStore.provider()
  }
}
</script>
