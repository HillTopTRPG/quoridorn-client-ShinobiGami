<template>
  <div class="color-set-container">
    <color-test
      v-for="(c, ind) in userSettingList"
      @click="selectColorSetting(c)"
      :key="ind" :user-setting="c"
      :class="{ selected: c.accent1Color === userSetting?.accent1Color && c.accent2Color === userSetting?.accent2Color }"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import Store, { UserSetting } from '@/feature/user-setting/data'
import ColorTest from '@/feature/user-setting/color-test.vue'

export default defineComponent({
  name: 'color-set-container',
  components: { ColorTest },
  setup() {
    const state = Store.injector()
    const userSetting = computed(() => state.userSetting)

    const userSettingList: Pick<UserSetting, 'accent1Color' | 'accent2Color'>[] = [
      {
        accent1Color: 'rgba(255, 40, 0, 1)',
        accent2Color: 'rgba(0, 111, 255, 1)'
      },
      {
        accent1Color: 'rgba(0, 111, 255, 1)',
        accent2Color: 'rgba(0, 255, 0, 1)'
      }
    ]

    const selectColorSetting = (c: UserSetting) => {
      if (userSetting.value) {
        userSetting.value.accent1Color = c.accent1Color
        userSetting.value.accent2Color = c.accent2Color
      }
    }

    return {
      userSettingList,
      selectColorSetting,
      userSetting
    }
  }
})
</script>

<style scoped lang="scss">
@use "../../components/common";

.color-set-container {
  @include common.flex-box(row, flex-start, flex-start);
  gap: 0.3em;
  margin: 1em;

  .color-test {
    &.selected {
      transform: scale(1.2);
      transform-origin: center bottom;
    }
  }
}
</style>
