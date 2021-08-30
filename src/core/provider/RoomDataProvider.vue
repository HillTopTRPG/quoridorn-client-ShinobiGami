<template>
  <room-data-sync-provider :modules="modules">
    <slot />
  </room-data-sync-provider>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { MadeStore } from '@/core/utility/vue3'
import RoomDataSyncProvider from '@/core/provider/RoomDataSyncProvider.vue'

export default defineComponent({
  name: 'RoomDataProvider',
  components: { RoomDataSyncProvider },
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
