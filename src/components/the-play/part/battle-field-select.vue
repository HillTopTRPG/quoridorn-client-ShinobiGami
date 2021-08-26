<template>
  <label>
    <span>戦場表</span>
    <select :value="modelValue" @input="inputHandler">
      <option :value="1">平地</option>
      <option :value="2">水中</option>
      <option :value="3">高所</option>
      <option :value="4">悪天候</option>
      <option :value="5">雑踏</option>
      <option :value="6">極地</option>
    </select>
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
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
