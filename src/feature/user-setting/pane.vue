<template>
  <div class="user-settings" v-if="userSetting">
    <label>
      <span>特技表のフォントサイズ</span>
      <input type="number" v-model="userSetting.skillTableFontSize" min="10" step="1">
    </label>
    <label>
      <span>忍法一覧のフォントサイズ</span>
      <input type="number" v-model="userSetting.ninjaArtsTableFontSize" min="10" step="1">
    </label>
    <label>
      <span>背景一覧のフォントサイズ</span>
      <input type="number" v-model="userSetting.backgroundTableFontSize" min="10" step="1">
    </label>
    <label>
      <span>奥義一覧のフォントサイズ</span>
      <input type="number" v-model="userSetting.specialArtsTableFontSize" min="10" step="1">
    </label>
    <label>
      <span>忍具一覧のフォントサイズ</span>
      <input type="number" v-model="userSetting.ninjaToolTableFontSize" min="10" step="1">
    </label>

    <color-set-container />

    <label class="color">
      <span>チャット文字色</span>
      <font-color-select v-model="userSetting.fontColor" />
    </label>

    <button @click="onClickClose()">close</button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import Store from './data'
import ColorSetContainer from '@/feature/user-setting/color-set-container.vue'
import FontColorSelect from '@/components/font-color-select.vue'

export default defineComponent({
  name: 'user-setting-pane',
  emits: ['close'],
  components: { FontColorSelect, ColorSetContainer },
  setup(_, { emit }) {
    const state = Store.injector()
    const userSetting = computed(() => state.userSetting)

    return {
      userSetting,
      onClickClose: () => {
        emit('close')
      }
    }
  }
})
</script>

<style scoped lang="scss">
@use "../../components/common";

.user-settings {
  @include common.flex-box(column, flex-start, flex-start);
  text-align: left;
}
</style>
