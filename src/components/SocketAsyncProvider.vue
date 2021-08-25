<template>
<slot v-if="status === 'ready'" />
</template>

<script lang="ts">
import SocketStore from '@/store/socket'
import { ComputedRef } from '@vue/reactivity'

export default {
  name: 'SocketAsyncProvider',
  setup(): { status: ComputedRef<'connecting' | 'ready' | 'error'> } {
    return SocketStore.injector()
  }
}
</script>
