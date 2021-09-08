<template>
  <div id="the-play" :style="globalStyle">
    <flexible-data-layout :definition="layoutData" :barSetDelay="2700">
      <modal-area />
      <special-input-area @submit="onDiceCommand()" />
      <div
        class="history-block"
        @click="onEndDiceRoll()"
        :style="{'--bottom': bottomHeight}" v-if="chatHistoryList.length"
        :class="[chatHistoryList[0].viewTextInfo.isMe ? 'image-left' : 'image-right']"
      >
        <div
          class="view-text first"
          @click="onEndDiceRoll()"
          :style="{
            '--color': chatHistoryList[0].viewTextInfo?.color,
            '--image': chatHistoryList[0].viewTextInfo?.standImage,
            '--offset': 0
          }"
          v-if="chatHistoryList[0].viewTextInfo"
        >
          <span>{{ chatHistoryList[0].viewTextInfo?.from }}{{ chatHistoryList[0].viewTextInfo?.text }}</span>
          <div class="h-box">
            <span class="dice-roll-scf" v-if="chatHistoryList[0].viewTextInfo?.diceRollResult">{{ chatHistoryList[0].viewTextInfo?.diceRollResult }}</span>
            <span>{{ chatHistoryList[0].viewTextInfo?.diceText }}</span>
          </div>
        </div>
        <div class="img" :style="{ '--image': chatHistoryList[0].viewTextInfo.standImage }" v-if="chatHistoryList[0].viewTextInfo.standImage">
          <div
            v-for="(pip, idx) in chatHistoryList[0].pips"
            :key="`${chatHistoryList[0].key}-${idx}`"
            class="dice-wrap roll"
            :class="`${pip[0]}-${pip[1]}`"
            :style="{'--offset': idx, '--dice-count': chatHistoryList[0].pips.length, '--color': chatHistoryList[0].viewTextInfo?.color}"
          >
            <div class="dice"></div>
          </div>
        </div>
        <div class="history">
          <template v-for="(h, idx) in chatHistoryList" :key="h.key">
            <div
              class="view-text"
              :style="{
                '--color': h.viewTextInfo?.color,
                '--image': h.viewTextInfo?.standImage,
                '--offset': idx
              }"
              :class="[chatHistoryList[0].viewTextInfo.isMe ? 'image-left' : 'image-right', idx ? 'old' : 'first']"
              v-if="h.viewTextInfo && idx > 0"
            >
              <span>{{ h.viewTextInfo?.from }}{{ h.viewTextInfo?.text }}</span>
              <div class="h-box">
                <span class="dice-roll-scf" v-if="h.viewTextInfo?.diceRollResult">{{ h.viewTextInfo?.diceRollResult }}</span>
                <span>{{ h.viewTextInfo?.diceText }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
      <template #left-box>
        <template v-for="c in chatList" :key="c.key">
          <div class="chat" :style="getChatStyle(c.data)">
            <span class="from-label">{{ getFromLabel(c.data || null) }}</span>
            {{ c.data?.raw }}
          </div>
          <div class="chat dice-result" :style="getChatStyle(c.data)" v-if="c.data?.diceRaw">
            <span class="dice-roll-scf" v-if="c.data?.diceType === 'dice-roll-scf'">{{ c.data?.diceRollResult }}</span>
            {{ c.data?.diceRaw }}
          </div>
        </template>
        <div class="chat-bottom" ref="chatBottomElm"></div>
      </template>
      <template #bottom-box>
        <select v-model="from">
          <option :value="selfName">{{ selfName }}</option>
          <option :value="n.key" v-for="n in targetCharacterList" :key="n.key">{{ n.name }}</option>
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
import MediaListStore from '@/feature/media-list/data'
import ChatListStore, { BcdiceDiceRollResult, ChatStore } from '@/feature/chat-list/data'
import UserSettingStore from '@/feature/user-setting/data'
import UserStore from '@/core/data/user'
import { getBlock, SlotUnionInfo } from '@/core/flexible-data-layout.vue'
import VelocityColumn from '@/components/the-play/velocity-column.vue'
import CharacterStatusArea from '@/components/the-play/area/character-status-area.vue'
import ModalArea from '@/components/the-play/modal-area.vue'
import CharacterDetailView from '@/components/the-play/character-detail-view.vue'
import DramaticSceneArea from '@/components/the-play/area/dramatic-scene-area.vue'
import SceneStatusArea from '@/components/the-play/area/scene-status-area.vue'
import SpecialInputArea from '@/components/the-play/special-input-area.vue'
import SpecialInputStore from '@/feature/special-input/data'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const layoutData = require('./the-play.yaml')

export default defineComponent({
  components: { SpecialInputArea, SceneStatusArea, DramaticSceneArea, CharacterDetailView, ModalArea, CharacterStatusArea, VelocityColumn },
  setup() {
    const characterStore = CharacterStore.injector()
    const mediaListStore = MediaListStore.injector()
    const specialInputStore = SpecialInputStore.injector()
    specialInputStore.characterStore = characterStore
    const chatBottomElm = ref<HTMLElement | null>(null)
    const userSettingStore = UserSettingStore.injector()
    const chatListStore = ChatListStore.injector()
    const userStore = UserStore.injector()
    const characterList = computed(() => characterStore.characterList)
    const selfName = computed(() => userStore.selfUser?.name || null)
    const targetCharacterList = computed(() =>
      userStore.selfUser?.refList?.filter(r => r.type === 'character')
        .map(r => ({ name: characterStore.characterList.find(c => c.key === r.key)?.data?.sheetInfo.characterName || '', key: r.key }))
        .filter(cn => cn.name)
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
    const bottomBox = reactive(getBlock(layoutData as SlotUnionInfo, 'bottom-box') || { minHeight: null })
    const bottomHeight = computed(() => `${(bottomBox?.minHeight?.px || 0) + 10}px`)

    const chatInput = ref('')

    const getDiceRollResultText = (bcdiceResultText: string | null | undefined): string => {
      let raw = bcdiceResultText || ''
      const index1 = raw.indexOf('→')
      if (index1 > -1) {
        const index2 = raw.indexOf('→', index1 + 1)
        if (index2 > -1) {
          raw = raw.substring(index1 + 1, index2).trim()
        }
      }
      return raw
    }

    const diceRollAndChat = async (cmd: string): Promise<{ insertChat: () => Promise<void>; bcdiceResult: BcdiceDiceRollResult | null }> => {
      let bcdiceResult: BcdiceDiceRollResult | null = null
      try {
        bcdiceResult = await chatListStore.diceRoll(cmd)
      } catch (_) { /**/ }
      let diceResult = ''
      if (bcdiceResult?.critical) diceResult = 'スペシャル'
      else if (bcdiceResult?.success) diceResult = '成功'
      if (bcdiceResult?.fumble) diceResult = 'ファンブル'
      else if (bcdiceResult?.failure) diceResult = '失敗'
      console.log(JSON.stringify(bcdiceResult, null, '  '))
      return {
        bcdiceResult,
        insertChat: async () => {
          const diceRaw = getDiceRollResultText(bcdiceResult?.text)
          await chatListStore.insertData({
            raw: cmd,
            diceRaw,
            tag: [''],
            tab: '',
            type: 'chat',
            diceType: bcdiceResult ? diceResult ? 'dice-roll-scf' : 'dice-roll' : null,
            fromType: from.value === selfName.value ? 'user' : 'character',
            from: from.value || '',
            diceRollResult: bcdiceResult ? diceResult || null : null,
            rands: bcdiceResult?.rands || null
          })
        }
      }
    }

    const from = ref<string | null>(selfName.value)

    const chatHistoryList = ref<{
      key: string;
      viewTextInfo: {
        text: string;
        from: string;
        diceText: string | null;
        diceRollResult: string | null;
        color: string;
        standImage: string | null;
        isMe: boolean;
      };
      pips: [string, number][];
    }[]>([])

    const diceRollEnd = ref<(() => void) | null>(null)
    // const diceRollTimeoutId = ref<number | null>(null)
    const onEndDiceRoll = () => {
      if (diceRollEnd.value) {
        diceRollEnd.value()
      }
    }

    const getChatStyle = (chat: ChatStore | null): Record<string, string> => {
      if (!chat) return {}
      const result: Record<string, string> = {}
      if (chat.fromType === 'character') {
        const c = characterStore.characterList.find(c => c.key === chat.from)
        result['--color'] = c?.data?.color || '#000'
      } else {
        result['--color'] = userSettingStore.userSetting?.fontColor || '#000'
      }
      return result
    }

    const getFromLabel = (chat: ChatStore | null): string => {
      if (!chat) return ''
      let fromLabel = ''
      if (chat.type === 'system') {
        fromLabel = 'System'
      } else {
        if (chat.fromType === 'character') {
          const c = characterStore.characterList.find(c => c.key === chat.from)
          fromLabel = c?.data?.sheetInfo.characterName || ''
        } else {
          const u = userStore.userList.find(u => u.name === chat.from)
          fromLabel = `${u?.name || '???'}(${u?.type.toUpperCase() || '??'})`
        }
      }
      if (fromLabel) fromLabel += '：'
      return fromLabel
    }

    const randsToPips = (chat: ChatStore, key: string): Promise<void> => {
      // onEndDiceRoll()
      return new Promise<void>(resolve => {
        const style = getChatStyle(chat)
        const character = chat.fromType === 'character' ? characterStore.characterList.find(c => c.key === chat.from)?.data || null : null
        const standImageKey = character?.standImageList.length && character?.standImageList.length > character?.currentStandImage ? character?.standImageList[character?.currentStandImage || 0] : null
        const standImageUrl = mediaListStore.list.find(n => n.key === standImageKey)?.data?.url || null
        console.log('standImage')
        console.log(chat.fromType)
        console.log(chat.from)
        console.log(character)
        console.log(standImageKey)
        console.log(standImageUrl)

        chatHistoryList.value.unshift({
          key,
          viewTextInfo: {
            from: getFromLabel(chat),
            text: chat.raw,
            diceText: chat.diceRaw,
            diceRollResult: chat.diceRollResult,
            color: style['--color'] || '#000',
            standImage: standImageUrl ? `url('${standImageUrl}')` : null,
            // standImage: standImageUrl || null,
            isMe: chat.from === selfName.value || userStore.selfUser?.refList.some(r => r.key === chat.from) || false
          },
          pips: chat.rands
            ?.map((r): [string, number] | null => {
              const type = 'black-6'
              if (r.sides !== 6) return null
              return [type, r.value]
            })
            .filter((r): r is [string, number] => r !== null) || []
        })
        diceRollEnd.value = () => {
          // if (diceRollTimeoutId.value) {
          //   window.clearTimeout(diceRollTimeoutId.value)
          //   diceRollTimeoutId.value = null
          // }
          diceRollEnd.value = null
          chatHistoryList.value = []
          resolve()
        }
        // diceRollTimeoutId.value = window.setTimeout(() => {
        //   if (diceRollEnd.value) {
        //     diceRollEnd.value()
        //   }
        // }, 80000)
      })
    }

    const onEnter = async () => {
      const { insertChat } = await diceRollAndChat(chatInput.value)
      // await chatListStore.insertData({
      //   raw: chatInput.value,
      //   tag: [''],
      //   tab: '',
      //   type: 'chat',
      //   fromType: from.value === selfName.value ? 'user' : 'character',
      //   from: from.value || '',
      //   diceRollResult: null,
      //   rands: null
      // })
      chatInput.value = ''
      await insertChat()
    }

    const onChangeMode = (m: 'normal' | 'SG' | 'D6' | 'D6>=?') => {
      specialInputStore.from = {
        type: from.value === selfName.value ? 'user' : 'character',
        key: from.value
      }
      specialInputStore.setCmdType(m)
      // onEndDiceRoll()
    }

    const onDiceCommand = async () => {
      const command = specialInputStore.command
      specialInputStore.setCmdType('normal')
      const { insertChat } = await diceRollAndChat(command)
      // await chatListStore.insertData({
      //   raw: command,
      //   tag: [''],
      //   tab: '',
      //   type: 'chat',
      //   fromType: from.key === selfName.value ? 'user' : 'character',
      //   from: from.key || '',
      //   diceRollResult: null,
      //   rands: null
      // })
      await insertChat()
    }

    const chatList = computed(() => chatListStore.list)
    watch(() => [...chatList.value], (newList, oldList) => {
      if (newList.length > oldList.length) {
        setTimeout(() => {
          chatBottomElm.value?.scrollIntoView(false)
        })
        const chat = newList[newList.length - 1]
        if (chat && chat.data) {
          randsToPips(chat.data, chat.key).then()
        }
      }
    })

    return {
      bottomHeight,
      chatHistoryList,
      onEndDiceRoll,
      from,
      targetCharacterList,
      selfName,
      chatBottomElm,
      onChangeMode,
      onDiceCommand,
      chatInput,
      globalStyle,
      characterList,
      layoutData: reactiveLayout,
      chatList,
      onEnter,
      getFromLabel,
      getChatStyle
    }
  },
  name: 'the-play'
})
</script>

<style scoped lang="scss">
@use "../common";
@use "../animations";

#the-play {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100vw;
  box-sizing: border-box;
}

.history-block {
  position: absolute;
  left: 10vw;
  right: 10vw;
  pointer-events: none;
  top: 0;
  bottom: var(--bottom);
  overflow: visible;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: 1fr auto;
  z-index: 50;

  &.image-left {
    grid-template-columns: 40vmin 1fr 0;

    .img {
      grid-column: 1 / 2;
    }
  }

  &.image-right {
    grid-template-columns: 0 1fr 40vmin;

    .img {
      grid-column: 3 / 4;
    }
  }

  &.image-none {
    grid-template-columns: 20vmin 1fr 20vmin;
  }

  .history {
    @include common.flex-box(column-reverse, stretch, flex-start);
    grid-row: 1 / 2;
    grid-column: 2 / 3;
  }

  .img {
    position: relative;
    grid-row: 1 / 2;
    background-image: var(--image);
    background-position: center bottom;
    background-repeat: no-repeat;
    background-size: contain;
  }
}

.view-text {
  pointer-events: all;
  padding: 0.3rem;
  text-align: left;
  font-size: 90%;
  font-weight: bold;
  white-space: pre-wrap;
  color: var(--color);
  background-color: rgba(255, 255, 255, 0.95);
  border-width: 1px;
  border-color: black;
  border-style: solid;
  @include common.inline-flex-box(column, flex-start, flex-start);
  transition: all ease 0.5s;
  cursor: pointer;

  span:last-child {
    flex: 1;
  }

  &.first {
    grid-row: 2 / 3;
    grid-column: 1 / 4;
  }

  .h-box {
    flex: 1;
    overflow: hidden;
    @include common.inline-flex-box(row, flex-start, flex-start);
  }

  &.old {
    left: calc(10vw + 40vmin);
    font-size: 70%;
    z-index: calc(50 - var(--offset))
  }
}

.dice-wrap {
  pointer-events: all;
  cursor: pointer;
  position: absolute;
  right: 0;
  bottom: 0;
  width: common.$dice-size;
  height: common.$dice-size;
  overflow: visible;
  z-index: 50;
  transform: translateX(calc((var(--dice-count) - var(--offset) - 1) * -#{common.$dice-size}));

  @mixin dice-image($type, $pips) {
    &.#{$type}-#{$pips} .dice {
      background-image: url("/static/img/dice/#{$type}/dice-#{$type}-#{$pips}.png");
    }
  }

  $dice-animation-duration: 0.8s;
  $dice-animation-count: 2;
  @mixin dice-animation($type) {
    &[class*="#{$type}"] .dice {
      animation:
        random-dice-#{$type} $dice-animation-duration linear 0s $dice-animation-count none,
        bounce ($dice-animation-duration * $dice-animation-count) linear 0s 1 none
      ;
    }
  }

  @for $i from 1 through 6 {
    @include dice-image("black-6", $i);
    @include dice-image("white-6", $i);
  }

  .dice {
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    filter: drop-shadow(2px 8px 5px var(--color));
    @include common.position-full-size();
  }

  &.roll {
    animation: dice-roll-in ($dice-animation-duration * $dice-animation-count) linear 0s 1 none;

    @include dice-animation("black-6");
    @include dice-animation("white-6");
  }
}

.chat {
  display: inline;
  color: var(--color);
  text-align: left;
  word-wrap: break-word;
  overflow-wrap: anywhere;
  word-break: break-all;

  &.dice-result {
    margin-top: -0.5rem;
  }

  .from-label {
    font-weight: bold;
    white-space: nowrap;
  }
}

.dice-roll-scf {
  border: 1px solid gray;
  border-radius: 3px;
  padding: 0 0.2rem;
  white-space: nowrap;
  margin-right: 0.3rem;
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
