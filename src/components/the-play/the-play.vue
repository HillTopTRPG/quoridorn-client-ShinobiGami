<template>
  <div id="the-play" :style="globalStyle">
    <flexible-data-layout :definition="layoutData" :barSetDelay="2700">
      <modal-area />
      <special-input-area @submit="onDiceCommand()" />
      <template #left-box>
        <div class="chat" v-for="c in chatList" :key="c.key" :style="getChatStyle(c)"><span class="dice-roll-scf" v-if="c.data?.type === 'dice-roll-scf'">{{ c.data?.diceRollResult }}</span><span class="from-label">{{ getFromLabel(c) }}</span>{{ c.data?.raw }}</div>
        <div class="chat-bottom" ref="chatBottomElm"></div>
      </template>
      <template #bottom-box>
        <select>
          <option value=""></option>
        </select>
        <textarea class="chat-input" @keypress.enter="onEnter($event)" v-model="chatInput"></textarea>
        <button @click="onChangeMode('SG')">SGコマンド</button>
      </template>
      <template #top-box></template>
      <template #simple-center>
        <scene-status-area />
        <character-status-area />
      </template>
      <template #dramatic-scene>
        <dramatic-scene-area />
      </template>
      <template #velocity-system>
        <velocity-column />
      </template>
      <template #right-box>
        <template v-for="c in characterList" :key="c.key">
          <character-detail-view
            :character="c"
          />
        </template>
      </template>
    </flexible-data-layout>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue'
import CharacterStore from '@/feature/character/data'
import ChatListStore, { BcdiceDiceRollResult, ChatStore } from '@/feature/chat-list/data'
import UserSettingStore from '@/feature/user-setting/data'
import UserStore from '@/core/data/user'
import { SlotUnionInfo } from '@/core/flexible-data-layout.vue'
import VelocityColumn from '@/components/the-play/velocity-column.vue'
import CharacterStatusArea from '@/components/the-play/area/character-status-area.vue'
import ModalArea from '@/components/the-play/modal-area.vue'
import CharacterDetailView from '@/components/the-play/character-detail-view.vue'
import DramaticSceneArea from '@/components/the-play/area/dramatic-scene-area.vue'
import SceneStatusArea from '@/components/the-play/area/scene-status-area.vue'
import SpecialInputArea from '@/components/the-play/special-input-area.vue'
import { StoreData } from '@/core/utility/FileUtility'
import SpecialInputStore from '@/feature/special-input/data'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const layoutData = require('./the-play.yaml')

