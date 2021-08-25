<template>
  <div id="hello" :class="classObj">
    <flexible-data-layout :definition="layoutData" :barSetDelay="1000">
      <template #simple-center>
        <button @click="addCharacter()">addCharacter</button>
        <div class="scene-status">
          <label>
            <span>サイクル</span>
            <select>
              <option value="0">始</option>
              <option value="1">壱</option>
              <option value="2">弐</option>
              <option value="3">参</option>
              <option value="99">佳境</option>
              <option value="100">終</option>
            </select>
          </label>
          <span>/参</span>
          <label>
            <span>ラウンド</span>
            <select>
              <option value="0"></option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </label>
          <label>
            <span>戦場表</span>
            <select>
              <option value="1">平地</option>
              <option value="2">水中</option>
              <option value="3">高所</option>
              <option value="4">悪天候</option>
              <option value="5">雑踏</option>
              <option value="6">極地</option>
            </select>
          </label>
        </div>
        <div class="character-status-area">
          <template v-for="c in characterList" :key="c.key">
            <div class="character-status" v-if="c.data">
              <div
                class="character"
                :style="{ backgroundColor: c.data.color }"
              ><span>{{ c.data.name }}</span></div>
              <select v-model="c.data.isActed">
                <option disabled>行動</option>
                <option :value="false">未</option>
                <option :value="true">済</option>
              </select>
              <select v-model="c.data.plot">
                <option disabled>プロット</option>
                <option :value="-2"></option>
                <option :value="-1">ドラマ</option>
                <option :value="0">0</option>
                <option :value="1">1</option>
                <option :value="2">2</option>
                <option :value="3">3</option>
                <option :value="4">4</option>
                <option :value="5">5</option>
                <option :value="6">6</option>
                <option :value="7">7</option>
              </select>
              <select v-model="c.data.isFumble">
                <option disabled>凪</option>
                <option :value="false">通常</option>
                <option :value="true">逆凪</option>
              </select>
            </div>
          </template>
        </div>
      </template>
      <template #dramatic-scene>
        <template v-for="c in characterList" :key="c.key">
          <transition name="character-fade">
            <div
              class="character"
              :style="{ backgroundColor: c.data.color }"
              v-if="c.data && c.data.plot === -1"
            >{{ c.data.name }}</div>
          </transition>
        </template>
      </template>
      <template #velocity-system>
        <div class="velocity-column" v-for="(v, ind) in velocity" :key="v">
          <div class="label">
            <span class="k">{{ v.k }}</span>
            <span class="a">{{ v.a }}</span>
            <span class="e">{{ v.e }}</span>
          </div>
          <div class="field">
            <template v-for="c in characterList" :key="c.key">
              <transition name="character-fade">
                <div
                  class="character"
                  :style="{ backgroundColor: c.data.color }"
                  v-if="c.data && c.data.plot === ind && !c.data.isFumble"
                ><span>{{ c.data.name }}</span></div>
              </transition>
            </template>
            <span class="n">{{ ind }}</span>
          </div>
          <div class="fumble">
            <template v-for="c in characterList" :key="c.key">
              <transition name="character-fade">
                <div
                  class="character"
                  :style="{ backgroundColor: c.data.color }"
                  v-if="c.data && c.data.plot === ind && c.data.isFumble"
                ><span>{{ c.data.name }}</span></div>
              </transition>
            </template>
          </div>
        </div>
      </template>
    </flexible-data-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch } from 'vue'
import UserStore from '@/store/user'
import CharacterStore, { Character } from '@/store/character'
import { SlotUnionInfo } from '@/lib-components/flexible-data-layout.vue'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const layoutData = require('./the-play.yaml')

type VelocityColumn = { k: string; a: string; e: string }
type Velocity = VelocityColumn[]

export default defineComponent({
  setup() {
    const userStore = UserStore.injector()
    const characterStore = CharacterStore.injector()

    const classObj = ref<string[]>(['display'])
    const reactiveLayout = reactive<SlotUnionInfo>(layoutData)
    const velocity = reactive<Velocity>([
      { k: '零', a: '静止した時間', e: 'Mundain' },
      { k: '壱', a: '幽霊歩き', e: 'Ghost Walk' },
      { k: '弐', a: '影走', e: 'Shadow Run' },
      { k: '参', a: '思考速度', e: 'Neuro Speed' },
      { k: '肆', a: '音速', e: 'Sonic Speed' },
      { k: '伍', a: '弾速', e: 'Bullet Speed' },
      { k: '陸', a: '光速', e: 'Light Speed' },
      { k: '死地', a: '超光速', e: 'F.T.L.' }
    ])

    const list = reactive<Character[]>([
      { name: '藤崎 健吾', type: 'character', pcNo: 1, plot: 3, color: 'red', isFumble: false, isActed: false },
      { name: '篠原 亮司', type: 'character', pcNo: 2, plot: -2, color: 'green', isFumble: false, isActed: true },
      { name: '風咸 咲子', type: 'character', pcNo: 3, plot: 0, color: 'pink', isFumble: false, isActed: true },
      { name: '黒岩 健斗', type: 'character', pcNo: 4, plot: 3, color: 'silver', isFumble: false, isActed: true },
      { name: '飯宮 薫', type: 'character', pcNo: 5, plot: 3, color: 'olive', isFumble: false, isActed: true }
    ])
    const addCharacter = () => {
      const item = list.pop()
      if (item) {
        characterStore.insertData(item)
      }
    }

    characterStore.requestData()

    watch(userStore.userLoginResponse, () => {
      classObj.value.splice(
        0,
        1,
        userStore.userLoginResponse.value ? 'display' : 'hide'
      )
    }, { immediate: true })

    return {
      classObj,
      velocity,
      addCharacter,
      characterList: characterStore.characterList,
      layoutData: reactiveLayout
    }
  },
  name: 'the-play'
})
</script>

