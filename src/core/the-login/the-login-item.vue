<template>
  <flexible-data-layout :definition="layoutData">
    <template #room-no>
      [{{ r.roomNo }}]
    </template>
    <template #room-info>
      <div class="content">
        <template v-if="r.detail">
          <button class="room-btn" @click="selectRoom(r.roomNo)" v-show="r.roomNo !== selectedRoomNo">入室</button>
          {{ r.detail.roomName }}
        </template>
        <template v-else-if="r.status === 'initial-touched'">
          <div class="room-action-area" v-if="r.roomNo === selectedRoomNo">
            <input type="text" ref="roomNameInputElm" placeholder="[必須] 部屋名" v-model="roomName">
          </div>
          <template v-else>(creating)</template>
        </template>
        <template v-else>
          <button class="room-btn" @click="touchRoom(r.roomNo)">作成</button>
        </template>
      </div>
      <span class="date-time-set" v-if="r.status !== 'none'">
        <span class="date-time">
          作成：<i18n-d tag="span" :value="new Date(r.createDateTime)" :format="createDateTimeFormat"></i18n-d>
        </span>
        <span class="date-time">
          更新：<i18n-d tag="span" :value="new Date(r.updateDateTime)" :format="updateDateTimeFormat"></i18n-d>
        </span>
      </span>
      <span v-if="showDeleteMessage" class="delete-message">削除されました</span>
    </template>
    <template #room-operation>
      <template v-if="r.roomNo === selectedRoomNo">
        <template v-if="!r.detail">
          <input type="password" placeholder="入室パスワード" v-model="roomPassword">
          <button class="room-btn" :disabled="!roomName" @click="createRoom(r.roomNo, roomName, roomPassword)">作成</button>
        </template>
        <template v-else>
          <template v-if="lastRoomLoginType === ''">
            <input ref="roomPasswordInputElm" type="password" placeholder="部屋パスワード" v-model="roomPassword">
            <button class="room-btn" @click="loginRoom(r.roomNo, roomPassword)">確認</button>
          </template>
          <template v-else>
            <input ref="userNameInputElm" type="text" v-model="userName" placeholder="[必須] ユーザー名">
            <!-- ユーザー選択 -->
            <ul v-if="userList.length">
              <li v-for="u in userList" :key="u.name">
                <button v-touch="() => selectUser(u.name, u.type)">{{ u.name }}</button>
              </li>
            </ul>
            <input ref="userPasswordInputElm" type="password" placeholder="ユーザーパスワード" v-model="userPassword">
            <button @click="loginUser(userName, userType, userPassword)" :disabled="!userName">ユーザログイン</button>
            <select ref="userTypeSelectElm" v-model="userType">
              <option value="pl">プレイヤー</option>
              <option value="gm">ゲームマスター</option>
            </select>
          </template>
          <div v-if="userLoginResponse" class="raw-json">{{ JSON.stringify(userLoginResponse, null, "  ") }}</div>
        </template>
        <span class="room-create-description">※ 最後の入退室から1ヶ月経つと部屋は自動で消滅します。</span>
      </template>
    </template>
  </flexible-data-layout>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import { ClientRoomData } from '@/core/data/room'
import UserStore, { UserType } from '@/core/data/user'
import { useI18n } from 'vue-i18n'
import { makeComputedObject } from '@/core/utility/vue3'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const layoutData = require('./the-login-item.yaml')

