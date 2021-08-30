<template>
  <div id="screen-wrapper" :class="[mode, isHideMascotView ? 'animation' : '']">
    <img class="mascot-normal" v-if="mode === 'login'" src="https://quoridorn.com/img/mascot/normal/mascot_normal.png" alt="">
    <img class="mascot-normal slide" v-if="isHideMascotView" src="https://quoridorn.com/img/mascot/normal/mascot_normal.png" alt="">
    <transition name="the-login">
      <div id="the-login" :class="classObj" v-if="mode === 'login'">
        <div v-show="!roomList.length">サーバー通信中</div>
        <flexible-data-layout :definition="layoutData" v-show="roomList.length">
          <template #title>
            <h1 class="name">{{ serverName }}</h1>
          </template>
          <template #room-list-header>
            <div class="inline-radio">
              <label><input type="radio" name="filter-mode" value="none" v-model="filterType"><span>すべて</span></label>
              <label><input type="radio" name="filter-mode" value="empty" v-model="filterType"><span>作成</span></label>
              <label><input type="radio" name="filter-mode" value="exists" v-model="filterType"><span>入室</span></label>
            </div>
          </template>
          <template #info-block>
            <ul class="server-description">
              <li v-for="(d, idx) in serverDescription" :key="idx" v-html="d"></li>
            </ul>
            <pre class="term-of-use">{{ termsOfUse }}</pre>
          </template>
          <template #room-list>
            <ol>
              <template
                v-for="r in roomList"
                :key="r.roomNo"
              >
                <li
                  :class="selectedRoomNo === r.roomNo ? 'selected' : ''"
                  v-if="
              filterType === 'none' ||
              selectedRoomNo === r.roomNo ||
              (filterType === 'empty' && r.status === 'none') ||
              (filterType === 'exists' && r.detail)
            "
                >
                  <the-login-item :r="r"></the-login-item>
                </li>
              </template>
              <li v-if="!roomList.length">部屋なし</li>
            </ol>
          </template>
        </flexible-data-layout>
      </div>
    </transition>

    <room-data-provider :modules="modules" v-if="mode === 'play'">
      <room-data-sync-provider :modules="modules">
        <slot />
      </room-data-sync-provider>
    </room-data-provider>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import RoomStore from '@/core/data/room'
import UserStore from '@/core/data/user'
import TheLoginItem from '@/core/the-login/the-login-item.vue'
import { pick } from '@/core/utility/typescript'
import { MadeStore, makeComputedObject } from '@/core/utility/vue3'
import RoomDataProvider from '@/core/provider/RoomDataProvider.vue'
import RoomDataSyncProvider from '@/core/provider/RoomDataSyncProvider.vue'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const layoutData = require('./the-login.yaml')

type FilterMode = 'none' | 'empty' | 'exists'

