<template>
  <label>
    <span>ラウンド</span>
    <select :value="modelValue" @input="inputHandler">
      <option :value="0"></option>
      <option :value="1">1</option>
      <option :value="2">2</option>
      <option :value="3">3</option>
      <option :value="4">4</option>
    </select>
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'round-select',
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
        emit('update:modelValue', Number(e.target.value))
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
