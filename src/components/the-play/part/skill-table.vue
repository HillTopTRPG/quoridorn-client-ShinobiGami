<template>
  <table class="skill">
    <caption>
      <div>
        <template v-if="isComp">
          <select v-model="otherCharaKey">
            <option :value="null">なし</option>
            <template v-for="c in characterList" :key="c.key">
              <option
                v-if="c.data && c.data.type === 'character'"
                :value="c.key"
              >{{ c.data.sheetInfo.characterName }}</option>
            </template>
          </select>
        </template>
        <template v-else>
          <label>設定<input type="radio" name="operation-type" value="input" v-model="operationType"></label>
          <label>判定<input type="radio" name="operation-type" value="judge" v-model="operationType"></label>
        </template>
      </div>
    </caption>
    <thead v-if="skill">
      <tr>
        <template v-for="(s, col) in skillColumnList" :key="s[0]">
          <th :class="`gap-${col}`">
            <label>
              <input
                :disabled="isComp"
                type="checkbox"
                :checked="skill.spaceList.some(n => n === col)"
                @change="onChangeGapHead($event, col)"
              >
              {{s[0]}}
            </label>
          </th>
          <th :class="`skill-${col}`">
            <label>
              {{s[1]}}
              <input
                :disabled="isComp"
                type="checkbox"
                :checked="skill.damagedColList.some(n => n === col)"
                @change="onChangeDamageHead($event, col)"
              >
            </label>
          </th>
        </template>
        <th class="row-num" rowspan="2"></th>
      </tr>
    </thead>
    <tbody v-if="skill">
      <tr :class="`row-${row}`" v-for="(tList, row) in tokugiTable" :key="row">
        <template v-for="(t, col) in tList" :key="t">
          <td :class="[`gap-${col}`, skill.spaceList.some(n => n === col) ? 'fill' : '']"></td>
          <td :class="[
            `skill-${col}`,
            t === selectedSkill ? 'selected' : '',
            skill.learnedList.some(n => n.column === col && n.row === row)? 'learned' : '',
            skill.damagedList.some(d => d.name === t) ? 'damaged' : ''
          ]">
            <span
              class="target-value"
              v-if="targetValueList.some(tv => tv.name === t)"
              :style="{ '--value': `'>=${targetValueList.find(tv => tv.name === t).targetValue}'` }"
            ></span>
            <label @click="onClickSkillName(t, row, col)">{{ t }}</label>
          </td>
        </template>
        <td class="row-num">{{ row + 2 }}</td>
      </tr>
    </tbody>
    <tfoot v-if="skill">
      <tr>
        <td class="out-row" colspan="13" :class="skill.outRow ? 'fill' : ''">
          <label><input :disabled="isComp" type="checkbox" :checked="skill.outRow" @change="onChangeOutRow($event)"></label>
        </td>
      </tr>
    </tfoot>
  </table>
</template>

<script lang="ts">
import { defineComponent, watch, ref, reactive } from 'vue'
import { tokugiTable } from '@/components/the-play/ope-part/shinobigami'
import { listDelete } from '@/components/the-play/ope-part/PrimaryDataUtility'
import { HtmlEvent } from '@/utility/typescript'
import { SaikoroFictionTokugi } from '@/components/the-play/ope-part/SaikoroFiction'
import { ApplicationError } from '@/error/ApplicationError'
import CharacterStore from '@/store/character'

function getRowCol(name: string): { r: number, c: number } {
  let r = -1
  let c = -1
  tokugiTable.forEach((rl, rIdx) => {
    const cIdx = rl.findIndex(n => n === name)
    if (cIdx >= 0) {
      r = rIdx
      c = cIdx
    }
  })
  if (r === -1 || c === -1) throw new ApplicationError(`Not found skill ${name}`)
  return { r, c }
}

