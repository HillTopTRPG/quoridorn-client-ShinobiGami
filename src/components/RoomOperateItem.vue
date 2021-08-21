<template>
  <flexible-data-layout :definition="layoutData">
    <template #room-no>
      [{{ r.roomNo }}]
    </template>
    <template #room-info>
      <template v-if="r.detail">
        {{ r.detail.roomName }} - {{ r.detail.loggedIn }}/{{ r.detail.memberNum }}
        <button class="room-btn" @click="selectRoom(r.roomNo)" v-show="r.roomNo !== selectedRoomNo">入室</button>
      </template>
      <template v-else-if="r.status === 'initial-touched'">
        <span>部屋作成</span>
        <div class="room-action-area" v-if="r.roomNo === selectedRoomNo">
          <input type="text" placeholder="部屋名" v-model="roomName">
          <input type="password" placeholder="入室パスワード" v-model="roomPassword">
          <button class="room-btn" @click="createRoom(r.roomNo, roomName, roomPassword)">確定</button>
        </div>
        <template v-else>(creating)</template>
      </template>
      <template v-else>
        <button class="room-btn" @click="touchRoom(r.roomNo)">部屋作成</button>
      </template>
    </template>
    <template #room-operation>
      <div class="room-action-area" v-if="r.detail && r.roomNo === selectedRoomNo">
        <template v-if="lastRoomLoginType === ''">
          <input type="password" placeholder="部屋パスワード" v-model="roomPassword">
          <button class="room-btn" @click="loginRoom(r.roomNo, roomPassword)">確認</button>
        </template>
        <template v-else>
          <ul>
            <li v-for="u in userList" :key="u.name">
              <button v-touch="() => selectUser(u.name, u.type)">{{ u.name }}</button>
            </li>
          </ul>
          <button @click="loginUser(userName, userType, userPassword)" :disabled="!userName">ユーザログイン</button>
          <input type="text" v-model="userName" placeholder="[必須] ユーザー名">
          <input type="password" placeholder="ユーザーパスワード" v-model="userPassword">
          <select v-model="userType">
            <option value="pl">プレイヤー</option>
            <option value="gm">ゲームマスター</option>
          </select>
        </template>
        <div v-if="userLoginResponse" class="raw-json">{{ JSON.stringify(userLoginResponse, null, "  ") }}</div>
      </div>
    </template>
  </flexible-data-layout>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import { ClientRoomData } from '@/store/room'
import UserStore, { UserType } from '@/store/user'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const layoutData = require('./room-operation-item.layout.yaml')

export default defineComponent({
  name: 'room-operate-item',
  emits: [],
  props: {
    r: {
      type: Object as PropType<ClientRoomData>,
      required: true
    }
  },
  setup() {
    const roomName = ref('')
    const userName = ref('')
    const roomPassword = ref('')
    const userType = ref<UserType>('pl')
    const userPassword = ref('')

    const userStoreInjectObj = UserStore.injector()

    watch(userStoreInjectObj.lastRoomLoginType, () => {
      userType.value = userStoreInjectObj.lastRoomLoginType.value === 'create' ? 'gm' : 'pl'
    })

    return {
      ...userStoreInjectObj,
      roomName,
      userName,
      roomPassword,
      userType,
      userPassword,
      selectUser: (userNameVal: string, userTypeVal: UserType) => {
        userName.value = userNameVal
        userType.value = userTypeVal
      },
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

li {
  text-align: left;
}

input, select, button {
  height: 2em;
  box-sizing: border-box;
}

button {
  cursor: pointer;
}

ul {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0.5em;
  margin: 0;
  list-style: none;

  li {
    margin-left: 1em;
  }
}
</style>
