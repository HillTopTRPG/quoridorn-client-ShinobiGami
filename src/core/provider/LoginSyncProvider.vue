<template>
  <slot v-if="userLoginResponse !== null" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UserStore from '@/core/data/user'

export default defineComponent({
  name: 'LoginSyncProvider',
  setup() {
    return UserStore.injector()
  }
})
</script>
