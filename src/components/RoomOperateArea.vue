<template>
  <div v-show="!roomList.length">データ取得中</div>
  <flexible-data-layout :definition="layoutData" v-show="roomList.length">
    <template #title>
      <h1 class="name">{{ serverName }}</h1>
    </template>
    <template #room-list-header>
      <span>部屋一覧</span>
    </template>
    <template #info-block>
      <ul>
        <li v-for="(d, idx) in serverDescription" :key="idx" v-html="d"></li>
      </ul>
      <pre>{{ termsOfUse }}</pre>
    </template>
    <template #room-list>
      <ol>
        <li v-for="r in roomList" :key="r.roomNo" :class="selectedRoomNo === r.roomNo ? 'selected' : ''">
          <room-operate-item :r="r"></room-operate-item>
        </li>
        <li v-if="!roomList.length">部屋なし</li>
      </ol>
    </template>
  </flexible-data-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import RoomStore from '@/store/room'
import UserStore from '@/store/user'
import RoomOperateItem from '@/components/RoomOperateItem.vue'
import { pick } from '@/utility/typescript'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const layoutData = require('./room-operation-area.layout.yaml')

export default defineComponent({
  name: 'room-operate-area',
  components: { RoomOperateItem },
  setup() {
    return {
      ...pick(RoomStore.injector(), 'serverName', 'termsOfUse', 'roomList', 'serverDescription'),
      ...pick(UserStore.injector(), 'selectedRoomNo'),
      layoutData
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.room-no {
  width: 3em;
}
.raw-json {
  white-space: pre;
  font-family: monospace;
  border: 1px solid gray;
  text-align: left;
}
.room-list-header {
  span {
    align-self: center;
    font-weight: bold;
  }
}

.room-list {
  li {
    display: flex;
    flex-direction: column;
  }
}

h1 {
  margin: 0;
  justify-self: center;
}

li {
  text-align: left;
}

ol {
  padding: 0;
  margin: 0;

  li {
    list-style-type: none;
    display: flex;
    align-items: stretch;
    overflow: hidden;
    white-space: nowrap;
    border-top: 1px dashed lightgray;
    padding: 0.4em 0;

    &.selected {
      padding: 2em 0;
      background-color: lightcyan;
    }
  }
}

button {
  cursor: pointer;
}

ul {
  border-top: 1px solid gray;
  padding: 0.5em;
  margin: 0;

  li {
    margin-left: 1em;
  }
}

pre {
  position: relative;
  text-align: left;
  border-top: 1px solid gray;
  border-bottom: 1px solid gray;
  padding: 1em 1em 1em 3rem;
  margin-bottom: 1em;
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
</style>
