<template>
<slot />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import RoomStore from '@/core/data/room'
import UserStore from '@/core/data/user'

export default defineComponent({
  name: 'LoginProvider',
  setup() {
    RoomStore.provider()
    UserStore.provider()
  }
})
</script>
