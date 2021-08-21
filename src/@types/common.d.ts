declare let Swal: {
  fire: (obj: any) => Promise<{ isConfirmed: boolean }>;
}
declare let YT: any

declare module 'address' {
  type Anchor =
    | 'left-top'
    | 'left-center'
    | 'left-bottom'
    | 'center-top'
    | 'center'
    | 'center-bottom'
    | 'right-top'
    | 'right-center'
    | 'right-bottom';
}

declare module 'compare' {
  type Operand =
    | { refType: 'variable-myself' }
    | { refType: 'db-id-exist' }
    | { refType: 'exclusion-check' }
    | { refType: 'permission-check'; type: 'view' | 'edit' | 'chmod' }
    | {
        refType: 'db-search-exist';
        searchProperty: string;
        searchValue: string;
      }
    | {
        refType: 'db-search-length';
        searchProperty: string;
        searchValue: string;
      }
    | { refType: 'db-id-property'; property: string }
    | { refType: 'db-id-owner-property'; level: number; property: string }
    | {
        refType: 'db-search-property';
        searchProperty: string;
        searchValue: string;
        property: string;
      }
    | { refType: 'can-create-chat-palette' }
    | string
    | number
    | boolean;

  type SimpleCompareInfo = {
    lhs: Operand;
    rhs: Operand;
    isNot?: boolean;
  };

  type MultiCompareInfo = {
    operator: 'and' | 'or';
    list: SimpleCompareInfo[];
  };

  type CompareInfo = SimpleCompareInfo | MultiCompareInfo;
}

declare module 'mode' {
  type ModeInfo =
    | ModalModeInfo
    | ThrowParabolaModeInfo
    | ViewCardDeckInfo
    | DropPieceModeInfo
    | ProcessInfo
    | SpecialDragMode
    | ScreenModeInfo;

  type ModalModeInfo = {
    type: 'modal';
    value: 'on' | 'off';
  };

  type ThrowParabolaModeInfo = {
    type: 'throw-parabola';
    value: 'on' | 'off';
  };

  type ViewCardDeckInfo = {
    type: 'view-card-deck';
    value: {
      flag: 'on' | 'off';
      cardDeckKey: string;
    };
  };

  type DropPieceModeInfo = {
    type: 'drop-piece';
    value: 'on' | 'off';
  };

  type ProcessInfo = {
    type: 'view-progress';
    value: {
      message: string;
      all: number;
      current: number;
    };
  };

  type ScreenModeType = 'normal' | 'draw-map';
  type ScreenModeInfo = {
    type: 'screen-mode';
    value: ScreenModeType;
  };

  type SpecialDragMode = {
    type: 'special-drag';
    value: 'on' | 'off';
  };
}

declare module 'task-info' {
  type ThrowParabolaInfo = {
    key?: string;
    char: string;
    radius?: number;
    ratio?: number;
  };

  type BgmPlayInfo = {
    key: string;
  };

  type BgmStandByInfo = {
    key: string;
  };

  type StandByReturnInfo = {
    windowKey: string;
  };

  type TabMoveInfo = {
    windowKey: string;
    addIndex: 1 | -1;
  };

  type RowSelectInfo = {
    windowKey: string;
    addIndex: 1 | -1;
  };

  type DropPieceInfo = {
    type: string;
    dropWindow: string;
    offsetX: number;
    offsetY: number;
    pageX: number;
    pageY: number;
  };

  type UpdateResourceInfo = {
    resourceMasterKey: string;
    ownerType: 'actor-list' | 'scene-object-list';
    ownerKey: string;
    operationType: 'set' | 'add';
    value: string;
  };

  type OtherTextUpdateInfo = {
    docType: string;
    docKey: string;
    target: string | null;
    updateInfo?: string;
  };

  type SelectMapDrawInfo = {
    sceneLayerKey: string;
    mapDrawKey: string | null;
  };

  type ChatInputtingInfo = {
    actorKey: string;
    flag: boolean;
  };
}

declare module 'task' {
  interface TaskDeclare {
    isIgniteWithParam: boolean;
    isLastValueCapture: boolean;
    isTraceFinally: boolean;
    isTest: boolean;
    statusList: StatusList;
  }

  interface TaskDeclareJson {
    types: string[];
    taskAttribute: TaskDeclare;
  }

  interface TaskInput<T> {
    type: string;
    owner: string;
    to?: string[];
    value: T | null;
  }

  type TaskProcess<T, U> = (
    task: Task<T, U>,
    param: any,
    processorRemover: () => void
  ) => Promise<TaskResult<U>>;

  type TaskListenerContainer = {
    [type in string]: {
      [key in string]: TaskProcess<any, any>[];
    };
  };

  type TaskListenerParameterContainer = {
    [P in string]: any[];
  };

  type StatusList = string[];

  interface Task<T, U> extends TaskDeclare, TaskInput<T> {
    readonly key: string;
    status: string;
    resolve: (resultList?: U[]) => void;
    reject: (reason?: any) => void;
  }

  type TaskResult<U> = {
    nextStatus?: string;
    value?: U;
  };
}

declare module 'context' {
  import { CompareInfo } from 'compare'
  import { Point } from '@/@types/store-data-optional'

  interface ContextTaskInfo extends Point {
    type: string;
    target: string | null;
    pieceKey?: string;
  }

  // 項目(表示条件ありなし)
  type ContextTextItem<T> = {
    text: string;
    isRawText?: boolean;
    taskName?: string;
    isViewCompare?: CompareInfo;
    isDisabledCompare?: CompareInfo;
    taskArg: T;
    argRef?: string;
    children?: ContextItemDeclare[];
  };

  // 区切り線(表示条件あり)
  type ContextHrItem = {
    isViewCompare: CompareInfo;
  };

  type Reference = {
    ref: string;
  };

  type ContextItemDeclareBlock = {
    [type in string]: ContextItemDeclareInfo;
  };

  type ContextItemDeclareInfo = ContextTextItem<any> | ContextHrItem | null;

  type ContextItemDeclare = ContextItemDeclareInfo | Reference;

  type ContextDeclareInfo = ContextItemDeclare[] | Reference;

  type ContextDeclare = {
    [type in string]: ContextDeclareInfo;
  };
}
