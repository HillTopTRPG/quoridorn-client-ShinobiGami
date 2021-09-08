<template>
  <div class="url-block" v-if="isGm">
    <label class="url"><span>キャラクターシート倉庫URL</span><input type="text" v-model="scenario.url" placeholder="https://character-sheets.appspot.com/sgScenario/edit.html?key="></label>
    <label class="sheet-view-pass"><span>秘匿情報閲覧パス</span><input type="text" v-model="scenario.sheetViewPass" placeholder=""><button @click="onReadSheet()">読込</button></label>
  </div>
  <table class="scenario">
    <tbody>
      <tr>
        <th class="th1"><label :for="isGm ? `scenario-name-${elmId}` : ''"></label>シナリオ名</th>
        <td colspan="3">
          <input type="text" v-if="isGm" :id="`scenario-name-${elmId}`" v-model="scenario.sheetInfo.base.name">
          <template v-else>{{ scenario.sheetInfo.base.name }}</template>
        </td>
        <th class="th3"><label :for="isGm ? `author-${elmId}` : ''">作成者</label></th>
        <td>
          <input type="text" v-if="isGm" :id="`author-${elmId}`" v-model="scenario.sheetInfo.base.author">
          <template v-else>{{ scenario.sheetInfo.base.author }}</template>
        </td>
      </tr>
      <tr>
        <th class="th1"><label>タイプ</label></th>
        <td colspan="3">
          <div class="h-box">
            <label>
              <span>対立型</span>
              <input type="checkbox" v-if="isGm" v-model="scenario.sheetInfo.base.type1">
              <input type="checkbox" v-else :checked="scenario.sheetInfo.base.type1" @click.prevent>
            </label>
            <label>
              <span>協力型</span>
              <input type="checkbox" v-if="isGm" v-model="scenario.sheetInfo.base.type2">
              <input type="checkbox" v-else :checked="scenario.sheetInfo.base.type2" @click.prevent>
            </label>
            <label>
              <span>ﾊﾞﾄﾙﾛｲﾔﾙ型</span>
              <input type="checkbox" v-if="isGm" v-model="scenario.sheetInfo.base.type3">
              <input type="checkbox" v-else :checked="scenario.sheetInfo.base.type3" @click.prevent>
            </label>
            <label>
              <span>特殊型</span>
              <input type="checkbox" v-if="isGm" v-model="scenario.sheetInfo.base.type4">
              <input type="checkbox" v-else :checked="scenario.sheetInfo.base.type4" @click.prevent>
            </label>
          </div>
        </td>
        <th class="th3"><label :for="isGm ? `stage-${elmId}` : ''">舞台</label></th>
        <td>
          <input type="text" v-if="isGm" :id="`stage-${elmId}`" v-model="scenario.sheetInfo.base.stage">
          <template v-else>{{ scenario.sheetInfo.base.stage }}</template>
        </td>
      </tr>
      <tr>
        <th class="th1"><label :for="isGm ? `scene-${elmId}` : ''">シーン表</label></th>
        <td class="scene">
          <input type="text" v-if="isGm" :id="`scene-${elmId}`" v-model="scenario.sheetInfo.base.scene">
          <template v-else>{{ scenario.sheetInfo.base.scene }}</template>
        </td>
        <th class="th2"><label :for="isGm ? `num-${elmId}` : ''">人数</label></th>
        <td class="num">
          <input type="text" v-if="isGm" :id="`num-${elmId}`" v-model="scenario.sheetInfo.base.num">
          <template v-else>{{ scenario.sheetInfo.base.num }}</template>
        </td>
        <th class="th3"><label :for="isGm ? `limit-${elmId}` : ''">リミット</label></th>
        <td>
          <input type="text" v-if="isGm" :id="`limit-${elmId}`" v-model="scenario.sheetInfo.base.limit">
          <template v-else>{{ scenario.sheetInfo.base.limit }}</template>
        </td>
      </tr>
      <tr>
        <th class="th1"><label>シークエンス</label></th>
        <td colspan="3">
          <div class="h-box">
            <label>
              <span>通常</span>
              <input type="checkbox" v-if="isGm" v-model="scenario.sheetInfo.base.seq1">
              <input type="checkbox" v-else :checked="scenario.sheetInfo.base.seq1" @click.prevent>
            </label>
            <label>
              <span>時限</span>
              <input type="checkbox" v-if="isGm" v-model="scenario.sheetInfo.base.seq2">
              <input type="checkbox" v-else :checked="scenario.sheetInfo.base.seq2" @click.prevent>
            </label>
            <label>
              <span>競争</span>
              <input type="checkbox" v-if="isGm" v-model="scenario.sheetInfo.base.seq3">
              <input type="checkbox" v-else :checked="scenario.sheetInfo.base.seq3" @click.prevent>
            </label>
          </div>
        </td>
        <th class="th3"><label :for="isGm ? `menace-${elmId}` : ''">脅威度</label></th>
        <td class="menace">
          <div class="h-box">
            <input type="text" v-if="isGm" :id="`menace-${elmId}`" v-model="scenario.sheetInfo.base.menace">
            <template v-else>{{ scenario.sheetInfo.base.menace }}</template>
            <span>/</span>
            <input type="text" v-if="isGm" :id="`menacePC-${elmId}`" v-model="scenario.sheetInfo.base.menacePC">
            <template v-else>{{ scenario.sheetInfo.base.menacePC }}</template>
          </div>
        </td>
      </tr>
      <tr>
        <th class="th1"><label :for="isGm ? `boss-${elmId}` : ''">ボス</label></th>
        <td colspan="3">
          <input type="text" v-if="isGm" :id="`boss-${elmId}`" v-model="scenario.sheetInfo.base.boss.name">
        </td>
        <th class="th3"><label :for="isGm ? `boss-secret-${elmId}` : ''">秘密</label></th>
        <td>
          <input type="checkbox" v-if="isGm" :id="`boss-secret-${elmId}`" v-model="scenario.sheetInfo.base.boss.secret">
          <input type="checkbox" v-else :checked="scenario.sheetInfo.base.boss.secret" @click.prevent>
        </td>
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
        <template v-if="isGm || !n.secret">
          <td class="name">
            <input type="text" v-if="isGm" v-model="n.name">
            <template v-else>{{ n.name }}</template>
          </td>
          <td class="career-open">
            <input type="text" v-if="isGm" v-model="n.careerOpen">
            <template v-else>{{ n.careerOpen }}</template>
          </td>
          <td class="career-close">
            <input type="text" v-if="isGm" v-model="n.careerClose">
            <template v-else>{{ n.careerClose }}</template>
          </td>
          <td class="secret">
            <input type="checkbox" v-if="isGm" v-model="n.secret">
            <input type="checkbox" v-else :checked="n.secret" @click.prevent>
          </td>
        </template>
      </tr>
      </tbody>
      <tfoot v-if="isGm">
      <tr>
