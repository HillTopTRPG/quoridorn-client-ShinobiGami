<template>
  <table class="background">
    <thead>
      <tr>
        <th class="name">名称</th>
        <th class="type">種別</th>
        <th class="point">功績点</th>
        <th class="effect">効果</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(bg, ind) in character.sheetInfo.backgroundList" :key="ind">
        <td class="name"><span><input type="text" v-model="bg.name"></span></td>
        <td class="type">
          <span>
            <select v-model="bg.type">
              <option value="長所">長所</option>
              <option value="弱点">弱点</option>
            </select>
          </span>
        </td>
        <td class="point"><span><input type="text" v-model="bg.point"></span></td>
        <td class="effect">
          <textarea v-model="bg.effect"></textarea>
        </td>
      </tr>
    </tbody>
    <tfoot>
    <tr>
      <td colspan="4">
        <button @click="addBackground()">追加</button>
      </td>
    </tr>
    </tfoot>
  </table>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Character } from '@/feature/character/data'
import { ShinobigamiHelper } from '@/core/utility/shinobigami'

export default defineComponent({
  name: 'background-table',
  props: {
    character: {
      type: Object as PropType<Character>,
      required: true
    }
  },
  setup(props) {
    console.log(props.character)
    const reloadBackground = async () => {
      const helper = new ShinobigamiHelper(props.character.sheetInfo.url, props.character.sheetViewPass)
      if (!helper.isThis()) {
        console.log('is not this')
        return
      }
      const { data: rd, jsons } = await helper.getData()
      console.log(jsons)
      console.log(rd)
      if (!rd) return
      const backgroundList = props.character.sheetInfo.backgroundList
      backgroundList.splice(0, props.character.sheetInfo.backgroundList.length, ...rd.backgroundList)
    }

    const addBackground = () => {
      const backgroundList = props.character.sheetInfo.backgroundList
      backgroundList.push({
        name: '',
        type: '長所',
        point: '',
        effect: ''
      })
    }

    return {
      reloadBackground,
      addBackground
    }
  }
})
</script>

<style scoped lang="scss">
@use "../common";

table.background {
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
  font-size: var(--background-table-font-size);

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

  td.name,
  td.effect {
    text-align: left;
  }

  .name {
    white-space: nowrap;
    width: 10em;
  }

  .type {
    white-space: nowrap;
    width: 5em;
  }

  .point {
    white-space: nowrap;
    width: 4em;
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
