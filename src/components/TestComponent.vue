<template>
  {{ count }}
  <button @click="increment">increment2</button>
</template>

<script>
import { defineComponent } from 'vue'
import CountStore from '@/store/count'

export default defineComponent({
  name: 'TestComponent',
  setup() {
    const counterStore = CountStore.injector()
    const count = counterStore.count
    const increment = counterStore.increment

    return {
      count,
      increment
    }
  }
})
</script>

<style scoped>

</style>
