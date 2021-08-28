<template>
  <table class="character-basic-info">
    <tr>
      <th><label for="cbi-player-name">プレイヤー</label></th>
      <td colspan="3">
        <span>
          <template>{{ character.sheetInfo.playerName }}</template>
          <input id="cbi-player-name" type="text" v-model="characterRef.sheetInfo.playerName">
        </span>
      </td>
    </tr>
    <tr>
      <th><label for="cbi-character-name">名前</label></th>
      <td colspan="3">
        <span>
          <template>{{ characterRef.sheetInfo.characterName }}</template>
          <input id="cbi-character-name" type="text" v-model="characterRef.sheetInfo.characterName">
        </span>
      </td>
    </tr>
    <tr>
      <th><label for="cbi-character-name-kana">カナ</label></th>
      <td colspan="3">
        <span>
          <template>{{ characterRef.sheetInfo.characterNameKana }}</template>
          <input id="cbi-character-name-kana" type="text" v-model="characterRef.sheetInfo.characterNameKana">
        </span>
      </td>
    </tr>
    <tr>
      <th><label for="cbi-regulation">ﾚｷﾞｭﾚｰｼｮﾝ</label></th>
      <td colspan="3">
        <span>
          <template>{{ characterRef.sheetInfo }}</template>
          <input id="cbi-regulation" type="text" v-model="characterRef.sheetInfo.characterNameKana">
        </span>
      </td>
    </tr>
    <tr>
      <th><label for="cbi-upper-style">上位流派</label></th>
      <td class="c1">
        <span>
          <template>{{ characterRef.sheetInfo.upperStyle }}</template>
          <select id="cbi-upper-style" v-model="characterRef.sheetInfo.upperStyle">
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
      <th><label for="cbi-sub-style">流派</label></th>
      <td class="c2">
        <span>
          <template>{{ characterRef.sheetInfo.subStyle }}</template>
          <input id="cbi-sub-style" type="text" placeholder="（上位流派）" v-model="characterRef.sheetInfo.subStyle">
        </span>
      </td>
    </tr>
    <tr>
      <th><label for="cbi-style-rule">流儀</label></th>
      <td colspan="3">
        <span>
          <template>{{ characterRef.sheetInfo.stylerule }}</template>
          <input id="cbi-style-rule" type="text" v-model="characterRef.sheetInfo.stylerule">
        </span>
      </td>
    </tr>
    <tr>
      <th><label for="cbi-foe">仇敵</label></th>
      <td colspan="3">
        <span>
          <template>{{ characterRef.sheetInfo.foe }}</template>
          <input id="cbi-foe" type="text" v-model="characterRef.sheetInfo.foe">
        </span>
      </td>
    </tr>
    <tr>
      <th><label for="cbi-level">階級</label></th>
      <td class="c1">
        <span>
          <template>{{ characterRef.sheetInfo.level }}</template>
          <input id="cbi-level" type="text" v-model="characterRef.sheetInfo.level">
        </span>
      </td>
      <th><label for="cbi-exp">功績</label></th>
      <td class="c2">
        <span>
          <template>{{ characterRef.sheetInfo.exp }}</template>
          <input id="cbi-exp" type="text" v-model="characterRef.sheetInfo.exp">
        </span>
      </td>
    </tr>
    <tr>
      <th><label for="cbi-age">年齢</label></th>
      <td class="c1">
        <span>
          <template>{{ characterRef.sheetInfo.age }}</template>
          <input id="cbi-age" type="text" v-model="characterRef.sheetInfo.age">
        </span>
      </td>
      <th><label for="cbi-sex">性別</label></th>
      <td class="c2">
        <span>
          <template>{{ characterRef.sheetInfo.sex }}</template>
          <input id="cbi-sex" type="text" v-model="characterRef.sheetInfo.sex">
        </span>
      </td>
    </tr>
    <tr>
      <th><label for="cbi-cover">表の顔</label></th>
      <td class="c1">
        <span>
          <template>{{ characterRef.sheetInfo.cover }}</template>
          <input id="cbi-cover" type="text" v-model="characterRef.sheetInfo.cover">
        </span>
      </td>
      <th><label for="cbi-belief">信念</label></th>
      <td class="c2">
        <span>
          <template>{{ characterRef.sheetInfo.belief }}</template>
          <input id="cbi-belief" type="text" v-model="characterRef.sheetInfo.belief">
        </span>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import { UnwrapNestedRefs } from '@vue/reactivity'
import { Character } from '@/feature/character/character'

export default defineComponent({
  name: 'character-basic-info',
  props: {
    character: {
      type: Object as PropType<UnwrapNestedRefs<Character>>,
      required: true
    }
  },
  setup(props) {
    return {
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
  border-right: 1px solid rgb(0, 0, 0);
  border-top: 1px solid rgb(0, 0, 0);
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
    border-width: 0 0 1px 1px;
    border-color: black;
    padding: 0;
    margin: 0;

    > * {
      vertical-align: middle;
    }
  }

  th {
    background-color: black;
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
