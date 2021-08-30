<template>
  <span class="menu-btn" @click="onClickMenuButton()" :class="isMenuOpen ? 'closed' : ''">
    <span class="hr"></span>
    <span class="hr"></span>
    <span class="hr"></span>
  </span>
  <span class="right-pane-btn" @click="onClickRightPaneButton()" v-show="rightPaneTaskList.length" :class="isRightPaneOpen ? 'closed' : ''">
    <span class="hr"></span>
    <span class="hr"></span>
    <span class="hr"></span>
  </span>
  <div class="modal-area" :class="[`item-${menuItemList.length}`, isMenuOpen ? 'menu' : '']" @click="onClickMenuButton(false)" v-if="isMenuOpen || isRightPaneOpen">
    <transition name="drawer">
      <div class="drawer" @click.stop v-show="isMenuOpen">
          <span
            v-for="item in menuItemList"
            :key="item.type"
            class="item"
            @click="onClickMenuItem(item.type)"
          >{{ item.label }}</span>
      </div>
    </transition>
    <transition name="right-pane">
      <div class="right-pane" @click.stop v-show="isRightPaneOpen">
        <div class="container" v-for="t in rightPaneTaskList" :key="t.taskKey" :id="t.taskKey" :class="activeTaskList.some(lt => lt === t.taskKey) ? 'active' : ''">
          <div class="task-bar" @click="currentTask = t.taskKey">
            <span>{{ t.type }}</span>
            <button @click.stop="onTask(t.taskKey, 'open')" v-if="!activeTaskList.some(lt => lt === t.taskKey)">Open</button>
            <button @click.stop="onTask(t.taskKey, 'hide')" v-if="activeTaskList.some(lt => lt === t.taskKey)">Hide</button>
            <button @click.stop="onTask(t.taskKey, 'close')">Close</button>
          </div>
          <component :is="`${t.type}-pane`" @close="onTask(t.taskKey, 'close')"></component>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue'
import { v4 as uuidV4 } from 'uuid'
import UserStore from '@/core/data/user'

type MenuItem = {
  label: string;
  type: string;
  isUnique: boolean;
}

type RightPaneTask = {
  type: string;
  taskKey: string;
}

