<template>
    <transition name="character-fade">
      <div
        class="character"
        :style="{ '--color': character.data.color }"
      >
        <h2>{{ character.data.sheetInfo.characterName }}</h2>
        <div class="upper">{{ character.data.sheetInfo.upperStyle }}</div>
        <div class="sub">{{ character.data.sheetInfo.subStyle }}</div>
        <div class="background" v-for="(bg, ind) in character.data.sheetInfo.backgroundList" :key="ind">{{ bg.name }}</div>
        <table class="ninja-arts">
          <tr>
            <th class="name">忍法名</th>
            <th class="target-skill">指定特技</th>
            <th class="range">間合</th>
            <th class="cost">コスト</th>
          </tr>
          <tr v-for="(n, ind) in character.data.sheetInfo.ninpouList" :key="ind">
            <td class="name">{{n.name}}</td>
            <td class="target-skill">{{n.targetSkill}}</td>
            <td class="range">{{n.range}}</td>
            <td class="cost">{{n.cost}}</td>
          </tr>
        </table>

        <skill-table-set :character-key="character.key" :view-comp="true" />
      </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent, PropType, watch } from 'vue'
import { Character } from '@/store/character'
import { StoreData } from '@/utility/FileUtility'
import { tokugiTable } from '@/components/the-play/ope-part/shinobigami'
import { listDelete } from '@/components/the-play/ope-part/PrimaryDataUtility'
import { HtmlEvent } from '@/utility/typescript'
import SkillTableSet from '@/components/the-play/part/skill-table-set.vue'

export default defineComponent({
  name: 'character-detail-view',
  components: { SkillTableSet },
  props: {
    character: {
      type: Object as PropType<StoreData<Character>>,
      required: true
    }
  },
  setup(props) {
    const onChangeGapHead = (e: HtmlEvent<HTMLInputElement>, col: number): void => {
      const character = props.character
      if (character && character.data) {
        const list = character.data.sheetInfo.tokugi.spaceList
        console.log(e.target.checked, typeof e.target.checked)
        e.target.checked ? list.push(col) : listDelete(list, d => d === col)
      }
    }
    watch(() => props.character.data?.sheetInfo.tokugi.spaceList, () => {
      const list = props.character.data?.sheetInfo.tokugi.spaceList
      console.log(JSON.stringify(list, null, '  '))
    }, { deep: true })
    const onChangeDamageHead = (e: HtmlEvent<HTMLInputElement>, col: number): void => {
      const character = props.character
      if (character && character.data) {
        const damagedColList = character.data.sheetInfo.tokugi.damagedColList
        const damageList = character.data.sheetInfo.tokugi.damagedList
        if (e.target.checked) {
          damagedColList.push(col)
          damageList.push(...tokugiTable.map((row, ind) => ({
            name: row[col],
            row: ind,
            column: col
          })))
        } else {
          listDelete(damagedColList, d => d === col)
          listDelete(damageList, d => d.column === col)
        }
      }
    }
    const onClickSkillName = (name: string, row: number, column: number): void => {
      const character = props.character
      if (character && character.data) {
        const list = character.data.sheetInfo.tokugi.learnedList
        const index = list.findIndex(s => s.name === name)
        if (index < 0) {
          list.push({ name, row, column })
        } else {
          list.splice(index, 1)
        }
      }
    }
    return {
      skillColumnList: [['　', '器術'], ['A', '体術'], ['B', '忍術'], ['C', '謀術'], ['D', '戦術'], ['E', '妖術']],
      tokugiTable,
      onChangeGapHead,
      onChangeDamageHead,
      onClickSkillName
    }
  }
})
</script>

<style scoped lang="scss">
@use "../../common";

.character-fade-leave-active, .character-fade-enter-active {
  transition: opacity .5s;
}
.character-fade-leave-to, .character-fade-enter /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

table {
  font-size: 10px;
  border-collapse: collapse;
  border-spacing: 0;
  border-right: 1px solid rgb(0, 0, 0);
  border-top: 1px solid rgb(0, 0, 0);
  table-layout: fixed;

  input {
    padding: 0;
    margin: 0;
  }

  td, th {
    text-align: center;
    white-space: nowrap;
    border-bottom: 1px solid rgb(0, 0, 0);
    border-left: 1px solid rgb(0, 0, 0);
    padding: 0;
    margin: 0;

    > * {
      vertical-align: middle;
    }
  }

  &.ninja-arts {
    .secret {
      width: 2em;
    }
    .name {
      white-space: pre-wrap;
    }
    .type {
      white-space: nowrap;
    }
    .target-skill {
      white-space: nowrap;
    }
    .range {
      white-space: nowrap;
    }
    .cost {
      white-space: nowrap;
    }
    .effect {
      text-align: left;
    }
    .page {
      white-space: nowrap;
    }
  }

  &.background {
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
