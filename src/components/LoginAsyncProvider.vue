<template>
<slot v-if="userLoginResponse !== null" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UserStore from '@/store/user'

export default defineComponent({
  name: 'LoginAsyncProvider',
  setup() {
    return UserStore.injector()
  }
})
</script>
