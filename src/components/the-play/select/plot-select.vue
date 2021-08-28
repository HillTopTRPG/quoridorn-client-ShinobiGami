<template>
  <select :value="modelValue" @input="inputHandler">
    <option disabled>プロット</option>
    <option :value="-2"></option>
    <option :value="-1">ドラマ</option>
    <option :value="0">0</option>
    <option :value="1">1</option>
    <option :value="2">2</option>
    <option :value="3">3</option>
    <option :value="4">4</option>
    <option :value="5">5</option>
    <option :value="6">6</option>
    <option :value="7">7</option>
  </select>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { convertNumberZero } from '@/core/utility/PrimaryDataUtility'
export default defineComponent({
  name: 'plot-select',
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
