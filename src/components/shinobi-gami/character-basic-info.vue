<template>
  <table class="character-basic-info">
    <tr>
      <th><label :for="`cbi-player-name-${elmId}`">プレイヤー</label></th>
      <td colspan="3">
        <span>
          <template v-if="mode === 'view'">{{ character.sheetInfo.playerName }}</template>
          <input v-else :id="`cbi-player-name-${elmId}`" type="text" v-model="characterRef.sheetInfo.playerName">
        </span>
      </td>
    </tr>
    <tr>
      <th><label :for="`cbi-character-name-${elmId}`">名前</label></th>
      <td colspan="3">
        <span>
          <template v-if="mode === 'view'">{{ characterRef.sheetInfo.characterName }}</template>
          <input v-else :id="`cbi-character-name-${elmId}`" type="text" v-model="characterRef.sheetInfo.characterName">
        </span>
      </td>
    </tr>
    <tr>
      <th><label :for="`cbi-character-name-kana-${elmId}`">カナ</label></th>
      <td colspan="3">
        <span>
          <template v-if="mode === 'view'">{{ characterRef.sheetInfo.characterNameKana }}</template>
          <input v-else :id="`cbi-character-name-kana-${elmId}`" type="text" v-model="characterRef.sheetInfo.characterNameKana">
        </span>
      </td>
    </tr>
    <tr>
      <th><label :for="`cbi-regulation-${elmId}`">ﾚｷﾞｭﾚｰｼｮﾝ</label></th>
      <td colspan="3">
        <span>
          <template v-if="mode === 'view'">{{ characterRef.sheetInfo.regulation }}</template>
          <input v-else :id="`cbi-regulation-${elmId}`" type="text" v-model="characterRef.sheetInfo.regulation">
        </span>
      </td>
    </tr>
    <tr>
      <th><label :for="`cbi-upper-style-${elmId}`">上位流派</label></th>
      <td class="c1">
        <span>
          <template v-if="mode === 'view'">{{ characterRef.sheetInfo.upperStyle }}</template>
          <select v-else :id="`cbi-upper-style-${elmId}`" v-model="characterRef.sheetInfo.upperStyle">
            <option value=""></option>
            <option value="斜歯忍軍">斜歯忍軍</option>
            <option value="鞍馬神流">鞍馬神流</option>
            <option value="ハグレモノ">ハグレモノ</option>
            <option value="比良坂機関">比良坂機関</option>
            <option value="私立御斎学園">私立御斎学園</option>
            <option value="隠忍の血統">隠忍の血統</option>
          </select>
        </span>
      </td>
      <th><label :for="`cbi-sub-style-${elmId}`">流派</label></th>
      <td class="c2">
        <span>
          <template v-if="mode === 'view'">{{ characterRef.sheetInfo.subStyle }}</template>
          <input v-else :id="`cbi-sub-style-${elmId}`" type="text" placeholder="（上位流派）" v-model="characterRef.sheetInfo.subStyle">
        </span>
      </td>
    </tr>
    <tr>
      <th><label :for="`cbi-style-rule-${elmId}`">流儀</label></th>
      <td colspan="3">
        <span>
          <template v-if="mode === 'view'">{{ characterRef.sheetInfo.stylerule }}</template>
          <input v-else :id="`cbi-style-rule-${elmId}`" type="text" v-model="characterRef.sheetInfo.stylerule">
        </span>
      </td>
    </tr>
    <tr>
      <th><label :for="`cbi-foe-${elmId}`">仇敵</label></th>
      <td colspan="3">
        <span>
          <template v-if="mode === 'view'">{{ characterRef.sheetInfo.foe }}</template>
          <input v-else :id="`cbi-foe-${elmId}`" type="text" v-model="characterRef.sheetInfo.foe">
        </span>
      </td>
    </tr>
    <tr>
      <th><label :for="`cbi-level-${elmId}`">階級</label></th>
      <td class="c1">
        <span>
          <template v-if="mode === 'view'">{{ characterRef.sheetInfo.level }}</template>
          <input v-else :id="`cbi-level-${elmId}`" type="text" v-model="characterRef.sheetInfo.level">
        </span>
      </td>
      <th><label :for="`cbi-exp-${elmId}`">功績</label></th>
      <td class="c2">
        <span>
          <template v-if="mode === 'view'">{{ characterRef.sheetInfo.exp }}</template>
          <input v-else :id="`cbi-exp-${elmId}`" type="text" v-model="characterRef.sheetInfo.exp">
        </span>
      </td>
    </tr>
    <tr>
      <th><label :for="`cbi-age-${elmId}`">年齢</label></th>
      <td class="c1">
        <span>
          <template v-if="mode === 'view'">{{ characterRef.sheetInfo.age }}</template>
          <input v-else :id="`cbi-age-${elmId}`" type="text" v-model="characterRef.sheetInfo.age">
        </span>
      </td>
      <th><label :for="`cbi-sex-${elmId}`">性別</label></th>
      <td class="c2">
        <span>
          <template v-if="mode === 'view'">{{ characterRef.sheetInfo.sex }}</template>
          <input v-else :id="`cbi-sex-${elmId}`" type="text" v-model="characterRef.sheetInfo.sex">
        </span>
      </td>
    </tr>
    <tr>
      <th><label :for="`cbi-cover-${elmId}`">表の顔</label></th>
      <td class="c1">
        <span>
          <template v-if="mode === 'view'">{{ characterRef.sheetInfo.cover }}</template>
          <input v-else :id="`cbi-cover-${elmId}`" type="text" v-model="characterRef.sheetInfo.cover">
        </span>
      </td>
      <th><label :for="`cbi-belief-${elmId}`">信念</label></th>
      <td class="c2">
        <span>
          <template v-if="mode === 'view'">{{ characterRef.sheetInfo.belief }}</template>
          <input v-else :id="`cbi-belief-${elmId}`" type="text" v-model="characterRef.sheetInfo.belief">
        </span>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import { UnwrapNestedRefs } from '@vue/reactivity'
import { Character } from '@/feature/character/data'
import { v4 as uuidV4 } from 'uuid'

export default defineComponent({
  name: 'character-basic-info',
  props: {
    character: {
      type: Object as PropType<UnwrapNestedRefs<Character>>,
      required: true
    },
    mode: {
      type: String as PropType<'edit' | 'view'>,
      required: true
    }
  },
  setup(props) {
    const elmId = uuidV4()
    return {
      elmId,
      characterRef: reactive(props.character)
    }
  }
})
</script>

<style scoped lang="scss">
@use "../common";

table.character-basic-info {
  font-size: 11px;
  border-collapse: collapse;
  border-spacing: 0;
  border: 1px solid rgb(0, 0, 0);
  table-layout: fixed;

  label {
    cursor: pointer;
  }

  caption {
    text-align: left;
  }

  input {
    padding: 0;
    margin: 0;
    cursor: inherit;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  td, th {
    position: relative;
    border-style: solid;
    border-width: 1px;
    border-color: black;
    padding: 0;
    margin: 0;

    > * {
      vertical-align: middle;
    }
  }

  th {
    background-color: #252525;
    color: white;
    text-align: center;
    padding: 0 0.2rem;
    white-space: nowrap;
  }

  td {
    text-align: left;
    padding: 0.1rem 0.2rem;

    > * {
      width: 100%;
    }

    &.c1 {
      width: 10em;
    }

    &.c2 {
      width: 10em;
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
}
</style>
