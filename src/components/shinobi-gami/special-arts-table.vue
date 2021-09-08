<template>
  <table class="special-arts">
    <thead>
      <tr>
        <th class="name">名称</th>
        <th class="skill">指定特技</th>
        <th class="effect">効果／強み／弱み</th>
        <th class="direction">演出</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(sa, ind) in character.sheetInfo.specialArtsList" :key="ind">
        <td class="name"><span><input type="text" v-model="sa.name"></span></td>
        <td class="skill">
          <span>
            <select v-model="sa.skill">
              <option value=""></option>
              <option :value="s" v-for="s in skillList" :key="s">{{ s }}</option>
            </select>
          </span>
        </td>
        <td class="effect">
          <textarea v-model="sa.effect"></textarea>
        </td>
        <td class="direction">
          <textarea v-model="sa.direction"></textarea>
        </td>
      </tr>
    </tbody>
    <tfoot>
    <tr>
      <td colspan="4">
        <button @click="addSpecialArts()">追加</button>
      </td>
    </tr>
    </tfoot>
  </table>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { Character } from '@/feature/character/data'
import { ShinobigamiHelper } from '@/core/utility/shinobigami'

export default defineComponent({
  name: 'special-arts-table',
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

    const skillList = computed(() => props.character.sheetInfo.skill.learnedList.map(l => l.name).filter((s, ind, self) => self.findIndex(ss => ss === s) === ind))

    const addSpecialArts = () => {
      const specialArtsList = props.character.sheetInfo.specialArtsList
      specialArtsList.push({
        name: '',
        skill: skillList.value[0] || '',
        effect: '',
        direction: ''
      })
    }

    return {
      reloadBackground,
      addSpecialArts,
      skillList
    }
  }
})
</script>

<style scoped lang="scss">
@use "../common";

table.special-arts {
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
  font-size: var(--special-arts-table-font-size);

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

  .skill {
    white-space: nowrap;
    width: 7em;
  }

  td.effect,
  td.direction {
    text-align: left;
  }

  .effect,
  .direction {
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
