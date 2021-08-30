<template>
  <div id="the-play" :style="globalStyle">
    <flexible-data-layout :definition="layoutData" :barSetDelay="2700">
      <modal-area />
      <template #top-box></template>
      <template #simple-center>
        <scene-status-area />
        <character-status-area :character-list="characterList" />
      </template>
      <template #dramatic-scene>
        <dramatic-scene-area :character-list="characterList" />
      </template>
      <template #velocity-system>
        <velocity-column :characterList="characterList" />
      </template>
      <template #right-box>
        <template v-for="c in characterList" :key="c.key">
          <character-detail-view :character="c" />
        </template>
      </template>
    </flexible-data-layout>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watch, ref } from 'vue'
import CharacterStore from '@/feature/character/data'
import UserSettingStore from '@/feature/user-setting/data'
import { SlotUnionInfo } from '@/core/flexible-data-layout.vue'
import VelocityColumn from '@/components/the-play/velocity-column.vue'
import CharacterStatusArea from '@/components/the-play/area/character-status-area.vue'
import ModalArea from '@/components/the-play/modal-area.vue'
import CharacterDetailView from '@/components/the-play/character-detail-view.vue'
import DramaticSceneArea from '@/components/the-play/area/dramatic-scene-area.vue'
import SceneStatusArea from '@/components/the-play/area/scene-status-area.vue'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const layoutData = require('./the-play.yaml')

export default defineComponent({
  components: { SceneStatusArea, DramaticSceneArea, CharacterDetailView, ModalArea, CharacterStatusArea, VelocityColumn },
  setup() {
    const userSettingStore = UserSettingStore.injector()

    const diffMs = ref(0)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globalStyle = reactive<any>({})
    watch(() => userSettingStore.userSetting, () => {
      const a = userSettingStore.userSetting
      console.log(diffMs.value)
      globalStyle['--accent1-color'] = a?.accent1Color || globalStyle['--accent1-color']
      globalStyle['--accent2-color'] = a?.accent2Color || globalStyle['--accent2-color']
      globalStyle['--font-color'] = a?.fontColor || globalStyle['--font-color']
      globalStyle['--skill-table-font-size'] = a?.skillTableFontSize ? a?.skillTableFontSize + 'px' : '' || globalStyle['--skill-table-font-size']
      globalStyle['--ninja-arts-table-font-size'] = a?.ninjaArtsTableFontSize ? a?.ninjaArtsTableFontSize + 'px' : '' || globalStyle['--ninja-arts-table-font-size']
    }, { deep: true, immediate: true })

    const reactiveLayout = reactive<SlotUnionInfo>(layoutData)
    const characterStore = CharacterStore.injector()

    return {
      globalStyle,
      characterList: computed(() => characterStore.characterList),
      layoutData: reactiveLayout,
      diffMs
    }
  },
  name: 'the-play'
})
</script>

<style scoped lang="scss">
@use "../common";

#the-play {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100vw;
  box-sizing: border-box;
}

@include common.deep(".right-box") {
  gap: 0.5rem;
}

@include common.deep(".top-box") {
  background-color: common.$menu-back-color;
  border-bottom: 1px solid #495478;
}

@include common.deep(".simple-center") {
  gap: 0.5rem;
}

@include common.deep(".dramatic-scene") {
  border: 1px solid black;
}

@include common.deep("#section-core") {
  gap: 0.5rem 0.5rem;
}
@include common.deep("#section-scene") {
  min-width: unquote(min(calc(24em + 47px), 100%));
  max-width: unquote(min(40em, 100%));
}

@include common.deep(".velocity-system") {
  justify-self: flex-end;
  min-width: unquote(min(calc(24em + 47px), 100%));
  max-width: unquote(min(40em, 100%));
  box-sizing: border-box;
  border: 1px solid black;
  padding: 5px;
  overflow-x: auto;
  gap: 5px;
}

</style>
