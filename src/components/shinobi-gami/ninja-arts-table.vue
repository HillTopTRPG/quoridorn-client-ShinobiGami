<template>
  <table class="ninja-arts" :class="mode">
    <thead>
      <tr>
        <th class="secret" v-if="mode !== 'normal'" :class="{ focused: currentColumn === 'secret' }">秘</th>
        <th class="name" :class="{ focused: currentColumn === 'name' }">忍法名</th>
        <th class="type" v-if="mode !== 'normal'" :class="{ focused: currentColumn === 'type' }">タイプ</th>
        <th class="target-skill" :class="{ focused: currentColumn === 'target-skill' }">指定特技</th>
        <th class="range" :class="{ focused: currentColumn === 'range' }">間合</th>
        <th class="cost" :class="{ focused: currentColumn === 'cost' }">コスト</th>
        <th class="effect" v-if="mode !== 'normal'" :class="{ focused: currentColumn === 'effect' }">効果</th>
        <th class="page" v-if="mode !== 'normal'" :class="{ focused: currentColumn === 'page' }">参照p</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(n, ind) in character.sheetInfo.ninjaArtsList" :key="ind">
        <tr @click="onSelectArts(ind)">
          <td class="secret" v-if="mode !== 'normal'" :class="{ focused: currentColumn === 'secret' }">
            <template v-if="mode !== 'edit'">{{ n.secret }}</template>
            <input type="checkbox" @focus="onFocusColumn($event)" :id="`secret-${ind}-${elmId}`" v-else v-model="n.secret">
          </td>
          <td class="name" :class="{ focused: currentColumn === 'name' }">
            <ruby v-if="mode !== 'edit'" v-html="getNameHtml(n.name)"></ruby>
            <input type="text" @focus="onFocusColumn($event)" :id="`name-${ind}-${elmId}`" v-else v-model="n.name">
          </td>
          <td class="type" v-if="mode !== 'normal'" :class="{ focused: currentColumn === 'type' }">
            <template v-if="mode !== 'edit'">{{ n.type }}</template>
            <select @focus="onFocusColumn($event)" :id="`type-${ind}-${elmId}`" v-else v-model="n.type">
              <option value="攻撃">攻撃</option>
              <option value="サポート">ｻﾎﾟｰﾄ</option>
              <option value="装備">装備</option>
            </select>
          </td>
          <td class="target-skill" :class="{ focused: currentColumn === 'target-skill' }">
            <template v-if="mode !== 'edit'">{{ n.targetSkill }}</template>
            <input type="text" @focus="onFocusColumn($event)" :id="`targetSkill-${ind}-${elmId}`" v-else :list="`target-skill-list-${elmId}`" v-model="n.targetSkill">
            <datalist :id="`target-skill-list-${elmId}`">
              <template v-for="col of 6" :key="col">
                <option v-for="row of 11" :key="row" :label="`${skillColumnList[col - 1]} - ${row + 1}`" :value="SkillTable[row - 1][col - 1]">{{ SkillTable[row - 1][col - 1] }}</option>
              </template>
            </datalist>
          </td>
          <td class="range" :class="{ focused: currentColumn === 'range' }">
            <template v-if="mode !== 'edit'">{{ n.range }}</template>
            <input type="text" @focus="onFocusColumn($event)" :id="`range-${ind}-${elmId}`" v-else v-model="n.range">
          </td>
          <td class="cost" :class="{ focused: currentColumn === 'cost' }">
            <template v-if="mode !== 'edit'">{{ n.cost }}</template>
            <input type="text" @focus="onFocusColumn($event)" :id="`cost-${ind}-${elmId}`" v-else v-model="n.cost">
          </td>
          <td class="effect" v-if="mode !== 'normal'" :class="{ focused: currentColumn === 'effect' }">
            <template v-if="mode !== 'edit'">{{ n.effect }}</template>
            <textarea @focus="onFocusColumn($event)" :id="`effect-${ind}-${elmId}`" v-else v-model="n.effect"></textarea>
          </td>
          <td class="page" v-if="mode !== 'normal'" :class="{ focused: currentColumn === 'page' }">
            <template v-if="mode !== 'edit'">{{ n.page }}</template>
            <input type="text" @focus="onFocusColumn($event)" :id="`page-${ind}-${elmId}`" v-else v-model="n.page">
          </td>
        </tr>
        <tr @click="onSelectArts(ind)">
          <td class="effect-normal" colspan="4" v-show="mode === 'normal' && ind === selectedArts">{{ n.effect }}</td>
        </tr>
      </template>
    </tbody>
    <tfoot v-if="mode !== 'view'">
      <tr>
        <td colspan="4">
          <button @click="reloadNinjaArts()" v-if="mode === 'normal'">忍法再読み込み</button>
          <button @click="addNinjaArts()" v-if="mode === 'edit'">追加</button>
        </td>
      </tr>
    </tfoot>
  </table>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import { Character } from '@/feature/character/data'