export default defineComponent({
  name: 'the-login-item',
  emits: [],
  props: {
    r: {
      type: Object as PropType<ClientRoomData>,
      required: true
    }
  },
  setup(props) {
    const userTypeSelectElm = ref<HTMLSelectElement | null>(null)
    const roomNameInputElm = ref<HTMLInputElement | null>(null)
    const roomPasswordInputElm = ref<HTMLInputElement | null>(null)
    const userNameInputElm = ref<HTMLInputElement | null>(null)
    const userPasswordInputElm = ref<HTMLInputElement | null>(null)

    const roomName = ref('')
    const userName = ref('')
    const roomPassword = ref('')
    const userType = ref<UserType>('pl')
    const userPassword = ref('')
    const createDateTimeFormat = ref('pattern-1')
    const updateDateTimeFormat = ref('pattern-1')
    const showDeleteMessage = ref(false)

    const formatStr = (dateTime: number | null): string => {
      if (dateTime === null) return 'pattern-2'
      const today = new Date()
      const someDate = new Date(dateTime)
      const isToday = someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear()
      return isToday ? 'pattern-2' : 'pattern-1'
    }

    watch([() => props.r.createDateTime, () => props.r.updateDateTime], () => {
      createDateTimeFormat.value = formatStr(props.r.createDateTime || null)
      updateDateTimeFormat.value = formatStr(props.r.updateDateTime || null)
    }, { immediate: true })

    watch(() => props.r.status, () => {
      const status = props.r.status
      if (status === 'initial-touched') {
        setTimeout(() => {
          roomNameInputElm.value?.focus()
        }, 10)
      }
      showDeleteMessage.value = status === 'none'
    })

    const userStoreInjectObj = UserStore.injector()

    watch([() => userStoreInjectObj.lastRoomLoginType, () => userStoreInjectObj.selectedRoomNo], () => {
      if (userStoreInjectObj.selectedRoomNo !== props.r.roomNo) return
      const type = userStoreInjectObj.lastRoomLoginType
      if (type === '') {
        setTimeout(() => {
          userTypeSelectElm.value?.focus()
          setTimeout(() => {
            roomPasswordInputElm.value?.focus()
          }, 10)
        }, 10)
      }
      if (type === 'login') {
        setTimeout(() => {
          userTypeSelectElm.value?.focus()
          setTimeout(() => {
            userNameInputElm.value?.focus()
          }, 10)
        }, 10)
      }
      userType.value = type === 'create' ? 'gm' : 'pl'
    })

    return {
      userTypeSelectElm,
      ...useI18n(),
      createDateTimeFormat,
      updateDateTimeFormat,
      roomNameInputElm,
      roomPasswordInputElm,
      userNameInputElm,
      userPasswordInputElm,
      ...makeComputedObject(userStoreInjectObj),
      roomName,
      userName,
      roomPassword,
      userType,
      userPassword,
      showDeleteMessage,
      selectUser: (userNameVal: string, userTypeVal: UserType) => {
        userName.value = userNameVal
        userType.value = userTypeVal
        setTimeout(() => {
          userTypeSelectElm.value?.focus()
          setTimeout(() => {
            userPasswordInputElm.value?.focus()
          }, 10)
        }, 10)
      },
      layoutData
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@use "../../components/common";

select {
  margin-top: 0.5em;
}

@include common.deep(".room-no") {
  box-sizing: border-box;
  padding-right: 0.5rem;
}

@include common.deep(".room-info") {
  position: relative;

  .content {
    flex: 1;
    text-align: left;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .date-time-set {
    display: flex;
    flex-direction: column;
    font-size: 0.7em;
    align-items: flex-end;
  }

  .delete-message {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    display: flex;
    justify-content: center;
    flex-direction: column;
    font-size: 70%;
    animation: fadein-keyframes 3s ease-in-out 0s 1 forwards;

    @keyframes fadein-keyframes {
      0% {
        opacity: 1;
      }

      100% {
        opacity: 0;
      }
    }
  }
}

@include common.deep(".room-operation") {
  .room-create-description {
    font-size: 70%;
  }

  ul {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    list-style: none;

    > li {
      margin-bottom: 0.5em;
    }

    > li + li {
      margin-left: 1em;
    }
  }
}

.raw-json {
  white-space: pre;
  font-family: monospace;
  border: 1px solid gray;
  text-align: left;
}

.room-btn {
  margin-right: 0.5em;
}

input, select, button {
  height: 2em;
  box-sizing: border-box;
}

button {
  &:not(:disabled) {
    cursor: pointer;
  }
}
</style>
