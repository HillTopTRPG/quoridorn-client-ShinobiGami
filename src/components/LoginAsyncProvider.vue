<template>
<slot v-if="userLoginResponse !== null" />
</template>

<script lang="ts">
import UserStore, { UserLoginResponse } from '@/store/user'
import { ComputedRef } from '@vue/reactivity'

export default {
  name: 'LoginAsyncProvider',
  setup(): { userLoginResponse: ComputedRef<UserLoginResponse | null> } {
    return UserStore.injector()
  }
}
</script>