import SpecialInputStore from '@/feature/special-input/data'
import { v4 as uuidV4 } from 'uuid'
import { ShinobigamiHelper, SkillTable } from '@/core/utility/shinobigami'

export default defineComponent({
  name: 'ninja-arts-table',
  props: {
    mode: {
      type: String as PropType<'normal' | 'view' | 'edit'>,
      require: true
    },
    character: {
      type: Object as PropType<Character>,
      required: true
    },
    characterKey: {
      type: String,
      default: null
    },
    selectIndex: {
      type: Number,
      default: null
    }
  },
  setup(props, { emit }) {
    const elmId = uuidV4()
    const specialInputStore = SpecialInputStore.injector()
    const currentColumn = ref('')
    const onFocusColumn = (event: { target: HTMLInputElement | HTMLSelectElement }): void => {
      const type = (event.target?.parentNode as HTMLElement).className.split(' ')[0] || ''
      console.log('onFocus', type)
      if (!type) return
      currentColumn.value = type
    }
    const selectedArts = computed(() => props.selectIndex)
    const onSelectArts = (index: number) => {
      emit('update:selectIndex', selectedArts.value === index ? null : index)
      const ninjaArts = props.character.sheetInfo.ninjaArtsList[index]
      specialInputStore.from.key = props.characterKey
      specialInputStore.setNinjaArts(ninjaArts.name)
    }
    const reloadNinjaArts = async () => {
      const helper = new ShinobigamiHelper(props.character.sheetInfo.url, props.character.sheetViewPass)
      if (!helper.isThis()) {
        console.log('is not this')
        return
      }
      const { data: rd, jsons } = await helper.getData()
      console.log(jsons)
      console.log(rd)
      if (!rd) return
      const ninjaArtsList = props.character.sheetInfo.ninjaArtsList
      ninjaArtsList.splice(0, props.character.sheetInfo.ninjaArtsList.length, ...rd.ninjaArtsList)
    }

    const addNinjaArts = () => {
      const ninjaArtsList = props.character.sheetInfo.ninjaArtsList
      ninjaArtsList.push({
        secret: false,
        name: '',
        type: '攻撃',
        targetSkill: '',
        range: '1',
        cost: '1',
        effect: '',
        page: ''
      })
    }
    return {
      elmId,
      currentColumn,
      onFocusColumn,
      SkillTable,
      skillColumnList: ['器術', '体術', '忍術', '謀術', '戦術', '妖術'],
      selectedArts,
      onSelectArts,
      getNameHtml: (name: string) => name
        .replace('<', '&lt;')
        .replace('>', '&gt;')
        .replaceAll(/(.+)[(（](.+)[)）]/g, (_, p1, p2) => {
          return `${p1}<rp>（</rp><rt>${p2}</rt><rp>）</rp>`
        }),
      reloadNinjaArts,
      addNinjaArts
    }
  }
})
</script>

<style scoped lang="scss">
@use "../common";

table.ninja-arts {
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
  font-size: var(--ninja-arts-table-font-size);

  label {
    cursor: pointer;
  }

  caption {
    text-align: left;
  }

  tfoot td {
    text-align: left;
    border: none;
  }

  input:not([type='checkbox']),
  select {
    padding: 0;
    margin: 0;
    cursor: inherit;
    width: 100%;
    box-sizing: border-box;
    font-size: inherit;
    height: 2em;
  }

  thead tr {
    background-color: #252525;
    color: white;
  }

  td {
    height: 1.9em;
  }

  tbody tr {
    cursor: pointer;
  }

  td, th {
    position: relative;
    text-align: center;
    border-style: solid;
    border-width: 1px;
    border-color: black;
    padding: 0;
    margin: 0;

    > * {
      vertical-align: middle;
    }
  }

  @mixin set-width($width) {
    width: $width;
    min-width: $width;
    max-width: $width;
  }

  @mixin set-label-css($direction, $height, $horizontal: center) {
    > label {
      @include common.flex-box($direction, $horizontal, center);
      height: $height;
    }
  }

  .secret {
    width: 2em;
  }

  td.name,
  td.effect {
    text-align: left;
  }

  &.edit .name {
    width: 10em;
  }
  .name {
    white-space: nowrap;
    width: 3em;
  }

  .type {
    white-space: nowrap;
    width: 5em;
  }

  &.edit .target-skill {
    width: 8em;
  }
  .target-skill {
    white-space: nowrap;
    width: 4em;
  }

  .range {
    white-space: nowrap;
    width: 3em;
  }

  .cost {
    white-space: nowrap;
    width: 3em;
  }

  .effect {
    white-space: break-spaces;
    min-width: 15em;

    textarea {
      width: 100%;
      resize: vertical;
      box-sizing: border-box;
      min-height: 2.5em;
    }
  }

  .effect-normal {
    text-align: left;
    white-space: break-spaces;
    max-width: 1em;
    background-color: rgba(100, 100, 100, 0.1);
  }

  .page {
    white-space: nowrap;
    width: 3em;
  }
}
</style>
