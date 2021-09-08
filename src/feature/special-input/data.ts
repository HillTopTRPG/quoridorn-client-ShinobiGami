import { reactive } from 'vue'
import { makeStore, StoreUpdateProperties } from '@/core/utility/vue3'
import { DataReference } from '@/core/data/user'
import { Character, Store as CharacterStoreDefinition } from '@/feature/character/data'
import { SkillTable } from '@/core/utility/shinobigami'
import { calcTargetValue } from '@/core/utility/TrpgSystemFasade'

export type SpecialInputType = 'normal' | 'SG' | 'D6' | 'D6>=?'

type Store = {
  ready: boolean;
  characterStore: CharacterStoreDefinition | null;
  cmdType: SpecialInputType;
  setCmdType: (cmdType: SpecialInputType) => void;
  /* { type: 'character', key: '[キャラクターキー]' }
   */
  from: DataReference;
  /* { type: 'character', key: '[キャラクターキー]' }
   */
  to: DataReference | null;
  ninjaArts: string | null;
  setNinjaArts: (ninjaArts: string | null) => void;
  targetSkill: string | null;
  setTargetSkill: (targetSkill: string | null) => void;
  useSkill: string | null;
  setUseSkill: (useSkill: string | null) => void;
  targetValue: number;
  setTargetValue: (targetValue: number) => void;
  special: number;
  setSpecial: (special: number) => void;
  fumble: number;
  setFumble: (fumble: number) => void;
  dice: number;
  addValue: number;
  setAddValue: (addValue: number) => void;
  setDice: (dice: number) => void;
  text: string;
  setText: (text: string) => void;
  command: string;
}

