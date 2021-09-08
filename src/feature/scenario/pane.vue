<template>
  <div class="url-block">
    <label class="url"><span>キャラクターシート倉庫URL</span><input type="text" v-model="scenario.url" placeholder="https://character-sheets.appspot.com/sgScenario/edit.html?key="></label>
    <label class="sheet-view-pass"><span>秘匿情報閲覧パス</span><input type="text" v-model="scenario.sheetViewPass" placeholder=""><button @click="onReadSheet()">読込</button></label>
  </div>
  <table class="scenario">
    <tbody>
      <tr>
        <th class="th1"><label :for="`scenario-name-${elmId}`"></label>シナリオ名</th>
        <td colspan="3"><input type="text" :id="`scenario-name-${elmId}`" v-model="scenario.sheetInfo.base.name"></td>
        <th class="th3"><label :for="`author-${elmId}`">作成者</label></th>
        <td><input type="text" :id="`author-${elmId}`" v-model="scenario.sheetInfo.base.author"></td>
      </tr>
      <tr>
        <th class="th1"><label>タイプ</label></th>
        <td colspan="3">
          <div class="h-box">
            <label><span>対立型</span><input type="checkbox" v-model="scenario.sheetInfo.base.type1"></label>
            <label><span>協力型</span><input type="checkbox" v-model="scenario.sheetInfo.base.type2"></label>
            <label><span>ﾊﾞﾄﾙﾛｲﾔﾙ型</span><input type="checkbox" v-model="scenario.sheetInfo.base.type3"></label>
            <label><span>特殊型</span><input type="checkbox" v-model="scenario.sheetInfo.base.type4"></label>
          </div>
        </td>
        <th class="th3"><label :for="`stage-${elmId}`">舞台</label></th>
        <td><input type="text" :id="`stage-${elmId}`" v-model="scenario.sheetInfo.base.stage"></td>
      </tr>
      <tr>
        <th class="th1"><label :for="`scene-${elmId}`">シーン表</label></th>
        <td class="scene"><input type="text" :id="`scene-${elmId}`" v-model="scenario.sheetInfo.base.scene"></td>
        <th class="th2"><label :for="`num-${elmId}`">人数</label></th>
        <td class="num"><input type="text" :id="`num-${elmId}`" v-model="scenario.sheetInfo.base.num"></td>
        <th class="th3"><label :for="`limit-${elmId}`">リミット</label></th>
        <td><input type="text" :id="`limit-${elmId}`" v-model="scenario.sheetInfo.base.limit"></td>
      </tr>
      <tr>
        <th class="th1"><label>シークエンス</label></th>
        <td colspan="3">
          <div class="h-box">
            <label><span>通常</span><input type="checkbox" v-model="scenario.sheetInfo.base.seq1"></label>
            <label><span>時限</span><input type="checkbox" v-model="scenario.sheetInfo.base.seq2"></label>
            <label><span>競争</span><input type="checkbox" v-model="scenario.sheetInfo.base.seq3"></label>
          </div>
        </td>
        <th class="th3"><label :for="`menace-${elmId}`">脅威度</label></th>
        <td class="menace">
          <div class="h-box">
            <input type="text" :id="`menace-${elmId}`" v-model="scenario.sheetInfo.base.menace">
            <span>/</span>
            <input type="text" :id="`menacePC-${elmId}`" v-model="scenario.sheetInfo.base.menacePC">
          </div>
        </td>
      </tr>
      <tr>
        <th class="th1"><label :for="`boss-${elmId}`">ボス</label></th>
        <td colspan="3"><input type="text" :id="`boss-${elmId}`" v-model="scenario.sheetInfo.base.boss.name"></td>
        <th class="th3"><label :for="`boss-secret-${elmId}`">秘密</label></th>
        <td><input type="checkbox" :id="`boss-secret-${elmId}`" v-model="scenario.sheetInfo.base.boss.secret"></td>
      </tr>
    </tbody>
  </table>

  <div class="v-box">
    <table class="prize">
      <caption>プライズ</caption>
      <thead>
      <tr>
        <th class="name">名称</th>
        <th class="career-open">公開保持者</th>
        <th class="career-close">保持者</th>
        <th class="secret">秘</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(n, idx) in scenario.sheetInfo.prize" :key="idx">
        <td class="name"><input type="text" v-model="n.name"></td>
        <td class="career-open"><input type="text" v-model="n.careerOpen"></td>
        <td class="career-close"><input type="text" v-model="n.careerClose"></td>
        <td class="secret"><input type="checkbox" v-model="n.secret"></td>
      </tr>
      </tbody>
      <tfoot>
      <tr>
        <td colspan="4"><button @click="onAddPrize()">追加</button></td>
      </tr>
      </tfoot>
    </table>
    <table class="characters">
      <caption>キャラクター</caption>
      <thead>
      <tr>
        <th class="input-url">入力URL</th>
        <th class="link">リンク</th>
        <th class="note">備考</th>
        <th class="secret">秘</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(n, idx) in scenario.sheetInfo.characters" :key="idx">
        <td class="input-url"><input type="text" v-model="n.inputUrl"></td>
        <td class="link"><a :href="n.inputUrl">リンク</a></td>
        <td class="note"><input type="text" v-model="n.note"></td>
        <td class="secret"><input type="checkbox" v-model="n.secret"></td>
      </tr>
      </tbody>
      <tfoot>
      <tr>
        <td colspan="4"><button @click="onAddCharacter()">追加</button></td>
      </tr>
      </tfoot>
    </table>
  </div>

  <div class="v-box">
    <table class="enigma">
      <thead>
      <tr>
        <th class="name">偽装</th>
        <th class="power">戦力</th>
        <th class="menace">脅威度</th>
        <th class="notes">説明</th>
        <th class="target">バインド</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(n, idx) in scenario.sheetInfo.enigma" :key="idx">
        <td class="name"><input type="text" v-model="n.name"></td>
        <td class="power"><input type="text" v-model="n.power"></td>
        <td class="menace"><input type="text" v-model="n.menace"></td>
        <td class="notes"><input type="text" v-model="n.notes"></td>
        <td class="target"><input type="text" v-model="n.target"></td>
      </tr>
      </tbody>
      <tfoot>
      <tr>
        <td colspan="5"><button @click="onAddEnigma()">追加</button></td>
      </tr>
      </tfoot>
    </table>
    <table class="right-hand">
      <thead>
      <tr>
        <th class="name">腹心</th>
        <th class="menace">脅威度</th>
        <th class="notes">説明</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(n, idx) in scenario.sheetInfo.righthand" :key="idx">
        <td class="name"><input type="text" v-model="n.name"></td>
        <td class="menace"><input type="text" v-model="n.menace"></td>
        <td class="notes"><input type="text" v-model="n.notes"></td>
      </tr>
      </tbody>
      <tfoot>
      <tr>
        <td colspan="5"><button @click="onAddRightHand()">追加</button></td>
      </tr>
      </tfoot>
    </table>
  </div>

  <table class="summary">
    <caption>説明</caption>
    <tbody>
      <template v-for="(n, idx) in scenario.sheetInfo.summary" :key="idx">
        <tr>
          <th><label :for="`summary-title-${idx}-${elmId}`"></label>タイトル</th>
          <td class="title"><input type="text" :id="`summary-title-${idx}-${elmId}`" v-model="n.title"></td>
          <th><label :for="`summary-secret-${idx}-${elmId}`"></label>秘</th>
          <td class="secret"><input type="checkbox" :id="`summary-secret-${idx}-${elmId}`" v-model="n.secret"></td>
        </tr>
        <tr>
          <td class="contents" colspan="4"><textarea v-model="n.contents"></textarea></td>
        </tr>
      </template>
    </tbody>
  </table>
  <table class="pc">
    <tbody>
      <template v-for="(n, idx) in scenario.sheetInfo.pc" :key="idx">
        <tr class="space" v-if="idx > 0"></tr>
        <tr>
          <th>PC</th>
          <td class="name"><input type="text" v-model="n.name"></td>
          <th>推奨</th>
          <td class="recommend"><input type="text" v-model="n.recommend"></td>
        </tr>
        <tr>
          <th>導入</th>
          <td class="intro" colspan="3"><textarea v-model="n.intro"></textarea></td>
        </tr>
        <tr>
          <th>使命</th>
          <td class="mission" colspan="3"><input type="text" v-model="n.mission"></td>
        </tr>
        <tr>
          <th>秘密</th>
          <td class="secret" colspan="3"><textarea v-model="n.secret"></textarea></td>
        </tr>
      </template>
    </tbody>
  </table>
  <table class="npc">
    <tbody>
      <template v-for="(n, idx) in scenario.sheetInfo.npc" :key="idx">
        <tr class="space" v-if="idx > 0"></tr>
        <tr>
          <th>NPC</th>
          <td class="name"><input type="text" v-model="n.name"></td>
          <th>概要</th>
          <td class="recommend"><input type="text" v-model="n.recommend"></td>
        </tr>
        <tr>
          <th>設定</th>
          <td class="intro" colspan="3"><textarea v-model="n.intro"></textarea></td>
        </tr>
        <tr>
          <th>使命</th>
          <td class="mission"><input type="text" v-model="n.mission"></td>
          <th>秘匿</th>
          <td class="secret-check"><input type="checkbox" v-model="n.secretcheck"></td>
        </tr>
        <tr>
          <th>秘密</th>
          <td class="secret" colspan="3"><textarea v-model="n.secret"></textarea></td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import Store from './data'
