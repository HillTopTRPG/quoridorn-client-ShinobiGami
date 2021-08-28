<template>
<slot v-if="status === 'ready'" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SocketStore from '@/core/data/socket'
import { ComputedRef } from '@vue/reactivity'
import { makeComputedObject } from '@/core/utility/vue3'

export default defineComponent({
  name: 'SocketSyncProvider',
  setup(): { status: ComputedRef<'connecting' | 'ready' | 'error'> } {
    return makeComputedObject(SocketStore.injector())
  }
})
</script>
