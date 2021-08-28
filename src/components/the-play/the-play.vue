<template>
  <div id="the-play" :style="globalStyle">
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
import { computed, defineComponent, reactive, watch } from 'vue'
import CharacterStore from '@/feature/character/character'
import UserSettingStore from '@/feature/user-setting/user-setting'
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globalStyle = reactive<any>({
      '--accent1-color': 'rgba(255, 0, 0, 1)',
      '--accent2-color': 'rgba(0, 0, 255, 1)',
      '--font-color': 'rgba(0, 0, 0, 1)'
    })
    const reactiveLayout = reactive<SlotUnionInfo>(layoutData)
    const characterStore = CharacterStore.injector()
    const userSettingStore = UserSettingStore.injector()

    watch(() => userSettingStore.userSetting, () => {
      console.log('change global css')
      const a = userSettingStore.userSetting
      globalStyle['--accent1-color'] = a?.accent1Color || globalStyle['--accent1-color']
      globalStyle['--accent2-color'] = a?.accent2Color || globalStyle['--accent2-color']
      globalStyle['--font-color'] = a?.fontColor || globalStyle['--font-color']
    }, { deep: true })
    // (async () => {
    //   const a = await userSettingStore.getUserSetting()
    //   globalStyle['--accent1-color'] = a.data?.accent1Color
    //   globalStyle['--accent2-color'] = a.data?.accent2Color
    //   globalStyle['--font-color'] = a.data?.fontColor
    // })()

    // const list = reactive<Character[]>([
    //   { name: '藤崎 健吾', type: 'character', pcNo: 1, plot: 3, color: 'red', isFumble: false, isActed: false },
    //   { name: '篠原 亮司', type: 'character', pcNo: 2, plot: -2, color: 'green', isFumble: false, isActed: true },
    //   { name: '風咸 咲子', type: 'character', pcNo: 3, plot: 0, color: 'pink', isFumble: false, isActed: true },
    //   { name: '黒岩 健斗', type: 'character', pcNo: 4, plot: 3, color: 'silver', isFumble: false, isActed: true },
    //   { name: '飯宮 薫', type: 'character', pcNo: 5, plot: 3, color: 'olive', isFumble: false, isActed: true }
    // ])
    // const addCharacter = () => {
    //   const item = list.pop()
    //   if (item) {
    //     characterStore.insertData(item)
    //   }
    // }

    return {
      globalStyle,
      characterList: computed(() => characterStore.characterList),
      layoutData: reactiveLayout
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
  animation-name: fadeInAnime;
  animation-fill-mode: backwards;
  animation-duration: animations.$play-slide-animation-duration;
  animation-iteration-count: 1;
  animation-timing-function: linear;
  animation-delay: animations.$play-slide-animation-delay;
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
