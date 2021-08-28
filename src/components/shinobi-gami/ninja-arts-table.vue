<template>
  <table class="ninja-arts">
    <tr>
      <th class="secret" v-if="viewType === 'edit'">秘</th>
      <th class="name">忍法名</th>
      <th class="type" v-if="viewType === 'edit'">タイプ</th>
      <th class="target-skill">指定特技</th>
      <th class="range">間合</th>
      <th class="cost">コスト</th>
      <th class="effect" v-if="viewType === 'edit'">効果</th>
      <th class="page" v-if="viewType === 'edit'">参照p</th>
    </tr>
    <tr v-for="(n, ind) in character.sheetInfo.ninpouList" :key="ind">
      <td class="secret" v-if="viewType === 'edit'">{{n.secret}}</td>
      <td class="name">{{n.name}}</td>
      <td class="type" v-if="viewType === 'edit'">{{n.type}}</td>
      <td class="target-skill">{{n.targetSkill}}</td>
      <td class="range">{{n.range}}</td>
      <td class="cost">{{n.cost}}</td>
      <td class="effect" v-if="viewType === 'edit'">{{n.effect}}</td>
      <td class="page" v-if="viewType === 'edit'">{{n.page}}</td>
    </tr>
  </table>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Character } from '@/feature/character/character'

export default defineComponent({
  name: 'ninja-arts-table',
  props: {
    viewType: {
      type: String as PropType<'normal' | 'edit'>,
      require: true
    },
    character: {
      type: Object as PropType<Character>,
      required: true
    }
  },
  setup() {
    return {
    }
  }
})
</script>

<style scoped lang="scss">
@use "../common";

table.ninja-arts {
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
  }

  td, th {
    position: relative;
    text-align: center;
    border-style: solid;
    border-width: 0 0 1px 1px;
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
  .secret {
    width: 2em;
  }
  .name {
    white-space: nowrap;
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
    white-space: break-spaces;
  }
  .page {
    white-space: nowrap;
  }
}
</style>