export default makeStore<Store>('local-setting-store', () => {
  const state = reactive<StoreUpdateProperties<Store, 'command'>>({
    ready: true,
    characterStore: null,
    cmdType: 'normal',
    from: {
      type: null,
      key: null
    },
    to: {
      type: null,
      key: null
    },
    ninjaArts: null,
    targetSkill: null,
    useSkill: null,
    targetValue: 5,
    special: 12,
    fumble: 2,
    dice: 2,
    addValue: 0,
    text: ''
  })

  const resetUseSkill = (character: Character | null) => {
    let newUseSkill: string | null = null
    if (state.targetSkill && character?.sheetInfo.skill) {
      const targetValueResult = calcTargetValue(state.targetSkill, character?.sheetInfo.skill)
      if (targetValueResult.some(r => r.name === state.useSkill)) {
        newUseSkill = state.useSkill
      } else {
        newUseSkill = targetValueResult[0]?.name || null
      }
    }
    state.useSkill = newUseSkill
  }

  const makeText = (): string => {
    let text = ''

    // 指定特技が特技表に載っている忍法データを準備
    const character = state.from.type === 'character' ? state.characterStore?.characterList.find(c => c.key === state.from.key)?.data || null : null
    const ninjaArts = character?.sheetInfo.ninjaArtsList.find(n => n.name === state.ninjaArts) || null

    if (character) {
      if (state.targetSkill && !SkillTable.flatMap(tt => tt).some(t => t === state.targetSkill)) {
        state.targetSkill = null
      }
      if (state.targetSkill) {
        const targetValue = calcTargetValue(state.targetSkill, character.sheetInfo.skill).find(tv => tv.name === state.useSkill)?.targetValue || null
        state.targetValue = targetValue !== null ? targetValue : 5
      } else {
        state.targetValue = 5
      }
    }

    const altSkill = state.targetSkill === state.useSkill ? '' : ` → ${state.useSkill}`
    const skillText = state.targetSkill ? `${state.targetSkill}${altSkill}` : null
    if (ninjaArts) {
      text += text ? ' ' : ''
      text += ninjaArts.name
      if (skillText) text += `(${skillText})`
    } else {
      if (SkillTable.flatMap(tt => tt).some(t => t === state.targetSkill)) {
        text += text ? ' ' : ''
        text += skillText
      }
    }

    if (state.to) {
      const toKey = state.to.key
      if (state.to.type === 'character') {
        const character = state.characterStore?.characterList.find(c => c.key === toKey)
        text += ` → ${character?.data?.sheetInfo.characterName || ''}`
      } else {
        text += ` → ${toKey}`
      }
    }

    return text
  }

  return {
    get ready() { return state.ready },
    get characterStore() { return state.characterStore },
    set characterStore(characterStore) { state.characterStore = characterStore },
    get cmdType() { return state.cmdType },
    setCmdType(cmdType: SpecialInputType) {
      // 最後に設定すること
      state.cmdType = cmdType
      if (state.cmdType === 'D6') {
        state.targetSkill = null
        state.ninjaArts = null
        state.useSkill = null
        state.to = null
      }
      state.text = makeText()
    },
    get from() { return state.from },
    set from(from) {
      state.from = from
      const character = state.from.type === 'character' ? state.characterStore?.characterList.find(c => c.key === state.from.key)?.data || null : null
      if (state.ninjaArts) {
        const ninjaArts = character?.sheetInfo.ninjaArtsList.find(n => n.name === state.ninjaArts) || null
        if (ninjaArts) {
          state.targetSkill = ninjaArts.targetSkill
        } else {
          state.ninjaArts = character?.sheetInfo.ninjaArtsList[0]?.name || null
          state.targetSkill = character?.sheetInfo.ninjaArtsList[0]?.targetSkill || null
        }
      }
      resetUseSkill(character)
    },
    get to() { return state.to },
    set to(to) {
      state.to = to
      state.text = makeText()
    },
    get useSkill() { return state.useSkill },
    setUseSkill(useSkill: string | null) {
      state.useSkill = useSkill
      state.text = makeText()
    },
    get targetValue() { return state.targetValue },
    setTargetValue(targetValue: number) { state.targetValue = targetValue },
    get targetSkill() { return state.targetSkill },
    setTargetSkill(targetSkill: string | null) {
      state.targetSkill = targetSkill
      const character = state.from.type === 'character' ? state.characterStore?.characterList.find(c => c.key === state.from.key)?.data || null : null
      resetUseSkill(character)
      state.text = makeText()
    },
    get ninjaArts() { return state.ninjaArts },
    setNinjaArts(ninjaArts: string | null) {
      state.ninjaArts = ninjaArts
      const character = state.from.type === 'character' ? state.characterStore?.characterList.find(c => c.key === state.from.key)?.data || null : null
      const ninjaArtsInfo = character?.sheetInfo.ninjaArtsList.find(n => n.name === state.ninjaArts) || null
      state.targetSkill = ninjaArtsInfo?.targetSkill || null

      if (character?.sheetInfo.skill && state.targetSkill) {
        const targetValueResult = calcTargetValue(state.targetSkill, character.sheetInfo.skill)
        if (!targetValueResult.some(r => r.name === state.useSkill)) {
          state.useSkill = targetValueResult[0]?.name
        }
      }

      state.text = makeText()
    },
    get special() { return state.special },
    setSpecial(special: number) { state.special = special },
    get fumble() { return state.fumble },
    setFumble(fumble: number) { state.fumble = fumble },
    get dice() { return state.dice },
    setDice(dice: number) { state.dice = dice },
    get text() { return state.text },
    setText(text: string) { state.text = text },
    get addValue() { return state.addValue },
    setAddValue(addValue: number) { state.addValue = addValue },
    get command() {
      const afterText = state.text ? ` ${state.text}` : ''
      const addValueText = !state.addValue
        ? ''
        : state.addValue > 0
          ? `+${state.addValue}`
          : state.addValue.toString(10)
      if (state.cmdType === 'normal') return ''
      if (state.cmdType === 'D6') return `${state.dice}D6${addValueText}${afterText}`
      if (state.cmdType === 'D6>=?') return `${state.dice}D6${addValueText}>=${state.targetValue}${afterText}`
      // SG
      return `${state.dice}SG@${state.special}#${state.fumble}${addValueText}>=${state.targetValue}${afterText}`
    }
  }
})