function calcTargetValue(name: string, tokugi: SaikoroFictionTokugi): {
  r: number;
  c: number;
  name: string;
  targetValue: number;
}[] {
  const { r, c } = getRowCol(name)
  return tokugi.learnedList
    .filter(
      t =>
        (!tokugi.isUseColDamage ||
          !tokugi.damagedColList.some(c => c === t.column)) &&
        (!tokugi.isUseSingleDamage ||
          !tokugi.damagedList.some(
            d => d.row === t.row && d.column === t.column
          ))
    )
    .map(t => {
      const learnedTokugi = tokugiTable[t.row][t.column]
      const calcHorizontalMove = (): number => {
        return [...Array(Math.abs(t.column - c))].reduce(
          (accumulator, currentValue_, idx) => {
            const currentColumn = Math.min(t.column, c) + idx
            const targetGapNum = currentColumn === 5 ? 0 : currentColumn + 1
            const isContain = tokugi.spaceList.some(s => s === targetGapNum)
            return accumulator + (isContain ? 1 : 2)
          },
          0
        )
      }
      let cMove = calcHorizontalMove()
      // 一番左のギャップが埋まっていたら、左右が繋がっているものとして扱う
      if (tokugi.spaceList.some(s => s === 0)) {
        const cMoveRight: number = [...Array(6 - Math.abs(t.column - c))].reduce(
          (accumulator, currentValue_, idx) => {
            let currentColumn = Math.max(t.column, c) + idx
            if (currentColumn >= 6) currentColumn -= 6
            const targetGapNum = currentColumn === 5 ? 0 : currentColumn + 1
            const isContain = tokugi.spaceList.some(s => s === targetGapNum)
            return accumulator + (isContain ? 1 : 2)
          },
          0
        )
        cMove = Math.min(cMove, cMoveRight)
      }
      let rMove = Math.abs(t.row - r)
      if (tokugi.outRow) {
        rMove = Math.min(rMove, Math.min(t.row, r) + 11 - Math.max(t.row, r))
      }

      return {
        r: t.row,
        c: t.column,
        name: learnedTokugi,
        targetValue: rMove + cMove + 5
      }
    })
    .sort((v1, v2) => {
      if (v1.targetValue < v2.targetValue) return -1
      return v2.targetValue < v1.targetValue ? 1 : 0
    })
}

