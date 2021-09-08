<template>
  <label>
    <span>サイクル</span>
    <select :value="modelValue" @input="inputHandler">
      <option :value="0">始</option>
      <option :value="n" v-for="n in max" :key="n">{{ n }}</option>
      <option :value="99">佳境</option>
      <option :value="100">終</option>
    </select>
  </label>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { convertNumberNull, convertNumberZero } from '@/core/utility/PrimaryDataUtility'
export default defineComponent({
  name: 'cycle-select',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Number,
      required: true
    },
    limit: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const max = computed(() => {
      return convertNumberNull(props.limit.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))) || 10
    })
    return {
      inputHandler: (e: { target: HTMLButtonElement }) => {
        emit('update:modelValue', convertNumberZero(e.target.value))
      },
      max
    }
  }
})
</script>

<style scoped lang="scss">
select {
  height: 2em;
}
</style>
