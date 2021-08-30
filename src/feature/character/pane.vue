<template>
  <label class="url"><span>キャラクターシート倉庫URL</span><input type="text" v-model="character.sheetInfo.url"></label>
  <character-basic-info :character="character" mode="edit" />
  <skill-table :character="character" mode="edit" />
  <ninja-arts-table :character="character" mode="edit" />
  <background-table :character="character" />
  <special-arts-table :character="character" />
  <label class="color">
    <span>チャット文字色</span>
    <font-color-select v-model="character.color" />
  </label>
  <button @click="insertCharacter()">Add</button>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watch } from 'vue'
import Store, { Character } from './data'
import UserSettingStore from '@/feature/user-setting/data'
import { ShinobigamiHelper, tokugiTable } from '@/core/utility/shinobigami'
import SkillTable from '@/components/shinobi-gami/skill-table.vue'
import NinjaArtsTable from '@/components/shinobi-gami/ninja-arts-table.vue'
import CharacterBasicInfo from '@/components/shinobi-gami/character-basic-info.vue'
import { convertNumberNull } from '@/core/utility/PrimaryDataUtility'
import FontColorSelect from '@/components/font-color-select.vue'
import BackgroundTable from '@/components/shinobi-gami/background-table.vue'
import { removeFilter } from '@/core/utility/typescript'
import SpecialArtsTable from '@/components/shinobi-gami/special-arts-table.vue'

export default defineComponent({
  name: 'character-pane',
  emits: ['close'],
  components: { SpecialArtsTable, BackgroundTable, FontColorSelect, CharacterBasicInfo, NinjaArtsTable, SkillTable },
  setup(_, { emit }) {
    const userSettingStore = UserSettingStore.injector()
    const userSetting = computed(() => userSettingStore.userSetting)

    const state = Store.injector()
    let pcNo = 0
    state.characterList
      .filter(c => c.data?.type === 'character')
      .map(c => c.data?.pcNo || 0)
      .sort((n1, n2) => n1 < n2 ? -1 : n2 < n1 ? 1 : 0)
      .forEach(n => {
        if (n <= 0) return
        if (pcNo === n - 1) pcNo = n
      })
    pcNo++

    const character = reactive<Character>({
      pcNo,
      isActed: false,
      plot: -2,
      type: 'character',
      isFumble: false,
      color: '#3E2723',
      sheetInfo: {
        url: 'https://character-sheets.appspot.com/shinobigami/edit.html?key=',
        playerName: '',
        characterName: '',
        characterNameKana: '',
        regulation: '',
        foe: '',
        exp: '',
        memo: '',
        upperStyle: '',
        subStyle: '',
        level: '',
        age: '',
        sex: '',
        cover: '',
        belief: '',
        stylerule: '',
        ninpouList: [],
        personalityList: [],
        scenario: {
          handout: '',
          mission: '',
          name: '',
          pcno: ''
        },
        backgroundList: [],
        tokugi: {
          learnedList: [],
          damagedList: [],
          damagedColList: [],
          spaceList: [],
          outRow: false,
          isUseColDamage: false,
          isUseSingleDamage: false,
          isOutputSingleDamage: false
        },
        specialArtsList: []
      }
    })

    watch(() => character.sheetInfo.url, async () => {
      console.log(character.sheetInfo.url)
      if (!character.sheetInfo.url) return
      const helper = new ShinobigamiHelper(character.sheetInfo.url)
      if (!await helper.isThis()) {
        console.log('is not this')
        return
      }
      const { data: rd, json } = await helper.getData()
      console.log(json)
      console.log(rd)
      if (!rd) return

      const pcNoRaw = convertNumberNull(rd.scenario.pcno.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)))
      if (pcNoRaw !== null) character.pcNo = pcNoRaw
      character.sheetInfo = rd
    })

    const insertCharacter = () => {
      // eslint-disable-next-line no-irregular-whitespace
      const deleteSpace = (name: string) => name.replaceAll(/ 　/g, '')
      removeFilter(character.sheetInfo.ninpouList, n => !deleteSpace(n.name).length)
      removeFilter(character.sheetInfo.backgroundList, n => !deleteSpace(n.name).length)
      state.insertData(character)
      emit('close')
    }

    return {
      userSetting,
      character,
      tokugiTable: tokugiTable,
      skillColumnList: ['器術', '体術', '忍術', '謀術', '戦術', '妖術'],
      insertCharacter,
      selectColor(color: string) {
        character.color = color
      }
    }
  }
})
</script>

<style scoped lang="scss">
@use "../../components/common";

.url {
  text-align: left;
  @include common.flex-box(column, stretch, flex-start);
  width: 100%;
}

label.color {
  @include common.flex-box(column, flex-start, flex-start);
}
</style>
