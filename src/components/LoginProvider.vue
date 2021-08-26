<template>
<slot />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import RoomStore from '@/store/room'
import UserStore from '@/store/user'

export default defineComponent({
  name: 'LoginProvider',
  setup() {
    RoomStore.provider()
    UserStore.provider()
  }
})
</script>
