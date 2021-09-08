<template>
  <div class="color-test">
    <div class="white-area"></div>
    <div class="black-area"></div>
    <div class="accent1-color-test" :style="{ backgroundColor: userSetting?.accent1Color }"></div>
    <div class="accent2-color-test" :style="{ backgroundColor: userSetting?.accent2Color }"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { UserSetting } from '@/feature/user-setting/data'

export default defineComponent({
  name: 'color-test',
  props: {
    userSetting: {
      type: Object as PropType<Pick<UserSetting, 'accent1Color' | 'accent2Color'>>,
      required: true
    }
  }
})
</script>

<style scoped lang="scss">
@use "../../components/common";

.color-test {
  width: 3em;
  height: 3em;
  @include common.flex-box(row, stretch, stretch);
  position: relative;
  gap: 0.5em;
  padding: 0.5em;
  border: 1px solid black;
  box-sizing: border-box;
  cursor: pointer;

  *[class$='-area'] {
    position: absolute;
    height: 50%;
    left: 0;
    right: 0;
    z-index: 1;
  }

  .white-area {
    top: 0;
    background-color: white;
  }

  .black-area {
    bottom: 0;
    background-color: #252525;
  }

  *[class$='-test'] {
    z-index: 2;
  }

  .accent1-color-test {
    flex: 1;
  }

  .accent2-color-test {
    flex: 1;
  }

  .font-color-test {
    @include common.flex-box(column, center, space-around);
    //background-color: cyan;
    flex: 2;
    border: 1px solid gray;
  }
}
</style>
