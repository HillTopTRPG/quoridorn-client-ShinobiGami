<template>
  <div class="special-input-area" v-if="cmdType !== 'normal'" :class="[cmdType]" @click.self="close()">
    <div class="block">
      <div class="type-block">
        <label><input type="radio" v-model="cmdTypeRaw" @click.stop value="SG">SG</label>
        <label><input type="radio" v-model="cmdTypeRaw" @click.stop value="D6">D6</label>
        <label><input type="radio" v-model="cmdTypeRaw" @click.stop value="D6>=?">D6>=?</label>
      </div>
      <button @click="onSubmit()">送信</button>
      <span class="command-text">{{ command }}</span>
      <div class="line">
        <select :value="addValue" @change="setAddValue(convertNumberZero($event.target.value))">
          <option :value="n - 7" v-for="n in 13" :key="n">{{ !(n - 7) ? '±' : (n - 7) > 0 ? '+' : '' }}{{ n - 7 }}</option>
        </select>
        <input type="text" :value="text" @input="setText($event.target.value)" placeholder="コマンド後テキスト">
      </div>
    </div>
    <div class="select-block">
      <select v-model="fromKey">
        <option disabled>使用者</option>
        <option :value="c.key" v-for="c in characterList" :key="c.key">{{ c.data?.sheetInfo.characterName || '' }}</option>
      </select>
      <select :value="ninjaArts" @change="setNinjaArts($event.target.value)" v-if="ninjaArtsList.length">
        <option disabled>忍法</option>
        <option value="">忍法未選択</option>
        <option v-for="(n, ind) in ninjaArtsList" :key="`${ind}-${n.name}`" :value="n.name">{{ n.name }}</option>
      </select>
      <select :value="targetSkill" @change="setTargetSkill($event.target.value)">
        <option disabled>特技</option>
        <option value="">特技未選択</option>
        <template v-for="col of 6" :key="col">
          <optgroup :label="skillColumnList[col - 1]">
            <option v-for="row of 11" :key="row" :value="SkillTable[row - 1][col - 1]">{{ SkillTable[row - 1][col - 1] }}</option>
          </optgroup>
        </template>
      </select>
      <select :value="useSkill" @change="setUseSkill($event.target.value)" v-if="targetValueList.length">
        <option disabled>使用特技</option>
        <option :value="n.name" v-for="n in targetValueList" :key="n.name">{{ n.name }}({{ n.targetValue }})</option>
      </select>
      <select v-model="toKey">
        <option disabled>対象者</option>
        <option :value="null">なし</option>
        <option :value="c.key" v-for="c in characterList" :key="c.key">{{ c.data?.sheetInfo.characterName || '' }}</option>
      </select>
    </div>
    <label class="slider"><span>ダイス数</span><input type="range" min="1" max="4" @click.stop :value="dice" @input="setDice($event.target.valueAsNumber)"><span>{{ dice }}</span></label>
    <label class="slider" v-show="cmdTypeRaw === 'SG'"><span>スペシャル</span><input type="range" min="2" max="12" list="range2-12" @click.stop :value="special" @input="setSpecial($event.target.valueAsNumber)"><span>{{ special }}</span></label>
    <label class="slider" v-show="cmdTypeRaw === 'SG'"><span>ファンブル</span><input type="range" min="2" max="12" list="range2-12" @click.stop :value="fumble" @input="setFumble($event.target.valueAsNumber)"><span>{{ fumble }}</span></label>
    <label class="slider" v-show="cmdTypeRaw !== 'D6'"><span>達成値</span><input type="range" min="2" max="12" list="range2-12" @click.stop :value="targetValue" @input="setTargetValue($event.target.valueAsNumber)"><span>{{ targetValue }}</span></label>
    <datalist id="range2-12">
      <option value="2">2</option>
      <option value="3"></option>
      <option value="4">4</option>
      <option value="5"></option>
      <option value="6">6</option>
      <option value="7"></option>
      <option value="8">8</option>
      <option value="9"></option>
      <option value="10">10</option>
      <option value="11"></option>
      <option value="12">12</option>
    </datalist>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, watchEffect } from 'vue'
import SpecialInputStore, { SpecialInputType } from '@/feature/special-input/data'
import CharacterStore, { Character } from '@/feature/character/data'
import UserStore from '@/core/data/user'
import { NinjaArts, SkillTable } from '@/core/utility/shinobigami'
import { makeComputedObject } from '@/core/utility/vue3'
import { convertNumberZero } from '@/core/utility/PrimaryDataUtility'
import { calcTargetValue, TargetValueCalcResult } from '@/core/utility/TrpgSystemFasade'