export default defineComponent({
  name: 'modal-area',
  setup() {
    const userStore = UserStore.injector()
    const menuItemList = reactive<MenuItem[]>([])
    const me = userStore.userList.find(u => u.key === userStore.userLoginResponse?.userKey)
    const userType = me?.type || 'pl'
    menuItemList.push({ label: 'ローカル設定', type: 'local-setting', isUnique: true })
    menuItemList.push({ label: 'ユーザー設定', type: 'user-setting', isUnique: true })
    menuItemList.push({ label: 'キャラクター', type: 'character', isUnique: false })
    if (userType === 'gm') {
      menuItemList.push({ label: 'シナリオ', type: 'scenario', isUnique: false })
      menuItemList.push({ label: 'シーン', type: 'scene', isUnique: false })
      menuItemList.push({ label: '共有メモ', type: 'memo', isUnique: false })
      menuItemList.push({ label: 'カットイン', type: 'cut-in', isUnique: false })
      menuItemList.push({ label: 'タグ', type: 'tag', isUnique: false })
      menuItemList.push({ label: '戦場表', type: 'battle-field', isUnique: false })
      menuItemList.push({ label: 'エニグマ', type: 'enigma', isUnique: false })
      menuItemList.push({ label: 'ペルソナ', type: 'persona', isUnique: false })
    }

    const rightPaneTaskList = ref<RightPaneTask[]>([])
    const activeTaskList = ref<string[]>([])
    const currentTask = ref<string | null>(null)

    watch(currentTask, () => {
      setTimeout(() => {
        if (!currentTask.value) return
        document.getElementById(currentTask.value)?.scrollIntoView(true)
      })
    })

    const isRightPaneOpen = ref(false)
    const onClickMenuItem = (type: string) => {
      isRightPaneOpen.value = true
      isMenuOpen.value = false
      if (menuItemList.find(m => m.type === type)?.isUnique) {
        const task = rightPaneTaskList.value.find(t => t.type === type)
        if (task) {
          currentTask.value = task.taskKey
          activeTaskList.value.splice(0, activeTaskList.value.length, task.taskKey)
          return
        }
      }
      const taskKey = uuidV4()
      rightPaneTaskList.value.splice(0, 0, { type, taskKey })
      activeTaskList.value.splice(0, activeTaskList.value.length, taskKey)
      currentTask.value = taskKey
    }

    const onClickRightPaneButton = () => {
      isRightPaneOpen.value = !isRightPaneOpen.value
    }

    const onTask = (taskKey: string, type: 'open' | 'hide' | 'close') => {
      if (type === 'open') {
        activeTaskList.value.push(taskKey)
      }
      if (type === 'hide') {
        const index = activeTaskList.value.findIndex(t => t === taskKey)
        if (index < 0) return
        activeTaskList.value.splice(index, 1)
      }
      if (type === 'close') {
        const index1 = rightPaneTaskList.value.findIndex(t => t.taskKey === taskKey)
        const index2 = activeTaskList.value.findIndex(t => t === taskKey)
        if (index1 < 0) return
        rightPaneTaskList.value.splice(index1, 1)
        if (index2 > -1) {
          activeTaskList.value.splice(index2, 1)
        }
        if (rightPaneTaskList.value.length > index1) {
          currentTask.value = rightPaneTaskList.value[index1].taskKey
          if (index2 > -1) {
            if (activeTaskList.value.findIndex(t => t === currentTask.value) < 0) {
              activeTaskList.value.push(currentTask.value)
            }
          }
        } else if (rightPaneTaskList.value.length && rightPaneTaskList.value.length === index1) {
          currentTask.value = rightPaneTaskList.value[index1 - 1].taskKey
          if (index2 > -1) {
            if (activeTaskList.value.findIndex(t => t === currentTask.value) < 0) {
              activeTaskList.value.push(currentTask.value)
            }
          }
        } else {
          currentTask.value = null
        }
        if (!rightPaneTaskList.value.length) {
          isRightPaneOpen.value = false
        }
      }
    }

    const isMenuOpen = ref(false)
    const onClickMenuButton = (force?: boolean) => {
      if (force === false) {
        isRightPaneOpen.value = false
        isMenuOpen.value = false
        return
      }
      isMenuOpen.value = !isMenuOpen.value
    }

    return {
      menuItemList,
      activeTaskList,
      isMenuOpen,
      onClickMenuButton,
      onTask,
      currentTask,
      rightPaneTaskList,
      onClickMenuItem,
      onClickRightPaneButton,
      isRightPaneOpen
    }
  }
})
</script>

<style scoped lang="scss">
@use "../common";
@use "sass:math";

.menu-btn {
  display: block;
  width: common.$header-height;
  height: common.$header-height;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  cursor: pointer;

  .hr {
    display: block;
    margin: 0;
    border: none;
    width: 50%;
    height: 4px;
    background: #000;
    transform-origin: 0 50%;
    position: absolute;
    top: 12px;
    left: 25%;
    transition: 0.3s;

    &:nth-of-type(2) {
      top: 22px;
    }
    &:nth-of-type(3) {
      top: 32px;
    }
  }

  &.closed .hr {
    left: 30%;

    &:nth-of-type(1) {
      transform: rotate(45deg);
      width: 58%;
    }

    &:nth-of-type(2) {
      opacity: 0;
    }

    &:nth-of-type(3) {
      top: 32px;
      transform: rotate(-45deg);
      width: 58%;
    }
  }
}

.right-pane-btn {
  display: block;
  width: common.$header-height;
  height: common.$header-height;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  cursor: pointer;

  .hr {
    display: block;
    margin: 0;
    border: none;
    width: 50%;
    height: 4px;
    background: #000;
    transform-origin: 0 50%;
    position: absolute;
    top: 12px;
    left: 25%;
    transition: 0.3s;

    &:nth-of-type(2) {
      top: 22px;
    }
    &:nth-of-type(3) {
      top: 32px;
    }
  }

  &.closed .hr {
    left: 30%;

    &:nth-of-type(1) {
      transform: rotate(45deg);
      width: 58%;
    }

    &:nth-of-type(2) {
      opacity: 0;
    }

    &:nth-of-type(3) {
      top: 32px;
      transform: rotate(-45deg);
      width: 58%;
    }
  }
}

