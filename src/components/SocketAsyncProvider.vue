<template>
<slot v-if="status === 'ready'" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SocketStore from '@/store/socket'
import { ComputedRef } from '@vue/reactivity'

export default defineComponent({
  name: 'SocketAsyncProvider',
  setup(): { status: ComputedRef<'connecting' | 'ready' | 'error'> } {
    return SocketStore.injector()
  }
})
</script>
