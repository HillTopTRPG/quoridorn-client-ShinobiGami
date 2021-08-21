import { ComputedRef } from '@vue/reactivity'

export interface SampleData {
  counter: number;
  initCounter: number;
  message: {
    action: string | null;
    amount: number | null;
  };
}

type UiSize = {
  em?: number;
  rem?: number;
  px?: number;
  vw?: number;
  vh?: number;
  vmin?: number;
  vmax?: number;
  percent?: number;
};

export type TabInfo = {
  key: string;
  text: string;
  isDisabled: boolean;
  target:
    | string
    | {
    from: number;
    to: number;
  };
};

// eslint-disable-next-line no-use-before-define
export type SlotUnionInfo = SlotFlexInfo | SlotTabInfo;

type SlotBase = {
  layout: 'h-box' | 'v-box';
  slotName?: string;
  blockList?: SlotUnionInfo[];
}
export type SlotFlexInfo = SlotBase & {
  minWidth?: UiSize;
  maxWidth?: UiSize;
  minHeight?: UiSize;
  maxHeight?: UiSize;
  flex?: number;
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto';
  justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
  alignContent?: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
  flexWrap: boolean;
  toggle?: ComputedRef<boolean>;
  viewWeight?: number;
};

export type SlotTab = TabInfo & SlotBase;

export type SlotTabInfo = {
  layout: 'tab';
  tabKey: string;
  tabList: SlotTab[];
  hasSetting: boolean;
  minWidth?: UiSize;
  maxWidth?: UiSize;
  minHeight?: UiSize;
  maxHeight?: UiSize;
  toggle?: ComputedRef<boolean>;
  viewWeight?: number;
};
