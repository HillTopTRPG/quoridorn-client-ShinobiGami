<template>
  <label>
    <span>サイクル</span>
    <select :value="modelValue" @input="inputHandler">
      <option :value="0">始</option>
      <option :value="1">壱</option>
      <option :value="2">弐</option>
      <option :value="3">参</option>
      <option :value="99">佳境</option>
      <option :value="100">終</option>
    </select>
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { convertNumberZero } from '@/core/utility/PrimaryDataUtility'
export default defineComponent({
  name: 'cycle-select',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Number,
      required: true
    }
  },
  setup(_, { emit }) {
    return {
      inputHandler: (e: { target: HTMLButtonElement }) => {
        emit('update:modelValue', convertNumberZero(e.target.value))
      }
    }
  }
})
</script>

<style scoped lang="scss">
select {
  height: 2em;
}
</style>
