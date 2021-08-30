<template>
  <label class="url"><span>キャラクターシート倉庫URL</span><input type="text" v-model="data.sheetInfo.url"></label>
  <character-basic-info :character="data" mode="edit" />
  <skill-table :character="data" mode="edit" />
  <ninja-arts-table :character="data" mode="edit" />
  <table class="background">
    <tr>
      <th class="name">名称</th>
      <th class="type">種別</th>
      <th class="point">功績点</th>
      <th class="effect">効果</th>
    </tr>
    <tr v-for="(bg, ind) in data.sheetInfo.backgroundList" :key="ind">
      <td class="name">{{bg.name}}</td>
      <td class="type">{{bg.type}}</td>
      <td class="point">{{bg.point}}</td>
      <td class="effect">{{bg.effect}}</td>
    </tr>
  </table>
  <label class="color">
    <span>チャット文字色</span>
    <font-color-select v-model="data.color" />
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

export default defineComponent({
  name: 'character-pane',
  components: { FontColorSelect, CharacterBasicInfo, NinjaArtsTable, SkillTable },
  setup() {
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

    const data = reactive<Character>({
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
        }
      }
    })

    watch(() => data.sheetInfo.url, async () => {
      console.log(data.sheetInfo.url)
      if (!data.sheetInfo.url) return
      const helper = new ShinobigamiHelper(data.sheetInfo.url)
      if (!await helper.isThis()) {
        console.log('is not this')
        return
      }
      const { data: rd, json } = await helper.getData()
      console.log(json)
      console.log(rd)
      if (!rd) return

      const pcNoRaw = convertNumberNull(rd.scenario.pcno.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)))
      if (pcNoRaw !== null) data.pcNo = pcNoRaw
      data.sheetInfo = rd
    })

    const insertCharacter = () => {
      console.log('insert')
      console.log(data)
      state.insertData(data)
    }

    return {
      userSetting,
      data,
      tokugiTable: tokugiTable,
      skillColumnList: ['器術', '体術', '忍術', '謀術', '戦術', '妖術'],
      insertCharacter,
      selectColor(color: string) {
        data.color = color
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

table {
  align-self: flex-start;

  &.background {
    font-size: 50%;
    border-collapse: collapse;
    border-spacing: 10px 100px;
    border: 1px solid red;

    th {
      border: 1px solid green;
    }
    td {
      border: 1px solid blue;
    }
    .name {
      white-space: nowrap;
    }
    .type {
      white-space: nowrap;
    }
    .point {
      white-space: nowrap;
    }
    .effect {
      text-align: left;
    }
  }
}
</style>
