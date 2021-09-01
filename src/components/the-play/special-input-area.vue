<template>
  <div class="special-input-area" :class="[info.cmdType]" @click="close()">
    <div class="block">
      <div class="type-block">
        <label><input type="radio" v-model="cmdType" @click.stop value="SG">SG</label>
        <label><input type="radio" v-model="cmdType" @click.stop value="D6">D6</label>
        <label><input type="radio" v-model="cmdType" @click.stop value="D6>=?">D6>=?</label>
      </div>
      <label><button @click="onSubmit()">{{ commandText }}</button></label>
    </div>
    <label class="slider"><span>ダイス数</span><input type="range" min="1" max="4" @click.stop v-model="dice"><span>{{ dice }}</span></label>
    <label class="slider"><span>スペシャル</span><input type="range" min="2" max="12" list="range2-12" @click.stop v-model="special"><span>{{ special }}</span></label>
    <label class="slider"><span>ファンブル</span><input type="range" min="2" max="12" list="range2-12" @click.stop v-model="fumble"><span>{{ fumble }}</span></label>
    <label class="slider"><span>達成値</span><input type="range" min="2" max="12" list="range2-12" @click.stop v-model="target"><span>{{ target }}</span></label>
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
import { computed, defineComponent, PropType, ref, watch } from 'vue'

export type SpecialInputInfo = {
  cmdType: 'normal' | 'SG' | 'D6' | 'D6>=?';
  ownerType: 'character' | 'user';
  owner: string | null;
  target: number;
  special: number;
  fumble: number;
  dice: number;
  inputFlg: boolean;
}

export type SpecialInputResult = {
  command: string;
  owner: string | null;
  ownerType: 'character' | 'user';
}

export default defineComponent({
  name: 'special-input-area',
  props: {
    info: {
      type: Object as PropType<SpecialInputInfo>,
      required: true
    }
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const cmdType = ref<'normal' | 'SG' | 'D6' | 'D6>=?'>('SG')
    const special = ref(12)
    const fumble = ref(2)
    const target = ref(5)
    const dice = ref(2)
    const ownerType = ref<'character' | 'user'>('user')
    const owner = ref<string | null>(null)
    watch(() => props.info, () => {
      const info = props.info
      if (info.inputFlg) {
        cmdType.value = props.info.cmdType
        special.value = props.info.special
        fumble.value = props.info.fumble
        target.value = props.info.target
        dice.value = props.info.dice
        ownerType.value = props.info.ownerType
        owner.value = props.info.owner
        info.inputFlg = false
      }
    }, { deep: true, immediate: true })
    const close = () => (emit('close'))
    const commandText = computed(() => {
      let cmd = ''
      if (cmdType.value === 'SG') {
        cmd = `${dice.value}SG@${special.value}#${fumble.value}>=${target.value}`
      }
      if (cmdType.value === 'D6') {
        cmd = `${dice.value}D6`
      }
      if (cmdType.value === 'D6>=?') {
        cmd = `${dice.value}D6>=${target.value}`
      }
      return cmd
    })
    const onSubmit = () => {
      emit('submit', {
        command: commandText.value,
        owner: owner.value,
        ownerType: ownerType.value
      })
    }
    return {
      dice,
      commandText,
      cmdType,
      special,
      fumble,
      target,
      close,
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
  z-index: 10;
  gap: 1em;
  backdrop-filter: blur(10px);
}

.block {
  @include common.flex-box(column, center, center);
  background-color: rgba(255, 255, 255, 0.5);
  width: 20em;

  .type-block {
    @include common.flex-box(row, flex-start, center);
    flex: 1;
  }

  button {
    font-size: 150%;
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