<style scoped lang="scss">
@use "../animations";
@use "../common";

#hello {
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
  background-color: yellow;
}

@include common.deep(".bottom-box") {
  background-color: yellow;
}

@include common.deep(".left-box") {
  background-color: cyan;
}

@include common.deep(".right-box") {
  background-color: darkblue;
}

.character-fade-leave-active, .character-fade-enter-active {
   transition: opacity .5s;
 }
.character-fade-leave-to, .character-fade-enter /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

* {
  box-sizing: border-box;
}
@include common.deep(".simple-center") {
  gap: 0.5rem;

  .scene-status {
    @include common.flex-box(row, null, flex-end, wrap);

    label {
      @include common.flex-box(column, null, flex-start);

      select {
        font-size: 120%;
        height: 2em;
      }
    }
  }

  .character-status-area {
    @include common.flex-box(row);
    max-width: 100vw;
    overflow-x: auto;
    gap: 0 0.2rem;

    .character-status {
      min-width: 3em;
      max-width: 5em;
      overflow: hidden;
      position: relative;
      @include common.flex-box(column, null, stretch);

      .character {
        width: 100%;
        font-size: 80%;
        overflow: hidden;
        position: relative;
        @include common.flex-box(row, center, center);

        &:before {
          content: '';
          display: block;
          padding-top: 100%;
        }

        span {
          @include common.position-full-size();
          @include common.flex-box(row, center, center);
        }
      }

      select {
        height: 2em;
      }
    }
  }
}

@include common.deep(".dramatic-scene") {
  border: 1px solid black;

  .character {
    width: 4em;
    height: 4em;
    overflow: hidden;
    margin: 3px 0 3px 3px;
    @include common.flex-box(row, center, center);

    &:last-child {
      margin-right: 3px;
    }
  }
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

  .velocity-column {
    flex: 1;
    @include common.flex-box(column);
    box-sizing: border-box;
    min-width: 3em;

    .character {
      width: calc(100% - 6px);
      font-size: 80%;
      overflow: hidden;
      position: relative;
      margin: 3px 3px 0 3px;
      @include common.flex-box(row, center, center);

      &:last-child {
        margin-bottom: 3px;
      }

      &:before {
        content: '';
        display: block;
        padding-top: 100%;
      }

      span {
        @include common.position-full-size();
        @include common.flex-box(row, center, center);
      }
    }

    &:first-child .label,
    &:last-child .label {
      background-color: rgba(0, 0, 0, 0.5);
      color: white;

      > .e,
      > .a {
        color: white;
      }
    }

    .label {
      background-color: rgba(255, 255, 255, 0.2);
      @include common.flex-box(column, null, flex-srart);
      box-sizing: border-box;
      height: 4em;
      border-top: 1px solid black;
      border-left: 1px solid black;
      border-right: 1px solid black;
      border-bottom: 1px solid rgba(0, 0, 0, 0.4);

      .k {
        font-weight: bold;
      }
      .e {
        color: gray;
        white-space: nowrap;
        font-size: 50%;
        overflow: hidden;
      }
      .a {
        color: gray;
        white-space: nowrap;
        overflow: hidden;
        font-size: 50%;
      }
    }
    .field {
      position: relative;
      background-color: rgba(255, 255, 255, 0.2);
      box-sizing: border-box;
      min-height: 5em;
      @include common.flex-box(column);
      flex: 1;
      border-style: solid;
      border-color: black;
      border-width: 0 1px 1px 1px;
      margin-bottom: 5px;
      padding-bottom: 2em;

      .n {
        position: absolute;
        @include common.flex-box(column, null, center);
        bottom: 0;
        width: 100%;
        height: 2em;
        font-weight: bold;
      }
    }
    .fumble {
      background-color: rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
      min-height: 5em;
      border: 1px solid black;
    }
  }
}

</style>