<!--        <td colspan="4"><button @click="onAddPrize()">追加</button></td>-->
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
        <template v-if="isGm || !n.secret">
          <td class="input-url">
            <input type="text" v-if="isGm" v-model="n.inputUrl">
            <template>{{ n.inputUrl }}</template>
          </td>
          <td class="link"><a :href="n.inputUrl">リンク</a></td>
          <td class="note">
            <input type="text" v-if="isGm" v-model="n.note">
            <template v-else>{{ n.note }}</template>
          </td>
          <td class="secret">
            <input type="checkbox" v-if="isGm" v-model="n.secret">
            <input type="checkbox" v-else :checked="n.secret" @click.prevent>
          </td>
        </template>
      </tr>
      </tbody>
      <tfoot v-if="isGm">
      <tr>
<!--        <td colspan="4"><button @click="onAddCharacter()">追加</button></td>-->
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
        <th class="open">公開</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(n, idx) in scenario.sheetInfo.enigma" :key="idx">
        <td class="name">
          <input type="text" v-if="isGm" v-model="n.name">
          <template v-else>{{ n.name }}</template>
        </td>
        <td class="power">
          <input type="text" v-if="isGm" v-model="n.power">
          <template v-if="!isGm && n.open">{{ n.power }}</template>
        </td>
        <td class="menace">
          <input type="text" v-if="isGm" v-model="n.menace">
          <template v-if="!isGm && n.open">{{ n.menace }}</template>
        </td>
        <td class="notes">
          <input type="text" v-if="isGm" v-model="n.notes">
          <template v-if="!isGm && n.open">{{ n.notes }}</template>
        </td>
        <td class="target">
          <input type="text" v-if="isGm" v-model="n.target">
          <template v-if="!isGm && n.open">{{ n.target }}</template>
        </td>
        <td class="open">
          <input type="checkbox" v-if="isGm" v-model="n.open">
          <input type="checkbox" v-else :checked="n.open" @click.prevent>
        </td>
      </tr>
      </tbody>
      <tfoot v-if="isGm">
      <tr>
