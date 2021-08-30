<template>
  <div id="the-play" :style="globalStyle" v-if="ready">
    <modal-area />
    <flexible-data-layout :definition="layoutData" :barSetDelay="2200">
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
import UserStore from '@/core/data/user'
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
    const userStore = UserStore.injector()

    const diffMs = ref(0)
    const ready = ref(false)
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
    const diff = userStore.ms2 - userStore.ms1
    console.log(diff)
    globalStyle['--diff-ms'] = `${diff}ms`
    // setTimeout(() => {
    //   ready.value = true
    // })
    ready.value = true
    // onMounted(() => {
    //   console.log('@@2', Date.now() % 100000)
    //   diffMs.value = (Date.now() % 100000) - userStore.ms
    //   globalStyle['--diff-ms'] = `${diffMs.value}ms`
    //
    //   setTimeout(() => {
    //     ready.value = true
    //   })
    // })

    return {
      ready,
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
@use "../animations";
@use "../common";

#the-play {
  @include common.position-full-size(fixed);
  //animation-name: fade-in;
  animation-name: fadeInAnime;
  animation-fill-mode: backwards;
  //animation-duration: calc(#{animations.$play-slide-animation-duration} - var(--diff-ms));
  animation-duration: animations.$play-slide-animation-duration;
  animation-iteration-count: 1;
  animation-timing-function: linear;
  //animation-delay: 0s;
  animation-delay: calc(#{animations.$play-slide-animation-delay} - 165ms - var(--diff-ms));
  animation-direction: normal;
}

@keyframes fadeInAnime{
  0% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(0);
  }
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