export default defineComponent({
  components: { SpecialInputArea, SceneStatusArea, DramaticSceneArea, CharacterDetailView, ModalArea, CharacterStatusArea, VelocityColumn },
  setup() {
    const characterStore = CharacterStore.injector()
    const specialInputStore = SpecialInputStore.injector()
    specialInputStore.characterStore = characterStore
    const chatBottomElm = ref<HTMLElement | null>(null)
    const userSettingStore = UserSettingStore.injector()
    const chatListStore = ChatListStore.injector()
    const userStore = UserStore.injector()
    const selfName = computed(() => userStore.selfUser?.name)
    const characterList = computed(() => characterStore.characterList)
    const targetInfoList = computed(() =>
      userStore.userList
        .flatMap(u => u.refList.filter(r => r.type === 'character').map(r => ({
          user: u.name,
          character: characterStore.characterList.find(c => c.key === r.key)?.data?.sheetInfo.characterName || ''
        })))
    )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globalStyle = reactive<any>({})
    watch(() => userSettingStore.userSetting, () => {
      const a = userSettingStore.userSetting
      globalStyle['--accent1-color'] = a?.accent1Color || globalStyle['--accent1-color']
      globalStyle['--accent2-color'] = a?.accent2Color || globalStyle['--accent2-color']
      globalStyle['--font-color'] = a?.fontColor || globalStyle['--font-color']
      globalStyle['--skill-table-font-size'] = a?.skillTableFontSize ? a?.skillTableFontSize + 'px' : '' || globalStyle['--skill-table-font-size']
      globalStyle['--ninja-arts-table-font-size'] = a?.ninjaArtsTableFontSize ? a?.ninjaArtsTableFontSize + 'px' : '' || globalStyle['--ninja-arts-table-font-size']
      globalStyle['--background-table-font-size'] = a?.backgroundTableFontSize ? a?.backgroundTableFontSize + 'px' : '' || globalStyle['--background-table-font-size']
      globalStyle['--special-arts-table-font-size'] = a?.specialArtsTableFontSize ? a?.specialArtsTableFontSize + 'px' : '' || globalStyle['--special-arts-table-font-size']
      globalStyle['--ninja-tool-table-font-size'] = a?.ninjaToolTableFontSize ? a?.ninjaToolTableFontSize + 'px' : '' || globalStyle['--ninja-tool-table-font-size']
    }, { deep: true, immediate: true })

    const reactiveLayout = reactive<SlotUnionInfo>(layoutData)

    const chatInput = ref('')

    const diceRollAndChat = async (cmd: string): Promise<{ insertChat: () => Promise<void>; bcdiceResult: BcdiceDiceRollResult | null }> => {
      let bcdiceResult: BcdiceDiceRollResult
      try {
        bcdiceResult = await chatListStore.diceRoll(cmd)
      } catch (_) {
        return {
          bcdiceResult: null,
          insertChat: async () => { /**/ }
        }
      }
      if (!bcdiceResult.text) {
        return {
          bcdiceResult: null,
          insertChat: async () => { /**/ }
        }
      }
      let diceResult = ''
      if (bcdiceResult.critical) diceResult = 'スペシャル'
      else if (bcdiceResult.success) diceResult = '成功'
      if (bcdiceResult.fumble) diceResult = 'ファンブル'
      else if (bcdiceResult.failure) diceResult = '失敗'
      console.log(JSON.stringify(bcdiceResult, null, '  '))
      return {
        bcdiceResult,
        insertChat: async () => {
          let raw = bcdiceResult.text || ''
          const index1 = raw.indexOf('→')
          if (index1 > -1) {
            const index2 = raw.indexOf('→', index1 + 1)
            if (index2 > -1) {
              raw = raw.substring(index1 + 1, index2).trim()
            }
          }
          console.log(bcdiceResult.text)
          console.log(raw)
          await chatListStore.insertData({
            raw,
            tag: [''],
            tab: '',
            type: diceResult ? 'dice-roll-scf' : 'dice-roll',
            from: diceResult ? '' : 'system',
            diceRollResult: diceResult || null
          })
        }
      }
    }

    const onEnter = async () => {
      await chatListStore.insertData({
        raw: chatInput.value,
        tag: [''],
        tab: '',
        type: 'user',
        from: userStore.selfUser?.name || '',
        diceRollResult: null
      })
      const { bcdiceResult, insertChat } = await diceRollAndChat(chatInput.value)
      if (bcdiceResult) {
        await insertChat()
      }
      chatInput.value = ''
    }

    const onChangeMode = (m: 'normal' | 'SG' | 'D6' | 'D6>=?') => {
      specialInputStore.setCmdType(m)
    }

    const onDiceCommand = async () => {
      const command = specialInputStore.command
      const from = specialInputStore.from
      await chatListStore.insertData({
        raw: command,
        tag: [''],
        tab: '',
        type: from.type === 'character' ? 'character' : 'system',
        from: from.key || userStore.selfUser?.name || '',
        diceRollResult: null
      })
      const { bcdiceResult, insertChat } = await diceRollAndChat(command)
      if (bcdiceResult) {
        await insertChat()
      }
      specialInputStore.setCmdType('normal')
    }

    const chatList = computed(() => chatListStore.list)
    watch(() => [...chatList.value], (newList, oldList) => {
      console.log(newList.length, oldList.length)
      if (newList.length > oldList.length) {
        setTimeout(() => {
          chatBottomElm.value?.scrollIntoView(false)
        })
      }
    })

    return {
      chatBottomElm,
      onChangeMode,
      onDiceCommand,
      chatInput,
      globalStyle,
      characterList,
      layoutData: reactiveLayout,
      chatList,
      onEnter,
      getFromLabel: (chat: StoreData<ChatStore>): string => {
        if (!chat || !chat.data) return ''
        let fromLabel = ''
        const type = chat.data.type
        if (type === 'character') {
          const c = characterStore.characterList.find(c => c.key === chat.data?.from)
          fromLabel = c?.data?.sheetInfo.characterName || ''
        }
        if (type === 'user') {
          const u = userStore.userList.find(u => u.name === chat.data?.from)
          fromLabel = `${u?.name || '???'}(${u?.type.toUpperCase() || '??'})`
        }
        if (type === 'system') {
          fromLabel = 'System'
        }
        if (type === 'dice-roll') {
          fromLabel = ''
        }
        if (fromLabel) fromLabel += '：'
        return fromLabel
      },
      getChatStyle: (chat: StoreData<ChatStore>): Record<string, string> => {
        if (!chat || !chat.data) return {}
        const result: Record<string, string> = {}
        const type = chat.data.type
        if (type === 'character') {
          const c = characterStore.characterList.find(c => c.key === chat.data?.from)
          result['--color'] = c?.data?.color || '#000'
        }
        if (type === 'user') {
          result['--color'] = userSettingStore.userSetting?.fontColor || '#000'
        }
        if (type === 'system' || type === 'dice-roll' || type === 'dice-roll-scf') {
          result['--color'] = '#000'
        }
        if (type === 'dice-roll' || type === 'dice-roll-scf') {
          result['margin-top'] = '-0.5rem'
        }
        return result
      }
    }
  },
  name: 'the-play'
})
</script>

<style scoped lang="scss">
@use "../common";

#the-play {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100vw;
  box-sizing: border-box;
}

.chat {
  display: inline;
  color: var(--color);
  text-align: left;
  word-wrap: break-word;
  overflow-wrap: anywhere;
  word-break: break-all;

  .from-label {
    font-weight: bold;
    white-space: nowrap;
  }

  .dice-roll-scf {
    border: 1px solid gray;
    border-radius: 3px;
    padding: 0 0.2rem;
    white-space: nowrap;
    margin-right: 0.3rem;
  }
}

textarea {
  resize: horizontal;
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

@include common.deep(".left-box") {
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