export default defineComponent({
  name: 'special-input-area',
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const specialInputStore = SpecialInputStore.injector()
    const specialInputStoreWrap = makeComputedObject(specialInputStore)
    const characterStore = CharacterStore.injector()
    const userStore = UserStore.injector()

    const characterList = computed(() => {
      const owner = specialInputStore.from.key
      return characterStore.characterList
        .filter(c => userStore.selfUser?.type === 'gm' || c.owner === userStore.selfUser?.key)
        .sort((c1, c2) => {
          if (c1.key === owner) return -1
          if (c2.key === owner) return 1
          if (c1.owner === userStore.selfUser?.key) return -1
          if (c2.owner === userStore.selfUser?.key) return 1
          return 0
        })
    })

    const fromKey = ref<string | null>(specialInputStore.from.key)
    watch(() => specialInputStore.from.key, () => {
      fromKey.value = specialInputStore.from.key
    })
    watch(fromKey, () => {
      specialInputStore.from = {
        type: fromKey.value === userStore.selfUser?.name ? 'user' : 'character',
        key: fromKey.value
      }
    })

    // キャラクターデータ
    const characterRef = ref<Character | null>(characterList.value.find(c => c.key === fromKey.value)?.data || null)
    watch(fromKey, () => {
      characterRef.value = characterList.value.find(c => c.key === fromKey.value)?.data || null
    })

    // 忍法データ
    const ninjaArtsList = ref<NinjaArts[]>(characterList.value.find(c => c.key === fromKey.value)?.data?.sheetInfo.ninjaArtsList || [])
    watch(() => characterList.value.find(c => c.key === fromKey.value)?.data?.sheetInfo.ninjaArtsList, () => {
      ninjaArtsList.value.splice(0, ninjaArtsList.value.length, ...(characterList.value.find(c => c.key === fromKey.value)?.data?.sheetInfo.ninjaArtsList || []))
    }, { deep: true })

    // 習得済み特技
    // const learnedSkillList = ref<string[] | null>(characterRef.value ? characterRef.value.sheetInfo.skill.learnedList.map(l => l.name) || null : null)
    // watch(() => characterRef.value?.sheetInfo.skill.learnedList, () => {
    //   learnedSkillList.value = characterRef.value ? characterRef.value.sheetInfo.skill.learnedList.map(l => l.name) || null : null
    // }, { deep: true })

    // 目標値計算結果
    const targetValueList = ref<TargetValueCalcResult[]>([])
    watch([
      () => specialInputStore.targetSkill,
      () => characterRef.value?.sheetInfo.skill
    ], () => {
      const targetSkill = specialInputStore.targetSkill
      const tokugi = characterRef.value?.sheetInfo.skill
      if (targetSkill && tokugi) {
        targetValueList.value.splice(0, targetValueList.value.length, ...calcTargetValue(targetSkill, tokugi))
      } else {
        targetValueList.value.splice(0, targetValueList.value.length)
      }
    }, { deep: true })

    const toKey = ref<string | null>(specialInputStore.to?.key || null)
    watchEffect(() => {
      specialInputStore.to = toKey.value ? {
        type: 'character',
        key: toKey.value
      } : null
    })

    const cmdTypeRaw = ref<SpecialInputType>(specialInputStore.cmdType)
    watch(() => specialInputStore.cmdType, () => {
      cmdTypeRaw.value = specialInputStore.cmdType
    })
    watch(cmdTypeRaw, () => {
      specialInputStore.setCmdType(cmdTypeRaw.value)
    })

    const close = () => {
      specialInputStore.setCmdType('normal')
    }

    const onSubmit = () => {
      emit('submit')
    }

    return {
      convertNumberZero,
      cmdTypeRaw,
      targetValueList,
      fromKey,
      toKey,
      characterList,
      ninjaArtsList,
      ...specialInputStoreWrap,
      close,
      SkillTable,
      skillColumnList: ['器術', '体術', '忍術', '謀術', '戦術', '妖術'],
      onSubmit
    }
  }
})
</script>

<style scoped lang="scss">
@use "../common";
@use "sass:math";

.special-input-area {
  @include common.flex-box(column, center, center);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  box-sizing: border-box;
  z-index: 100;
  gap: 0.3em;
  backdrop-filter: blur(10px);
}

select,
input {
  height: 2em;
  box-sizing: border-box;
}

.block {
  @include common.flex-box(column, center, center);
  background-color: rgba(255, 255, 255, 0.5);
  width: max(20em, 90vmin);

  .type-block {
    @include common.flex-box(row, flex-start, center);
    flex: 1;
  }

  input[type='text'] {
    margin-left: 0.5em;
  }

  .command-text {
    font-size: 120%;
  }

  >.line {
    @include common.flex-box(row, center, center);
  }

  .target-list {
    @include common.flex-box(row, flex-start, center);
  }

  button {
    font-size: 110%;
  }
}

label {
  @include common.flex-box(row, center, center);
  padding: 0.5em;

  &.slider {
    width: 90vmin;
    padding: 0 1em;
    background-color: rgba(255, 255, 255, 0.5);

    :first-child {
      font-weight: bold;
    }

    :last-child {
      font-weight: bold;
      font-size: 140%;
      width: 2em;
    }

    input {
      flex: 1;
    }
  }
}
</style>
