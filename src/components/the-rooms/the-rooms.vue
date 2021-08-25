<template>
  <div class="mascot-normal" :class="classObj"></div>
  <div class="mascot-slide-out" :class="classObj"></div>
  <div id="the-rooms" :class="classObj">
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
              <the-rooms-item :r="r"></the-rooms-item>
            </li>
          </template>
          <li v-if="!roomList.length">部屋なし</li>
        </ol>
      </template>
    </flexible-data-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import RoomStore from '@/store/room'
import UserStore from '@/store/user'
import TheRoomsItem from '@/components/the-rooms/the-rooms-item.vue'
import { pick } from '@/utility/typescript'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const layoutData = require('./the-rooms.yaml')

type FilterMode = 'none' | 'empty' | 'exists'

export default defineComponent({
  name: 'the-rooms',
  components: { TheRoomsItem },
  emits: ['loggedIn'],
  setup() {
    const classObj = ref<string[]>(['display'])
    const filterType = ref<FilterMode>('none')

    const userStore = UserStore.injector()

    watch(userStore.userLoginResponse, () => {
      classObj.value.splice(
        0,
        1,
        userStore.userLoginResponse.value ? 'hide' : 'display'
      )
    }, { immediate: true })

    return {
      filterType,
      classObj,
      ...pick(RoomStore.injector(), 'serverName', 'termsOfUse', 'roomList', 'serverDescription'),
      ...pick(userStore, 'selectedRoomNo'),
      layoutData
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@use "../animations";
@use "../common";

.mascot-normal {
  position: fixed;
  right: 0;
  bottom: 0;
  width: 40vmin;
  height: 40vmin;
  transform: translateX(0) rotate(-27deg);
  background-image: url("https://quoridorn.com/img/mascot/normal/mascot_normal.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-origin: border-box;
  background-position: right center;

  &:after {
    content: "";
    @include common.position-full-size();
    background-color: rgba(255, 255, 255, 0.4);
  }

  &.hide {
    display: none;
    transform: translateX(-100vw) rotate(-27deg);

    &:after {
      background-color: rgba(255, 255, 255, 0);
    }
  }
}

.mascot-slide-out {
  position: fixed;
  z-index: 2;
  right: 0;
  bottom: 0;
  width: 40vmin;
  height: 40vmin;
  transform: translate(0, 0) rotate(-27deg);
  background-image: url("https://quoridorn.com/img/mascot/normal/mascot_normal.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-origin: border-box;
  background-position: right center;

  &:after {
    content: "";
    @include common.position-full-size();
    background-color: rgba(255, 255, 255, 0.4);
  }

  &.display {
    display: none;
  }

  &.hide {
    animation-name: mascot-slide;
    animation-fill-mode: both;
    animation-duration: animations.$login-animation-duration;
    animation-iteration-count: 1;
    animation-timing-function: linear;
    animation-delay: 0s;
    animation-direction: normal;

    &:after {
      animation-name: bg-color-to-transparent;
      animation-fill-mode: both;
      animation-duration: animations.$play-slide-animation-delay;
      animation-iteration-count: 1;
      animation-timing-function: linear;
      animation-delay: 0s;
      animation-direction: normal;
    }
  }
}

#the-rooms {
  z-index: 1;
  @include common.position-full-size(fixed);
  overflow-y: auto;

  transition: all animations.$play-slide-animation-duration animations.$play-slide-animation-delay linear;
  &.display {
    transform: translateX(0);
  }
  &.hide {
    transform: translateX(-100vw);
  }
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