import { ShinobigamiScenarioHelper } from '@/core/utility/shinobigamiScenario'
import { errorDialog } from '@/core/utility/dialog'
import { v4 as uuidV4 } from 'uuid'

export default defineComponent({
  name: 'scenario-pane',
  setup() {
    const elmId = uuidV4()
    const state = Store.injector()
    const scenario = computed(() => state.currentScenario)

    const onReadSheet = async () => {
      console.log(scenario.value.url)
      if (!scenario.value.url) return
      const helper = new ShinobigamiScenarioHelper(scenario.value.url, scenario.value.sheetViewPass)
      if (!helper.isThis()) {
        console.log('is not this')
        return
      }
      const { data: rd, jsons } = await helper.getData()
      console.log(jsons)
      console.log(rd)
      if (!rd) {
        await errorDialog({
          title: 'Loading Error',
          text: 'URLまたは秘匿情報閲覧パスが誤っています。'
        })
        return
      }
      scenario.value.sheetInfo = rd
    }

    return {
      elmId,
      scenario,
      onReadSheet
    }
  }
})
</script>

<style scoped lang="scss">
@use "../../components/common";

.url-block {
  @include common.flex-box(column, stretch, flex-start);
  width: 100%;

  > label {
    @include common.flex-box(row, flex-start, center);

    input {
      flex: 1;
    }
  }
}