export default defineComponent({
  name: 'the-login',
  components: { RoomDataSyncProvider, RoomDataProvider, TheLoginItem },
  emits: ['loggedIn'],
  props: {
    modules: {
      type: Array as PropType<MadeStore<{ ready: boolean }>[]>,
      required: true
    }
  },
  setup() {
    const mode = ref<'login' | 'play'>('login')
    const isHideMascotView = ref(false)
    const classObj = ref<string[]>(['display'])
    const filterType = ref<FilterMode>('none')

    const userStore = UserStore.injector()

    watch(() => userStore.userLoginResponse, () => {
      classObj.value.splice(
        0,
        1,
        userStore.userLoginResponse ? 'hide' : 'display'
      )
      mode.value = userStore.userLoginResponse ? 'play' : 'login'
      if (mode.value === 'play') {
        isHideMascotView.value = true
        setTimeout(() => {
          isHideMascotView.value = false
        }, 2600)
      }
    })

    return {
      filterType,
      mode,
      isHideMascotView,
      classObj,
      ...pick(makeComputedObject(RoomStore.injector()), 'serverName', 'termsOfUse', 'roomList', 'serverDescription'),
      ...pick(makeComputedObject(userStore), 'selectedRoomNo'),
      layoutData
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@use "../../components/animations";
@use "../../components/common";

#screen-wrapper {
  @include common.flex-box(row, space-between, stretch);
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 200vw;
  transition-property: none;
  transition-duration: animations.$play-slide-animation-duration;
  transition-delay: animations.$play-slide-animation-delay;
  transition-timing-function: linear;

  &.animation {
    transition-property: transform;
  }

  &.login {
    transform: translateX(0);
  }

  &.play {
    transform: translateX(-100vw);
  }
}

.mascot-normal {
  position: absolute;
  right: 100vw;
  bottom: 0;
  width: 40vmin;
  height: 40vmin;
  transform: translate(0, 0) rotate(-27deg);
  opacity: 0.5;
  z-index: 2;

  &.slide {
    animation:
      mascot-setup animations.$play-slide-animation-delay linear 0s 1 normal forwards,
      poyooon calc(#{animations.$play-slide-animation-duration} / #{animations.$poyooon-count}) linear animations.$play-slide-animation-delay animations.$poyooon-count normal forwards,
      last-hide 1s linear animations.$play-slide-animation-delay 1 normal forwards
    ;
  }
}

#rooms-wrap {
  @include common.position-full-size(fixed);
}

.the-login-leave-active {
  transition-delay: animations.$play-slide-animation-delay;
  transition-duration: animations.$play-slide-animation-duration;
  transition-property: opacity;
}

.the-login-leave-to {
  opacity: 0;
}

#the-login {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  box-sizing: border-box;
  bottom: 0;
  z-index: 1;
  overflow-y: scroll;
  border-right: 2px solid black;
  border-left: 2px solid black;
}

@include common.deep(".title") {
  h1 {
    margin: 0;
    justify-self: center;
  }
}

@include common.deep(".info-block") {
  ul.server-description {
    padding: 0.5em;
    margin: 0;
    font-size: 80%;
    list-style: none;

    li {
      margin-left: 1em;
      text-align: left;
    }
  }

  pre.term-of-use {
    position: relative;
    text-align: left;
    padding: 1em 1em 1em 3rem;
    margin: 0 0 1em 0;
    white-space: pre-wrap;

    &::before {
      content: 'i';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0.5rem;
      margin: auto;
      width: 2rem;
      height: 2rem;
      background-color: #4287f5;
      font-weight: bold;
      font-size: 1.5em;
      color: white;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
}

@include common.deep(".room-list-header") {
  .inline-radio {
    @include common.flex-box(row);
    white-space: nowrap;
    min-width: 15em;
    width: 100%;
    max-width: 100%;
    margin-bottom: 0.5em;
    box-sizing: border-box;

    label {
      position: relative;
      box-sizing: border-box;
      flex: 1;
      @include common.flex-box(row, stretch, stretch);
      cursor: pointer;

      &:last-child span {
        border-right: 1px solid #b6b6b6;
      }
    }

    input {
      display: none;

      &:checked + span {
        background: #d81b60;
        color: #fff;
      }
    }

    span {
      color: #b6b6b6;
      background: #fff;
      @include common.flex-box(row, center, center);
      height: 2em;
      box-sizing: border-box;
      font-weight: bold;
      flex: 1;
      pointer-events: none;
      border-left: 1px solid #b6b6b6;
    }
  }
}

@include common.deep(".room-list") {
  max-width: 100vw;

  ol {
    padding: 0;
    margin: 0;

    > li {
      list-style-type: none;
      @include common.flex-box(row, null, stretch);
      overflow: hidden;
      white-space: nowrap;
      border-top: 1px dashed lightgray;
      padding: 0.4em 0;

      &.selected {
        padding-bottom: 2em;
      }
    }
  }
}
</style>