export default defineComponent({
  name: 'skill-table',
  props: {
    characterKey: {
      type: String,
      required: true
    },
    targetSkill: {
      type: String,
      default: null
    },
    isComp: { // 比較対象であるかどうか
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const selectedSkill = ref<string | null>(null)
    const targetValueList = reactive<{ name: string; targetValue: number; }[]>([])
    watch(selectedSkill, () => {
      emit('update:targetSkill', selectedSkill.value)
    })
    const skill = ref<SaikoroFictionTokugi | null>(null)
    const onChangeSelectedSkill = (name: string | null): void => {
      if (!name || !skill.value) {
        targetValueList.splice(0, targetValueList.length)
        return
      }
      const list = calcTargetValue(name, skill.value)
      list.forEach(tv => {
        console.log(name, tv.name, tv.c, tv.r, tv.targetValue)
      })
      targetValueList.splice(0, targetValueList.length, ...list.map(o => ({ name: o.name, targetValue: o.targetValue })))
    }
    const characterStore = CharacterStore.injector()
    const otherCharaKey = ref<string | null>(null)
    watch(() => props.targetSkill, () => {
      selectedSkill.value = props.targetSkill
      onChangeSelectedSkill(props.targetSkill)
    }, { immediate: true })
    watch([
      () => props.characterKey,
      () => props.isComp,
      characterStore.characterList,
      otherCharaKey
    ], () => {
      const target = props.isComp ? otherCharaKey.value : props.characterKey
      const character = characterStore.characterList.value.find(c => c.key === target)
      skill.value = character?.data?.sheetInfo.tokugi || null
      onChangeSelectedSkill(props.targetSkill)
    }, { immediate: true, deep: true })
    const operationType = ref<'input' | 'judge'>('judge')
    const onChangeGapHead = (e: HtmlEvent<HTMLInputElement>, col: number): void => {
      if (!skill.value) return
      const list = skill.value.spaceList
      e.target.checked ? list.push(col) : listDelete(list, d => d === col)
    }
    const onChangeDamageHead = (e: HtmlEvent<HTMLInputElement>, col: number): void => {
      if (!skill.value) return
      const damagedColList = skill.value.damagedColList
      const damageList = skill.value.damagedList
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
    const onClickSkillName = (name: string): void => {
      if (!skill.value) return
      const { r, c } = getRowCol(name)
      if (operationType.value === 'input') {
        const list = skill.value.learnedList
        const index = list.findIndex(s => s.name === name)
        index < 0 ? list.push({ name, row: r, column: c }) : list.splice(index, 1)
      } else {
        selectedSkill.value = selectedSkill.value === name ? null : name
      }
    }
    const onChangeOutRow = (e: HtmlEvent<HTMLInputElement>) => {
      if (skill.value) {
        skill.value.outRow = e.target.checked
      }
    }
    return {
      otherCharaKey,
      targetValueList,
      selectedSkill,
      skill,
      operationType,
      ...characterStore,
      skillColumnList: [['　', '器術'], ['A', '体術'], ['B', '忍術'], ['C', '謀術'], ['D', '戦術'], ['E', '妖術']],
      tokugiTable,
      onChangeGapHead,
      onChangeDamageHead,
      onClickSkillName,
      onChangeOutRow
    }
  }
})
</script>

<style scoped lang="scss">
@use "../../common";

table {
  font-size: 10px;
  border-collapse: collapse;
  border-spacing: 0;
  border-right: 1px solid rgb(0, 0, 0);
  border-top: 1px solid rgb(0, 0, 0);
  table-layout: fixed;

  caption {
    text-align: left;
    div {
      height: 2em;
      @include common.flex-box(row, flex-start, center, wrap)
    }
    label {
      @include common.flex-box(row, flex-start, center)
    }
  }

  input {
    padding: 0;
    margin: 0;
  }

  td, th {
    position: relative;
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

  th {
    cursor: pointer;
    * {
      cursor: inherit;
    }
  }

  &.skill {
    @mixin fill-cell {
      background-color: black;
      color: white;
    }
    @mixin set-width($width) {
      width: $width;
      min-width: $width;
    }
    @mixin set-label-css($direction, $height, $horizontal: center) {
      > label {
        @include common.flex-box($direction, $horizontal, center);
        height: $height;
      }
    }

    thead {
      th { @include fill-cell; }
      *[class^="gap"] { @include set-label-css(column, 2rem); }
      *[class^="skill"] { @include set-label-css(row, 2rem); }
    }

    tbody {
      *[class^="gap"] { @include set-label-css(column, 2em); }
      *[class^="skill"] { @include set-label-css(row, 2em); }
    }

    .out-row {
      @include set-label-css(row, 2em, flex-start);
      width: 100%;
    }

    .target-value {
      @include common.flex-box(row, center, center);
      z-index: 1;
      position: absolute;
      color: black;
      right: 0;
      transform: translateX(80%);
      top: 0;
      bottom: 0;
      margin: auto;
      background-color: yellow;
      border: solid gray 1px;
      border-radius: 5px;
      padding: 5px;
      overflow: visible;
      cursor: pointer;

      &:before {
        content: var(--value);
        display: block;
      }

      &:after {
        content: '';
        background-color: yellow;
        //border: 1px solid gray;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 10px;
        height: 10px;
        margin: auto;
        transform: translateX(-5px) rotate(45deg);
        transform-origin: center center;
        z-index: -1;
      }
    }

    .learned,
    .fill {
      @include fill-cell;
    }

    *[class^="gap-"] {
      @include set-width(1.4em);
    }

    td[class^="skill-"] {
      cursor: pointer;

      * {
        cursor: inherit;
      }
    }
    *[class^="skill-"] {
      @include set-width(5.2em);

      &.selected {
        outline: red 3px solid;
        outline-offset: 1px;
      }

      &.damaged.learned {
        &:before,
        &:after {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          width: 5em;
          height: 2px;
          background-color: red;
          transform-origin: center center;
          pointer-events: none;
        }

        &:before {
          transform: translateX(-50%) rotate(19deg);
        }

        &:after {
          transform: translateX(-50%) rotate(-19deg);
        }
      }
    }

    .row-num {
      @include fill-cell;
      @include set-width(1.4em);
    }
  }
}
</style>
