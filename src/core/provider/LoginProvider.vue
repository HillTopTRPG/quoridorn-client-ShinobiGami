<template>
  <the-login :modules="modules">
    <slot />
  </the-login>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import RoomStore from '@/core/data/room'
import UserStore from '@/core/data/user'
import TheLogin from '@/core/the-login/the-login.vue'
import { MadeStore } from '@/core/utility/vue3'

export default defineComponent({
  name: 'LoginProvider',
  components: { TheLogin },
  props: {
    modules: {
      type: Array as PropType<MadeStore<{ ready: boolean }>[]>,
      required: true
    }
  },
  setup() {
    RoomStore.provider()
    UserStore.provider()
  }
})
</script>
