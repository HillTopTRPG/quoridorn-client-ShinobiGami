<template>
  <label class="url"><span>キャラクターシート倉庫URL</span><input type="text" v-model="character.sheetInfo.url" placeholder="https://character-sheets.appspot.com/shinobigami/edit.html?key="></label>
  <label class="sheet-view-pass"><span>秘匿情報閲覧パス</span><input type="text" v-model="character.sheetViewPass" placeholder=""><button @click="onReadSheet()">読込</button></label>
  <character-basic-info :character="character" mode="edit" />
  <skill-table :character="character" mode="edit" />
  <ninja-arts-table :character="character" mode="edit" />
  <background-table :character="character" />
  <special-arts-table :character="character" />
  <ninja-tool-table :character="character" />
  <label class="color">
    <span>チャット文字色</span>
    <font-color-select v-model="character.color" />
  </label>
  <div class="chit-image-box">
    <template v-for="(n, ind) in chitImageList" :key="n.key">
      <label>
        コマ画像{{ ind + 1 }}
        <image-input :image-info="n" type="chit" @update="value => onUpdateImage('chit', n.key, value)" />
      </label>
    </template>
  </div>
  <div class="stand-image-box">
    <template v-for="(n, ind) in standImageList" :key="n.key">
      <label>
        立ち絵画像{{ ind + 1 }}
        <image-input :image-info="n" type="stand" @update="value => onUpdateImage('stand', n.key, value)" />
      </label>
    </template>
  </div>
  <button @click="insertCharacter()">Add</button>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import Store, { Character, ImageInfo } from './data'
import UserSettingStore from '@/feature/user-setting/data'
import { ShinobigamiHelper } from '@/core/utility/shinobigami'
import NinjaArtsTable from '@/components/shinobi-gami/ninja-arts-table.vue'
import SkillTable from '@/components/shinobi-gami/skill-table.vue'
import CharacterBasicInfo from '@/components/shinobi-gami/character-basic-info.vue'
import { convertNumberNull } from '@/core/utility/PrimaryDataUtility'
import FontColorSelect from '@/components/font-color-select.vue'
import BackgroundTable from '@/components/shinobi-gami/background-table.vue'
import { removeFilter } from '@/core/utility/typescript'
import SpecialArtsTable from '@/components/shinobi-gami/special-arts-table.vue'
import NinjaToolTable from '@/components/shinobi-gami/ninja-tool-table.vue'
import ImageInput from '@/feature/character/image-input.vue'
import { v4 as uuidV4 } from 'uuid'
import { errorDialog } from '@/core/utility/dialog'

export default defineComponent({
  name: 'character-pane',
  emits: ['close'],
  components: { ImageInput, NinjaToolTable, SpecialArtsTable, BackgroundTable, FontColorSelect, CharacterBasicInfo, NinjaArtsTable, SkillTable },
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
      sheetViewPass: '',
      sheetInfo: {
        url: '',
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
        ninjaArtsList: [],
        personalityList: [],
        scenario: {
          handout: '',
          mission: '',
          name: '',
          pcno: ''
        },
        backgroundList: [],
        skill: {
          learnedList: [],
          damagedList: [],
          damagedColList: [],
          spaceList: [],
          outRow: false,
          isUseColDamage: false,
          isUseSingleDamage: false,
          isOutputSingleDamage: false
        },
        specialArtsList: [],
        ninjaToolList: []
      },
      chitImageList: [],
      standImageList: [],
      currentChitImage: -1,
      currentStandImage: -1
    })

    const onReadSheet = async () => {
      console.log(character.sheetInfo.url)
      if (!character.sheetInfo.url) return
      const helper = new ShinobigamiHelper(character.sheetInfo.url, character.sheetViewPass)
      if (!helper.isThis()) {
        console.log('is not this')
        return
      }
      const { data: rd, jsons } = await helper.getData()
      console.log(jsons)
      console.log(rd)
      if (!rd) {
        await errorDialog({
          title: 'Loading Error',
          text: 'URLまたは秘匿情報閲覧パスが誤っています。'
        })
        return
      }

      const pcNoRaw = convertNumberNull(rd.scenario.pcno.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)))
      if (pcNoRaw !== null) character.pcNo = pcNoRaw
      character.sheetInfo = rd
    }

    const chitImageList = ref<ImageInfo[]>([{ key: uuidV4(), name: '', base64: '' }])
    const standImageList = ref<ImageInfo[]>([{ key: uuidV4(), name: '', base64: '' }])

    const onUpdateImage = (type: 'chit' | 'stand', key: string, value: ImageInfo) => {
      const list: ImageInfo[] = type === 'chit' ? chitImageList.value : standImageList.value
      const index = list.findIndex(ci => ci.key === key)
      if (index > -1) {
        list[index].name = value.name
        list[index].base64 = value.base64
      }
      console.log(value.name)
      if (list[list.length - 1].name) {
        list.push({ key: uuidV4(), name: '', base64: '' })
      }
      if (!value.name && index > -1) {
        list.splice(index, 1)
      }
    }

    const insertCharacter = () => {
      // eslint-disable-next-line no-irregular-whitespace
      const deleteSpace = (name: string) => name.replaceAll(/ 　/g, '')
      removeFilter(character.sheetInfo.ninjaArtsList, n => !deleteSpace(n.name).length)
      removeFilter(character.sheetInfo.backgroundList, n => !deleteSpace(n.name).length)
      character.chitImageList.splice(0, character.chitImageList.length, ...chitImageList.value.filter(ci => !!ci.name).map(i => i.key))
      character.standImageList.splice(0, character.standImageList.length, ...standImageList.value.filter(ci => !!ci.name).map(i => i.key))
      if (character.currentChitImage < 0 && character.chitImageList.length) character.currentChitImage = 0
      if (character.currentStandImage < 0 && character.standImageList.length) character.currentStandImage = 0
      const infoList = chitImageList.value.concat(standImageList.value).filter(ci => !!ci.name).map((ci): ImageInfo => ({
        base64: ci.base64,
        key: ci.key,
        name: ci.name
      }))
      state.insertData([character], infoList)
      emit('close')
    }

    return {
      onReadSheet,
      userSetting,
      chitImageList,
      standImageList,
      onUpdateImage,
      character,
      SkillTable,
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

.chit-image-box,
.stand-image-box {
  width: 100%;
  @include common.flex-box(row, flex-start, stretch, wrap);

  label {
    @include common.flex-box(column, flex-start, stretch);
  }
}
</style>
