<template>
  <slot />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { MadeStore } from '@/core/utility/vue3'

export default defineComponent({
  name: 'RoomDataProvider',
  props: {
    modules: {
      type: Array as PropType<MadeStore<{ ready: boolean }>[]>,
      required: true
    }
  },
  setup(props) {
    props.modules.forEach(m => (m.provider()))
  }
})
</script>
