<template>
  <label>
    <span>戦場表</span>
    <select :value="modelValue" @input="inputHandler">
      <option :value="0">平地</option>
      <option :value="1">水中</option>
      <option :value="2">高所</option>
      <option :value="3">悪天候</option>
      <option :value="4">雑踏</option>
      <option :value="5">極地</option>
    </select>
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { convertNumberZero } from '@/core/utility/PrimaryDataUtility'
export default defineComponent({
  name: 'battle-field-select',
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