.modal-area {
  position: absolute;
  top: calc(#{common.$header-height} + 1px);
  @include common.flex-box(row, flex-end, stretch);
  bottom: 0;
  left: 0;
  right: 0;
  backdrop-filter: blur(3px);
  z-index: 10;

  &.menu {
    justify-content: flex-start;
  }

  @for $c from 1 to 16 {
    &.item-#{$c} {
      $threshold: calc(#{common.$header-height} + #{common.$menu-padding} * 2 + #{common.$menu-gap} * (#{$c} - 1) + #{common.$menu-item-min-height} * #{$c});
      @media screen and (min-height: $threshold) {
        .drawer {
          max-width: max(20vw, 10em);
        }
        //.right-pane {
        //  max-width: calc(100vw - max(20vw, 10em) - #{common.$menu-padding} * 2);
        //}
      }
      @media screen and (max-height: $threshold) {
        .drawer .item {
          $half: math.div($c, 2);
          $prefer-height: calc((100vh - (48px + 8px * 2 + 8px * #{math.floor($half)})) / #{math.ceil($half)});
          max-height: $prefer-height;
          min-height: $prefer-height;
        }
        //.right-pane {
        //  max-width: calc(100vw - max(40vw, 20em) - #{common.$menu-padding} * 2 - #{common.$menu-gap});
        //}
      }
    }
  }

  .drawer,
  .right-pane {
    box-sizing: content-box;
    margin-top: -1px;
  }

  .drawer-enter-active,
  .drawer-leave-active {
    transition: all 0.1s ease;
  }
  .drawer-enter-from {
    transform: translateX(-50px);
    opacity: 0;
  }
  .drawer-leave-to {
    transform: translateX(-50px);
    opacity: 0;
  }
  .drawer-enter-to,
  .drawer-leave-from {
    transform: translateX(0);
    opacity: 1;
  }

  .drawer {
    @include common.flex-box(row, stretch, stretch, wrap);
    background-color: common.$menu-back-color;
    width: calc(max(40vw, 20em) + #{common.$menu-gap});
    max-height: calc(100vh - 48px);
    gap: common.$menu-gap;
    padding: common.$menu-padding;
    border-right: 1px solid #495478;
    justify-self: flex-start;

    .item {
      flex: 1;
      @include common.flex-box(row, center, center);
      max-height: common.$menu-item-max-height;
      min-height: common.$menu-item-min-height;
      min-width: max(20vw, 10em);
      max-width: max(20vw, 10em);
      transition: .2s all;
      background-color: white;

      &:not(.empty) {
        cursor: pointer;
        box-shadow: 0 1px 1px rgba(0,0,0,.5);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 10px rgba(0,0,0,.5);
        }
        &:active {
          transform: translateY(0);
          box-shadow: 0 1px 1px rgba(0,0,0,.5);
        }
      }
    }
  }

  .right-pane-enter-active,
  .right-pane-leave-active {
    transition: all 0.2s ease;
  }
  .right-pane-enter-from {
    transform: translateX(100%);
  }
  .right-pane-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }
  .right-pane-enter-to,
  .right-pane-leave-from {
    transform: translateX(0);
  }

  .right-pane {
    @include common.flex-box(column, stretch, flex-start);
    padding: 0.5rem;
    flex: 1;
    box-sizing: content-box;
    background-color: white;
    border-top: 1px solid #495478;
    border-left: 1px solid #495478;
    margin-left: -1px;
    overflow: auto;
    gap: 0.5rem;

    .container {
      @include common.flex-box(row, flex-start, flex-start, wrap);
      gap: 0.5rem;
      padding-top: 2em;
      position: relative;
      border-bottom: 1px solid gray;

      &:not(.active) > :not(:first-child) {
        display: none;
      }

      .task-bar {
        @include common.flex-box(row, space-between, center);
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2em;
        background-color: lightblue;
        padding: 0 0.5em;
        gap: 0.5em;
        overflow: hidden;

        >:first-child {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          text-align: left;
          flex: 1;
        }
      }
    }
  }
}
</style>