<!--        <td colspan="5"><button @click="onAddEnigma()">追加</button></td>-->
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
          <td class="name">
            <input type="text" v-if="isGm" v-model="n.name">
            <template v-else>{{ n.name }}</template>
          </td>
          <td class="menace">
            <input type="text" v-if="isGm" v-model="n.menace">
            <template v-else>{{ n.menace }}</template>
          </td>
          <td class="notes">
            <input type="text" v-if="isGm" v-model="n.notes">
            <template v-else>{{ n.notes }}</template>
          </td>
        </tr>
      </tbody>
      <tfoot v-if="isGm">
      <tr>
<!--        <td colspan="5"><button @click="onAddRightHand()">追加</button></td>-->
      </tr>
      </tfoot>
    </table>
  </div>

  <table class="summary">
    <caption>説明</caption>
    <tbody>
      <template v-for="(n, idx) in scenario.sheetInfo.summary" :key="idx">
        <template v-if="isGm || !n.secret">
          <tr>
            <th><label :for="isGm ? `summary-title-${idx}-${elmId}` : ''"></label>タイトル</th>
            <td class="title">
              <input type="text" v-if="isGm" :id="`summary-title-${idx}-${elmId}`" v-model="n.title">
              <template v-else>{{ n.title }}</template>
            </td>
            <th><label :for="isGm ? `summary-secret-${idx}-${elmId}` : ''"></label>秘</th>
            <td class="secret">
              <input type="checkbox" v-if="isGm" :id="`summary-secret-${idx}-${elmId}`" v-model="n.secret">
              <input type="checkbox" v-else :checked="n.secret" @click.prevent>
            </td>
          </tr>
          <tr>
            <td class="contents" colspan="4">
              <textarea v-if="isGm" v-model="n.contents"></textarea>
              <template v-else>{{ n.contents }}</template>
            </td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>
  <table class="pc">
    <tbody>
      <template v-for="(n, idx) in scenario.sheetInfo.pc" :key="idx">
        <tr class="space" v-if="idx > 0"></tr>
        <tr>
          <th>PC</th>
          <td class="name">
            <input type="text" v-if="isGm" v-model="n.name">
            <template v-else>{{ n.name }}</template>
          </td>
          <th>推奨</th>
          <td class="recommend">
            <input type="text" v-if="isGm" v-model="n.recommend">
            <template>{{ n.recommend }}</template>
          </td>
        </tr>
        <tr>
          <th>導入</th>
          <td class="intro" colspan="3">
            <textarea v-if="isGm" v-model="n.intro"></textarea>
            <template v-else>{{ n.intro }}</template>
          </td>
        </tr>
        <tr>
          <th>使命</th>
          <td class="mission" colspan="3">
            <input type="text" v-if="isGm" v-model="n.mission">
            <template v-else>{{ n.mission }}</template>
          </td>
        </tr>
        <tr>
          <th>秘密</th>
          <td class="secret" colspan="3">
            <textarea v-if="isGm" v-model="n.secret"></textarea>
            <template v-if="!isGm && isOpen(n.openList)">{{ n.secret }}</template>
          </td>
        </tr>
        <tr>
          <th>秘密保有</th>
          <td class="secret-owner" colspan="3">
            <label v-for="c in characterList" :key="c.key">
              <input type="checkbox" v-if="isGm" :checked="n.openList?.some(o => o === c.key)" @change.prevent="$event.target.checked ? n.openList.push(c.key) : removeFilter(n.openList, i => i === c.key)">
              <input type="checkbox" v-else :checked="n.openList?.some(o => o === c.key)" @click.prevent>
              <span>{{ c.data?.pcNo ? `(PC${c.data?.pcNo})` : '' }}{{ c.data?.sheetInfo.characterName }}</span>
            </label>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
  <table class="npc">
    <tbody>
      <template v-for="(n, idx) in scenario.sheetInfo.npc" :key="idx">
        <template v-if="isGm || !n.secretcheck">
          <tr class="space" v-if="idx > 0"></tr>
          <tr>
            <th>NPC</th>
            <td class="name">
              <input type="text" v-if="isGm" v-model="n.name">
              <template v-else>{{ n.name }}</template>
            </td>
            <th>概要</th>
            <td class="recommend">
              <input type="text" v-if="isGm" v-model="n.recommend">
              <template v-else>{{ n.recommend }}</template>
            </td>
          </tr>
          <tr>
            <th>設定</th>
            <td class="intro" colspan="3">
              <textarea v-if="isGm" v-model="n.intro"></textarea>
              <template>{{ n.intro }}</template>
            </td>
          </tr>
          <tr>
            <th>使命</th>
            <td class="mission">
              <input type="text" v-if="isGm" v-model="n.mission">
              <template v-else>{{ n.mission }}</template>
            </td>
            <th>秘匿</th>
            <td class="secret-check">
              <input type="checkbox" v-if="isGm" v-model="n.secretcheck">
              <input type="checkbox" v-else :checked="n.secretcheck" @click.prevent>
            </td>
          </tr>
          <tr>
            <th>秘密</th>
            <td class="secret" colspan="3">
              <textarea v-if="isGm" v-model="n.secret"></textarea>
              <template v-if="!isGm && isOpen(n.openList)">{{ n.secret }}</template>
            </td>
          </tr>
          <tr>
            <th>秘密保有</th>
            <td class="secret-owner" colspan="3">
              <label v-for="c in characterList" :key="c.key">
                <input type="checkbox" v-if="isGm" :checked="n.openList?.some(o => o === c.key)" @change.prevent="$event.target.checked ? n.openList.push(c.key) : removeFilter(n.openList, i => i === c.key)">
                <input type="checkbox" v-else :checked="n.openList?.some(o => o === c.key)" @click.prevent>
                <span>{{ c.data?.pcNo ? `(PC${c.data?.pcNo})` : '' }}{{ c.data?.sheetInfo.characterName }}</span>
              </label>
            </td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import Store from './data'
