<template>
  <label :for="isEdit ? target : ''">
    <slot />
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'label-edit-for',
  props: {
    isEdit: Boolean,
    target: String
  }
})
</script>
