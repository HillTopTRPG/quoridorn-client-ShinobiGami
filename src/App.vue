<template>
  <room-operate-area></room-operate-area>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import RoomOperateArea from '@/components/RoomOperateArea.vue'
import RoomStore from '@/store/room'
import UserStore from '@/store/user'

export default defineComponent({
  name: 'App',
  components: {
    RoomOperateArea
  },
  setup(): void {
    RoomStore.provider()
    UserStore.provider()
  }
})
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
