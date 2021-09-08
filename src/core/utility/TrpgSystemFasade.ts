import { SaikoroFictionTokugi } from '@/core/utility/SaikoroFiction'
import { SkillTable } from '@/core/utility/shinobigami'

export function getRowCol(name: string): { r: number, c: number } {
  let r = -1
  let c = -1
  SkillTable.forEach((rl, rIdx) => {
    const cIdx = rl.findIndex(n => n === name)
    if (cIdx >= 0) {
      r = rIdx
      c = cIdx
    }
  })
  return { r, c }
}

export type TargetValueCalcResult = {
  r: number;
  c: number;
  name: string;
  targetValue: number;
}

export function calcTargetValue(name: string, skill: SaikoroFictionTokugi): TargetValueCalcResult[] {
  const { r, c } = getRowCol(name)
  if (r === -1 || c === -1) return []
  return skill.learnedList
    .filter(
      t =>
        (!skill.isUseColDamage ||
          !skill.damagedColList.some(c => c === t.column)) &&
        (!skill.isUseSingleDamage ||
          !skill.damagedList.some(
            d => d.row === t.row && d.column === t.column
          ))
    )
    .map(t => {
      const learnedTokugi = SkillTable[t.row][t.column]
      const calcHorizontalMove = (): number => {
        return [...Array(Math.abs(t.column - c))].reduce(
          (accumulator, currentValue_, idx) => {
            const currentColumn = Math.min(t.column, c) + idx
            const targetGapNum = currentColumn === 5 ? 0 : currentColumn + 1
            const isContain = skill.spaceList.some(s => s === targetGapNum)
            return accumulator + (isContain ? 1 : 2)
          },
          0
        )
      }
      let cMove = calcHorizontalMove()
      // 一番左のギャップが埋まっていたら、左右が繋がっているものとして扱う
      if (skill.spaceList.some(s => s === 0)) {
        const cMoveRight: number = [...Array(6 - Math.abs(t.column - c))].reduce(
          (accumulator, currentValue_, idx) => {
            let currentColumn = Math.max(t.column, c) + idx
            if (currentColumn >= 6) currentColumn -= 6
            const targetGapNum = currentColumn === 5 ? 0 : currentColumn + 1
            const isContain = skill.spaceList.some(s => s === targetGapNum)
            return accumulator + (isContain ? 1 : 2)
          },
          0
        )
        cMove = Math.min(cMove, cMoveRight)
      }
      let rMove = Math.abs(t.row - r)
      if (skill.outRow) {
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