.v-box {
  @include common.flex-box(column, flex-start, flex-start, wrap);
  gap: 0.5em;
}

.h-box {
  @include common.flex-box(row, flex-start, center);
}

@mixin set-column-width($class, $width) {
  .#{$class} {
    width: $width;
    min-width: $width;
    max-width: $width;
  }
}

table {
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
  font-size: var(--ninja-arts-table-font-size);
  width: 45em;
  max-width: 45em;
  min-width: 45em;
  box-sizing: border-box;

  textarea {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    min-height: 7em;
    font-size: inherit;
    resize: vertical;
  }

  tr.space {
    min-height: 0.5em;
    height: 0.5em;
  }

  &.summary {
    th {
      width: 5em;
    }
  }

  &.enigma {
    @include set-column-width("menace", 5em);
    @include set-column-width("notes", 13em);
    @include set-column-width("power", 6em);
    @include set-column-width("name", 6em);
  }

  &.pc,
  &.npc {
    th {
      width: 4em;
    }
  }

  &.prize {
    @include set-column-width("name", 12em);
    @include set-column-width("career-open", 12em);
    @include set-column-width("career-close", 12em);
  }

  &.scenario {
    @include set-column-width("th1", 7em);
    @include set-column-width("th2", 3em);
    @include set-column-width("th3", 4em);
    @include set-column-width("menace", 9em);
    .menace {
      input {
        flex: 1;
        min-width: auto;
        max-width: none;
      }
      span {
        margin: 0 0.2rem;
      }
    }
  }

  label {
    cursor: pointer;
  }

  caption {
    text-align: center;
    background-color: #252525;
    color: white;
    font-weight: bold;
    font-size: 110%;
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

  thead tr,
  th {
    background-color: #252525;
    color: white;
  }

  td {
    height: 1.9em;
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
}
</style>
