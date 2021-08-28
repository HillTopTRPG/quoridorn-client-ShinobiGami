<template>
  <div class="user-settings" v-if="userSetting">
    <label><span>フォント色</span>{{ userSetting?.fontColor }}</label>
    <label><span>アクセント色1</span>{{ userSetting?.accent1Color }}</label>
    <label><span>アクセント色2</span>{{ userSetting?.accent2Color }}</label>

    <color-set-container />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import UserSettingStore from '@/feature/user-setting/user-setting'
import ColorSetContainer from '@/feature/user-setting/component/color-set-container.vue'

export default defineComponent({
  name: 'ope-user-setting',
  components: { ColorSetContainer },
  setup() {
    const userSettingStore = UserSettingStore.injector()
    const userSetting = computed(() => userSettingStore.userSetting)

    return {
      userSetting
    }
  }
})
</script>

<style scoped lang="scss">
@use "../../../components/common";

.user-settings {
  @include common.flex-box(column, flex-start, flex-start)
}
</style>
