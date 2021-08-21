<template>
<slot />
</template>

<script lang="ts">
import CountStore from '@/store/count'
import RoomStore from '@/store/room'
import UserStore from '@/store/user'

export default {
  name: 'GlobalDataProvider',
  setup(): void {
    CountStore.provider()
    RoomStore.provider()
    UserStore.provider()
  }
}
</script>
