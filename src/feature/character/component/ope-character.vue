<template>
  <label class="url"><span>キャラクターシート倉庫URL</span><input type="text" v-model="data.sheetInfo.url"></label>
  <character-basic-info :character="data" />
  <skill-table :character="data" view-type="edit" />
  <ninja-arts-table :character="data" view-type="edit" />
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
  <label><span>チャット色</span>
    <span class="color selected" :style="{ '--color': data.color }">{{ colorList.findIndex(c => c === data.color).toString().padStart(3, '0') }}</span>
    <span class="color-palette">
      <span
        class="color"
        :style="{ '--color': c }"
        v-for="(c, ind) in colorList"
        :key="c"
        @click="selectColor(c)"
      >{{ ind.toString().padStart(3, '0') }}</span>
    </span>
  </label>
  <button @click="insertCharacter()">Add</button>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watch } from 'vue'
import CharacterStore, { Character } from '@/feature/character/character'
import UserSettingStore from '@/feature/user-setting/user-setting'
import { ShinobigamiHelper, tokugiTable } from '@/core/utility/shinobigami'
import SkillTable from '@/components/shinobi-gami/skill-table.vue'
import NinjaArtsTable from '@/components/shinobi-gami/ninja-arts-table.vue'
import CharacterBasicInfo from '@/components/shinobi-gami/character-basic-info.vue'
import { convertNumberNull } from '@/core/utility/PrimaryDataUtility'

export default defineComponent({
  name: 'ope-character',
  components: { CharacterBasicInfo, NinjaArtsTable, SkillTable },
  setup() {
    const userSettingStore = UserSettingStore.injector()
    const userSetting = computed(() => userSettingStore.userSetting)

    const colorList: string[] = []
    colorList.push('#3E2723')
    colorList.push('#757575')
    colorList.push('#C12115')
    colorList.push('#E45714')
    colorList.push('#3B8A33')
    colorList.push('#0062AF')
    colorList.push('#08358A')
    colorList.push('#652173')
    colorList.push('#F44336')
    colorList.push('#FF5252')
    colorList.push('#D50000')
    colorList.push('#EC407A')
    colorList.push('#D81B60')
    colorList.push('#880E4F')
    colorList.push('#FF4081')
    colorList.push('#F50057')
    colorList.push('#C51162')
    colorList.push('#9C27B0')
    colorList.push('#6A1B9A')
    colorList.push('#D500F9')
    colorList.push('#AA00FF')
    colorList.push('#6200EA')
    colorList.push('#303F9F')
    colorList.push('#536DFE')
    colorList.push('#3D5AFE')
    colorList.push('#304FFE')
    colorList.push('#01579B')
    colorList.push('#0097A7')
    colorList.push('#00838F')
    colorList.push('#004D40')
    colorList.push('#1B5E20')
    colorList.push('#FF8F00')
    colorList.push('#E65100')
    colorList.push('#BF360C')
    colorList.push('#FF3D00')
    colorList.push('#DD2C00')
    colorList.push('#795548')
    colorList.push('#5D4037')
    colorList.push('#607D8B')
    colorList.push('#455A64')

    const characterStore = CharacterStore.injector()
    let pcNo = 0
    characterStore.characterList
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
      color: colorList[0],
      sheetInfo: {
        url: 'https://character-sheets.appspot.com/shinobigami/edit.html?key=',
        playerName: '',
        characterName: '',
        characterNameKana: '',
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
      characterStore.insertData(data)
    }

    return {
      userSetting,
      data,
      tokugiTable: tokugiTable,
      skillColumnList: ['器術', '体術', '忍術', '謀術', '戦術', '妖術'],
      colorList,
      insertCharacter,
      selectColor(color: string) {
        data.color = color
      }
    }
  }
})
</script>

<style scoped lang="scss">
@use "../../../components/common";

.url {
  text-align: left;
  @include common.flex-box(column, stretch, flex-start);
  width: 100%;
}

.color-palette {
  @include common.flex-box(row, flex-start, flex-start, wrap);
  gap: 0.2rem;
}

.color {
  width: 2em;
  height: 2em;
  white-space: pre;
  color: var(--color);
  position: relative;
  cursor: pointer;

  &:before {
    content: '';
    @include common.position-full-size();
    box-sizing: border-box;
    border-bottom-width: 3px;
    border-bottom-style: solid;
    border-bottom-color: var(--color);
  }
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
