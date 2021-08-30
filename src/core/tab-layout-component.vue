<template>
  <div class='tab-layout-component' ref='root' :style='containerStyle'>
    <div class='tab-list' role='tablist' @mousewheel.prevent>
      <button
        v-if='beforePartTab.val'
        :class='{
          disabled: beforePartTab.val.isDisabled
        }'
        class='before-part'
        role='tab'
        :aria-selected='beforePartTab.val.key === localValue.key'
        :aria-controls='`${uiId}-panel-0`'
        :id='`${uiId}-tab-0`'
        tabindex='-1'
        @click='onClickTab(beforePartTab.val)'
      >{{ beforePartTab.val.text }}</button>
      <div class='tab-container' :class='{ hasBeforePartTab: beforePartTab.val}'>
        <button
          v-for='(tab, idx) in tabList'
          :key='tab.key'
          :class='{
            disabled: tab.isDisabled,
            hidden: !viewTabList.some(t => t.key === tab.key)
          }'
          role='tab'
          :aria-selected='tab.key === localValue.key'
          :aria-controls='`${uiId}-panel-${idx + 1}`'
          :id='`${uiId}-tab-${idx + 1}`'
          :tabindex='tab.key === localValue.key ? 0 : -1'
          @click='onClickTab(tab)'
          @keydown.right='onClickTab(tabList[idx + 1 < tabList.length ? idx + 1 : 0])'
          @keydown.left='onClickTab(tabList[idx - 1 >= 0 ? idx - 1 : tabList.length - 1])'
        >{{ tab.text }}</button>
      </div>
      <button
        v-show='isShowTabSelect'
        class='btn tab-select'
        role='tab'
        tabindex='0'
        @click='onClickTabSelectBtn'
      >▼</button>
      <select
        ref='tabSelect'
      >
        <option
          v-for='tab in tabList'
          :key='tab.key'
          :value='tab.key'
        >{{ tab.text }}</option>
      </select>
      <button
        v-if='hasSetting'
        class='btn setting'
        role='tab'
        tabindex='0'
        @click='onClickSetting'
      >@</button>
    </div>
    <div
      v-for='(tab, idx) in tabList'
      :key='`${uiId}-panel-${idx + 1}`'
      :id='`${uiId}-panel-${idx + 1}`'
      role='tabpanel'
      class='tab-contents'
      :class='{ hidden: tab.key !== localValue.key }'
      tabindex='-1'
      :aria-labelledby='`${uiId}-tab-${idx + 1}`'
    >
      <slot :tab='tab'></slot>
    </div>
  </div>
</template>

<script lang='ts'>
import {
  defineComponent,
  PropType,
  computed,
  watch,
  ref,
  onMounted,
  onBeforeUnmount,
  reactive
} from 'vue'
import { v4 as uuidV4 } from 'uuid'
import { refObj } from '@/core/utility/vue-util'
import { TabInfo, UiSize, uiSize2css } from '@/core/flexible-data-layout.vue'
import { PickPropTypeKeys } from '@/core/utility/typescript'

type SizePropType = {
  minWidth?: UiSize
  maxWidth?: UiSize
  minHeight?: UiSize
  maxHeight?: UiSize
  viewWeight?: number
}

