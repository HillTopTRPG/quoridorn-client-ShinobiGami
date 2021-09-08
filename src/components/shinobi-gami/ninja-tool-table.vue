<template>
  <table class="ninja-tools">
    <thead>
      <tr>
        <th class="name">名称</th>
        <th class="num">個数</th>
        <th class="effect">効果</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(t, ind) in character.sheetInfo.ninjaToolList" :key="ind">
        <td class="name"><span><input type="text" v-model="t.name"></span></td>
        <td class="count"><span><input type="number" v-model="t.count"></span></td>
        <td class="effect">
          <textarea v-model="t.effect"></textarea>
        </td>
      </tr>
    </tbody>
    <tfoot>
    <tr>
      <td colspan="4">
        <button @click="addNinjaTool()">追加</button>
      </td>
    </tr>
    </tfoot>
  </table>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Character } from '@/feature/character/data'

export default defineComponent({
  name: 'ninja-tool-table',
  props: {
    character: {
      type: Object as PropType<Character>,
      required: true
    }
  },
  setup(props) {
    const addNinjaTool = () => {
      const ninjaToolList = props.character.sheetInfo.ninjaToolList
      ninjaToolList.push({
        name: '',
        count: 0,
        effect: ''
      })
    }

    return {
      addNinjaTool
    }
  }
})
</script>

<style scoped lang="scss">
@use "../common";

table.ninja-tools {
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
  font-size: var(--ninja-tool-table-font-size);

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

  td.name {
    text-align: left;
  }
  .name {
    white-space: nowrap;
    width: 10em;
  }

  td.effect {
    text-align: left;
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
}
</style>
