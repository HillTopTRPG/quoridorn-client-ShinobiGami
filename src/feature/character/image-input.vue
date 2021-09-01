<template>
  <div class="image-input" :class="type">
    <input type="file" @change="onImageUploaded($event)" >
    <img alt="" :src="src" v-if="src">
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import { file2Base64, getFileName } from '@/core/utility/FileUtility'
import { ImageInfo } from '@/feature/character/data'
export default defineComponent({
  name: 'image-input',
  props: {
    type: {
      type: String as PropType<'chit' | 'stand'>,
      required: true
    },
    imageInfo: {
      type: Object as PropType<ImageInfo>,
      default: null
    }
  },
  emits: ['update', 'delete'],
  setup(props, { emit }) {
    const src = ref<string | null>(props.imageInfo.base64)

    const onImageUploaded = async (event: { target: HTMLInputElement }) => {
      const image = event.target.files?.[0]
      src.value = (await file2Base64(image || null)) || null
      const result = { key: props.imageInfo.key, base64: src.value, name: getFileName(image?.name || '') }
      emit('update', result)
    }
    return {
      src,
      onImageUploaded
    }
  }
})
</script>

<style scoped lang="scss">
@use "../../components/common";

.image-input {
  @include common.flex-box(column, stretch, flex-start);

  img {
    border: 1px solid gray;
  }

  &.chit img {
    width: 5em;
    height: 5em;
    object-fit: contain;
    object-position: center bottom;
  }

  &.stand img {
    width: 6em;
    height: 9em;
    object-fit: contain;
    object-position: center bottom;
  }
}
</style>
