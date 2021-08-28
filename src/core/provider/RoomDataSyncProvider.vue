<template>
  <slot v-if="ready" />
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue'
import { MadeStore } from '@/core/utility/vue3'

export default defineComponent({
  name: 'RoomDataSyncProvider',
  props: {
    modules: {
      type: Array as PropType<MadeStore<{ ready: boolean }>[]>,
      required: true
    }
  },
  setup(props) {
    const injectObjList = props.modules.map(m => m.injector())
    const list = injectObjList.map(io => computed(() => io.ready))
    const ready = ref(false)
    watch(list, () => {
      ready.value = !list.some(l => !l.value)
    })
    return {
      ready
    }
  }
})
</script>
