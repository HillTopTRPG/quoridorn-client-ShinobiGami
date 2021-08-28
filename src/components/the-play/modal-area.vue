<template>
  <span class="menu-btn" @click="onClickMenuButton()" :class="isMenuOpen ? 'closed' : ''">
    <span class="hr"></span>
    <span class="hr"></span>
    <span class="hr"></span>
  </span>
  <div class="modal-area" :class="[`item-${menuItemList.length}`, isMenuOpen ? 'menu' : '']" @click="onClickMenuButton(false)" v-if="isMenuOpen || rightPaneType">
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
      <div class="right-pane" @click.stop  :class="rightPaneType" v-show="rightPaneType">
        <button @click="rightPaneType = ''">閉じる</button>
        <div class="container">
          <ope-user-setting />
        </div>
        <div class="container">
          <ope-character />
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import UserStore from '@/core/data/user'
import OpeCharacter from '@/feature/character/component/ope-character.vue'
import OpeUserSetting from '@/feature/user-setting/component/ope-user-setting.vue'

type MenuItem = {
  label: string;
  type: string;
}

export default defineComponent({
  name: 'modal-area',
  components: { OpeUserSetting, OpeCharacter },
  setup() {
    const userStore = UserStore.injector()
    const menuItemList = reactive<MenuItem[]>([])
    const me = userStore.userList.find(u => u.key === userStore.userLoginResponse?.userKey)
    const userType = me?.type || 'pl'
    menuItemList.push({ label: 'ローカル設定', type: 'local' })
    menuItemList.push({ label: 'ユーザー設定', type: 'user' })
    menuItemList.push({ label: 'キャラクター', type: 'character' })
    if (userType === 'gm') {
      menuItemList.push({ label: 'シナリオ', type: 'scenario' })
      menuItemList.push({ label: 'シーン', type: 'scene' })
      menuItemList.push({ label: '共有メモ', type: 'memo' })
      menuItemList.push({ label: 'カットイン', type: 'cutin' })
      menuItemList.push({ label: 'タグ', type: 'tag' })
      menuItemList.push({ label: '戦場表', type: 'bf' })
      menuItemList.push({ label: 'エニグマ', type: 'enigma' })
      menuItemList.push({ label: 'ペルソナ', type: 'persona' })
    }

    const rightPaneTaskList = ref<string[]>([])

    const rightPaneType = ref('')
    const onClickMenuItem = (type: string) => {
      rightPaneType.value = type
      isMenuOpen.value = false
      rightPaneTaskList.value.splice(0, 0, type)
    }

    const isMenuOpen = ref(false)
    const onClickMenuButton = (force?: boolean) => {
      if (force === false) {
        rightPaneType.value = ''
        isMenuOpen.value = false
        rightPaneTaskList.value.splice(0, rightPaneTaskList.value.length)
        return
      }
      isMenuOpen.value = !isMenuOpen.value
    }

    return {
      menuItemList,
      isMenuOpen,
      onClickMenuButton,
      rightPaneTaskList,
      onClickMenuItem,
      rightPaneType
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
  position: fixed;
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
    }
  }
}
</style>