export default defineComponent({
  name: 'TabLayoutComponent',
  emits: ['input', 'open-tab-setting'],
  props: {
    tabList: {
      type: Object as PropType<TabInfo[]>,
      required: true,
      validator: (tabList: TabInfo[]) => tabList.length > 0
    },
    tabKey: {
      type: String,
      required: true
    },
    hasSetting: {
      type: Boolean,
      required: false,
      default: false
    },
    modelValue: {
      type: Object as PropType<TabInfo>,
      required: false,
      default: null
    },
    size: {
      type: Object as PropType<SizePropType>,
      required: false,
      default: null
    }
  },
  setup(props, { emit }) {
    const root = ref<HTMLDivElement>()
    const tabSelect = ref<HTMLSelectElement>()

    const localValue = computed((): TabInfo =>
      props.tabList.find(t => t.key === props.modelValue?.key) ?? props.tabList[0]
    )

    const isShowTabSelect = ref(false)
    const viewTabList = ref(props.tabList)
    const beforePartTab = refObj<TabInfo | null>(null)

    const getTabElmList = (): HTMLElement[] => {
      const tabElmSelectResult = root.value?.querySelectorAll('.tab-container [role="tab"]')
      return tabElmSelectResult
        ? Array.from(tabElmSelectResult).filter((tabElm): tabElm is HTMLElement => tabElm instanceof HTMLElement)
        : []
    }

    const setOverTabList = () => {
      const tabElmList = getTabElmList()
      const tabContainerElm = root.value?.querySelector('.tab-container') as HTMLElement
      const widthList = tabElmList.map(elm => elm.offsetWidth)
      const sum = widthList.reduce((a1, a2) => a1 + a2, 0)
      beforePartTab.val = null
      if (sum <= tabContainerElm.offsetWidth) {
        // 全部表示できる
        viewTabList.value = props.tabList
        isShowTabSelect.value = false
      } else {
        // 表示するタブを制限する
        isShowTabSelect.value = true
        const tabIndex = props.tabList.findIndex(t => localValue.value.key === t.key)
        const makeOrderIndexList = () => {
          const indexList = [tabIndex]
          let minIndex = tabIndex
          let maxIndex = tabIndex
          while (minIndex > 0 || maxIndex < props.tabList.length - 1) {
            if (minIndex > 0) indexList.push(--minIndex)
            if (maxIndex < props.tabList.length - 1) indexList.push(++maxIndex)
          }
          return indexList
        }

        const indexList = makeOrderIndexList()
        let width = widthList[indexList[0]]
        let i = 0
        let minIndex = tabIndex
        let maxIndex = tabIndex
        do {
          width += widthList[indexList[++i]]
          if (tabContainerElm.offsetWidth && indexList[i] === props.tabList.length - 1) {
            break
          }
          if (indexList[i] < minIndex) minIndex = indexList[i]
          if (maxIndex < indexList[i]) maxIndex = indexList[i]
        } while (width <= tabContainerElm.offsetWidth)
        if (minIndex > 0) {
          beforePartTab.val = reactive(props.tabList[minIndex - 1])
        }
        console.log(beforePartTab.val)
        viewTabList.value = props.tabList.filter((_, idx) => minIndex <= idx && idx <= maxIndex)
      }
    }

    const onResize = () => {
      console.log('resize')
      setOverTabList()
    }

    onMounted(() => {
      window.addEventListener('resize', onResize)
      onResize()
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', onResize)
    })

    // タブの選択が変わった後に、表示された入力項目にフォーカスを当てる
    watch(localValue, () => {
      setOverTabList()
      setTimeout(() => {
        try {
          const inputElmList = Array.prototype.slice.call(
            root.value?.querySelectorAll('[role="tabpanel"]:not(.hidden) .input:not(:disabled)')
          ) as HTMLInputElement[]
          if (inputElmList.length) inputElmList[0].focus()
        } catch (err) {
          console.error(err)
        }
      })
    })

    return {
      uiId: uuidV4(),
      root,
      beforePartTab,
      viewTabList,
      isShowTabSelect,
      tabSelect,
      useTabList: computed(() => props.tabList.filter(tab => !tab.isDisabled)),
      localValue,
      onClickTab: (tab: TabInfo) => {
        if (localValue.value.key !== tab.key) {
          emit('input', tab)
        }
      },
      onClickSetting: () => {
        emit('open-tab-setting', props.tabKey)
      },
      onClickTabSelectBtn: () => {
        console.log('onClickTabSelectBtn')
        if (tabSelect.value) {
          tabSelect.value.style.display = tabSelect.value.style.display === 'none' ? '' : 'none'
          if (tabSelect.value.style.display === '') {
            tabSelect.value.focus()
            const optionElm: HTMLOptionElement = tabSelect.value.getElementsByTagName('OPTION')[0] as HTMLOptionElement
            console.log(optionElm)
            setTimeout(() => {
              optionElm.click()
              optionElm.focus()
            }, 30)
          }
        }
      },
      containerStyle: computed(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const styleObj: any = {}
        if (props.size) {
          const setUiSize = (prop: PickPropTypeKeys<SizePropType, UiSize>) => {
            if (props.size[prop]) styleObj[prop] = uiSize2css(props.size[prop])
          }
          setUiSize('minWidth' as PickPropTypeKeys<SizePropType, UiSize>)
          setUiSize('maxWidth' as PickPropTypeKeys<SizePropType, UiSize>)
          setUiSize('minHeight' as PickPropTypeKeys<SizePropType, UiSize>)
          setUiSize('maxHeight' as PickPropTypeKeys<SizePropType, UiSize>)
          if (props.size.viewWeight) {
            styleObj.flex = props.size.viewWeight
          }
        }
        return styleObj
      })
    }
  }
})
</script>

<style scoped lang="scss">
.tab-layout-component {
  display: inline-flex;
  flex-direction: column;
  box-sizing: border-box;
}
.tab-list {
  position: relative;
}
.tab-list select {
  position: absolute;
  top: 100%;
  right: 2em;
  z-index: 5;
  box-sizing: border-box;
  font-size: inherit;
  height: 2em;
}
.tab-container {
  display: inline-flex;
  flex-direction: row;
  box-sizing: border-box;
  flex: 1;
  flex-wrap: nowrap;
  height: 2em;
  overflow-x: scroll;
  -ms-overflow-style: none;    /* IE, Edge 対応 */
  scrollbar-width: none;       /* Firefox 対応 */
}
.tab-container.hasBeforePartTab {
  margin-left: 15px;
}
.tab-container::-webkit-scrollbar {  /* Chrome, Safari 対応 */
  display:none;
}

[role='tab'][aria-selected='true'] {
  z-index: 3;
}
[role='tab'][aria-selected='true']:after {
   content: '';
   position: absolute;
   left: 0;
   right: 0;
   top: 0;
   border-top: 3px solid blue;
 }
[role='tablist'] {
  display: flex;
  flex-direction: row;
  align-content: stretch;
  justify-content: flex-start;
  margin-bottom: -1px;
  overflow: hidden;
}
[role='tab'].btn {
  padding: 0;
  width: 2em;
}
[role='tab'].before-part {
  position: absolute;
  left: 0;
  transform: translateX(calc(-100% + 15px));
  z-index: 2;
}
[role='tab'].hidden {
  position: absolute;
  top: -100%;
  left: 0;
}
[role='tab'] {
  position: relative;
  z-index: 1;
  background: white;
  border-radius: 5px 5px 0 0;
  border: 1px solid grey;
  border-bottom: 0;
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2em;
  font-size: inherit;
}
[role='tabpanel'].hidden {
  display: none;
}
[role='tabpanel'] {
  position: relative;
  border: 1px solid grey;
  border-radius: 0 0 5px 5px;
  background: white;
  z-index: 2;
  height: calc(100% - 2em + 1px);
  box-sizing: border-box;
  overflow: auto;
}
button {
  background-color: transparent;
  cursor: pointer;
  /*outline: none*/
  appearance: none;
}
</style>
