<template>
  <span class="color-palette">
    <span
      class="color"
      :class="c === modelValue ? 'selected' : ''"
      :style="{ '--color': c }"
      v-for="(c, ind) in colorList"
      :key="c"
      @click="selectColor(c)"
    >{{ ind.toString().padStart(3, '0') }}</span>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'font-color-select',
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  setup(_, { emit }) {
    const colorList: string[] = []
    colorList.push('#3E2723')
    colorList.push('#757575')
    colorList.push('#C12115')
    colorList.push('#E45714')
    colorList.push('#3B8A33')
    colorList.push('#0062AF')
    colorList.push('#08358A')
    colorList.push('#652173')
    colorList.push('#F44336')
    colorList.push('#FF5252')
    colorList.push('#D50000')
    colorList.push('#EC407A')
    colorList.push('#D81B60')
    colorList.push('#880E4F')
    colorList.push('#FF4081')
    colorList.push('#F50057')
    colorList.push('#C51162')
    colorList.push('#9C27B0')
    colorList.push('#6A1B9A')
    colorList.push('#D500F9')
    colorList.push('#AA00FF')
    colorList.push('#6200EA')
    colorList.push('#303F9F')
    colorList.push('#536DFE')
    colorList.push('#3D5AFE')
    colorList.push('#304FFE')
    colorList.push('#01579B')
    colorList.push('#0097A7')
    colorList.push('#00838F')
    colorList.push('#004D40')
    colorList.push('#1B5E20')
    colorList.push('#FF8F00')
    colorList.push('#E65100')
    colorList.push('#BF360C')
    colorList.push('#FF3D00')
    colorList.push('#DD2C00')
    colorList.push('#795548')
    colorList.push('#5D4037')
    colorList.push('#607D8B')
    colorList.push('#455A64')

    return {
      colorList,
      selectColor: (c: string) => {
        emit('update:modelValue', c)
      }
    }
  }
})
</script>

<style scoped lang="scss">
@use "../components/common";

.color-palette {
  @include common.flex-box(row, flex-start, flex-start, wrap);
  gap: 0.2rem;
}

.color {
  width: 2em;
  height: 2em;
  @include common.flex-box(row, center, center);
  box-sizing: border-box;
  white-space: pre;
  color: var(--color);
  position: relative;
  cursor: pointer;

  &.selected {
    font-weight: bold;

    &:before {
      border-bottom-width: 3px;
    }
  }

  &:before {
    content: '';
    @include common.position-full-size();
    box-sizing: border-box;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: var(--color);
  }
}
</style>