import UserStore from '@/core/data/user'
import CharacterStore from '@/feature/character/data'
import { ShinobigamiScenarioHelper } from '@/core/utility/shinobigamiScenario'
import { errorDialog } from '@/core/utility/dialog'
import { v4 as uuidV4 } from 'uuid'
import { removeFilter } from '@/core/utility/typescript'

export default defineComponent({
  name: 'scenario-pane',
  emits: ['close'],
  setup() {
    const elmId = uuidV4()
    const state = Store.injector()
    const scenario = computed(() => state.currentScenario)
    const userStore = UserStore.injector()
    const characterState = CharacterStore.injector()

    const isGm = computed(() => userStore.selfUser?.type === 'gm')
    console.log(isGm.value ? 'isGM' : 'nonGM')

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
      rd.pc.forEach(pc => {
        pc.openList = []
      })
      rd.npc.forEach(npc => {
        npc.openList = []
      })
      rd.enigma.forEach(e => {
        e.open = false
      })
      scenario.value.sheetInfo = rd
    }

    return {
      characterList: computed(() => characterState.characterList),
      removeFilter,
      elmId,
      isGm,
      scenario,
      onReadSheet,
      isOpen: (openList: string[]) => userStore.selfUser?.refList.some(r => openList.some(o => o === r.key))
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

    .secret-owner {
      label {
        @include common.flex-box(row, flex-start, center);
      }
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

    &:not([multiple]) {
      height: 2em;
    }
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
