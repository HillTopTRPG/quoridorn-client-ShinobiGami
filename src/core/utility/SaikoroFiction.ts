import { convertNumberZero } from '@/core/utility/PrimaryDataUtility'
import { SkillTable } from '@/core/utility/shinobigami'

export type TokugiInfo = {
  name: string;
  row: number;
  column: number;
};

export type SaikoroFictionTokugi = {
  learnedList: TokugiInfo[];
  damagedList: TokugiInfo[];
  damagedColList: number[];
  spaceList: number[];
  outRow: boolean;
  isUseColDamage: boolean;
  isUseSingleDamage: boolean;
  isOutputSingleDamage: boolean;
};

export type Personality = {
  emotion: string; // 感情
  name: string; // 人物名
  place: boolean; // 居所
  secret: boolean; // 秘密
  specialEffect: boolean; // 奥義
};

const emotionList: string[][] = [
  ['なし', 'なし'],
  ['1+:共感', '1-:不信'],
  ['2+:友情', '2-:怒り'],
  ['3+:愛情', '3-:妬み'],
  ['4+:忠誠', '4-:侮蔑'],
  ['5+:憧憬', '5-:劣等感'],
  ['black-6+:狂信', 'black-6-:殺意']
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export function createEmotion(json: any): Personality[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (json.personalities as any[]).map(p => ({
    emotion:
      emotionList[convertNumberZero(p.emotion)][
        convertNumberZero(p.direction) - 1
      ],
    name: p.name || '',
    place: p.place !== null,
    secret: p.secret !== null,
    specialEffect: p.specialEffect !== null
  }))
}

function outputTable<T>(
  data: T,
  props: {
    label: string;
    prop: keyof T | null;
  }[],
  ind: number,
  convertFunc?: (
    prop: { label: string; prop: keyof T | null },
    value: T[keyof T] | null,
    data: T,
    ind: number
  ) => string | null
): string {
  return `|${props
    .map(p => {
      const v = p.prop ? data[p.prop] : null
      if (convertFunc) {
        const convertResult = convertFunc(p, v, data, ind)
        if (convertResult !== null) return nlFormat(convertResult)
      }
      if (typeof v === 'boolean') return `${v ? '[x]' : '[ ]'}`
      return nlFormat(v)
    })
    .join('|')}|`
}

export function outputTableList<T>(
  dataList: T[],
  props: {
    label: string;
    prop: keyof T | null;
    align: 'left' | 'center' | 'right';
  }[],
  convertFunc?: (
    prop: { label: string; prop: keyof T | null },
    value: T[keyof T] | null,
    data: T,
    ind: number
  ) => string | null
): string[] {
  const strList: string[] = []
  strList.push(`|${props.map(p => p.label).join('|')}|`)
  strList.push(
    `|${props
      .map(
        p =>
          `${p.align === 'right' ? '' : ':'}---${p.align === 'left' ? '' : ':'}`
      )
      .join('|')}|`
  )
  strList.push(
    ...dataList.map((d, ind) =>
      outputTable<T>(
        d,
        props.map(p => ({ label: p.label, prop: p.prop })),
        ind,
        convertFunc
      )
    )
  )
  return strList
}

export function outputPersonalityList(
  personalityList: Personality[],
  props: {
    prop: keyof Personality;
    label: string;
    align: 'left' | 'center' | 'right';
  }[]
): string[] {
  return outputTableList(personalityList, props, (prop, value) => {
    if (prop.prop === 'emotion') {
      return `{感情}[${emotionList
        .flatMap((l, ind) => (ind ? l : [l[0]]))
        .join('|')}](${value})`
    }
    return null
  })
}

export function outputTokugiChatPalette(tokugi: SaikoroFictionTokugi): string[] {
  return tokugi.learnedList.map(
    t => `2D6>=5 《${SkillTable[t.row][t.column]}》`
  )
}

export function createTokugi(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  json: any,
  table: string[][],
  isUseColDamage: boolean,
  isUseSingleDamage: boolean,
  isOutputSingleDamage: boolean
): SaikoroFictionTokugi {
  const outRow = Boolean(json.skills.outRow)
  const tokugi: SaikoroFictionTokugi = {
    learnedList: [],
    damagedList: [],
    damagedColList: [],
    spaceList: [],
    outRow,
    isUseColDamage,
    isUseSingleDamage,
    isOutputSingleDamage
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (json.learned as any[])
    .filter(t => t.id)
    .forEach(t => {
      const id = t.id

      const row = parseInt(id.match(/row([0-9]+)/)[1])
      const column = parseInt(id.match(/name([0-9]+)/)[1])
      const name = SkillTable[row][column]

      tokugi.learnedList.push({ column, row, name })
    })

  for (let i = 0; i < 6; i++) {
    if (json.skills[String.fromCharCode('a'.charCodeAt(0) + i)] !== null) {
      let sp = i + 1
      if (sp === 6) sp = 0
      tokugi.spaceList.push(sp)
    }
    if (
      json.skills.damage &&
      json.skills.damage[`check${i}`] !== null
    ) {
      tokugi.damagedColList.push(i)
    }
    for (let j = 0; j < 11; j++) {
      if (json.skills[`row${j}`][`check${i}`] !== null) {
        tokugi.damagedList.push({
          column: i,
          row: j,
          name: SkillTable[j][i]
        })
      }
    }
  }
  return tokugi
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export function nlFormat(text: any): string {
  if (text === null || text === undefined) return ''
  return text
    .toString()
    .replaceAll(/。\r?\n?/g, '。<br>')
    .replaceAll(/\r?\n/g, '<br>')
}

function mergeList<T>(
  list1: T[],
  list2: T[],
  keyProp: keyof T,
  mergePropList: (keyof T)[],
  originalRecover = true
): void {
  list2.forEach(i2 => {
    (Object.keys(i2) as (keyof T)[]).forEach(k => {
      const val = i2[k]
      if (typeof val === 'string') {
        if (keyProp === k) {
          i2[k] = (val.replaceAll('<br>', '') as unknown) as T[keyof T]
        } else {
          i2[k] = (val
            .replaceAll('。<br>', '。')
            .replaceAll('<br>', '\n') as unknown) as T[keyof T]
        }
      }
    })
  })
  list1.forEach(i1 => {
    const i2 = list2.find(i2 => i2[keyProp] === i1[keyProp])
    if (i2) {
      mergePropList.forEach(mk => {
        i1[mk] = i2[mk]
      })
    }
  })
  if (originalRecover) {
    list1.push(
      ...list2.filter(i2 => !list1.some(i1 => i1[keyProp] === i2[keyProp]))
    )
  }
}

// export function duplicateNameRename<T, K extends keyof T>(
//   list: T[],
//   nameProp: K
// ) {
//   const nameMap: Map<string, number[]> = new Map<string, number[]>()
//   list.forEach((item, idx) => {
//     const name = String(item[nameProp])
//     if (!nameMap.has(name)) nameMap.set(name, [])
//     const idxList = nameMap.get(name)!
//     idxList.push(idx)
//   })
//   list.forEach((item, idx) => {
//     const name = String(item[nameProp])
//     const idxList = nameMap.get(name)!
//     if (idxList.length === 1) return
//     item[nameProp] = ((name +
//       (idxList.findIndex(i => i === idx) + 1)) as unknown) as T[K]
//   })
// }

// export function updateData(data: unknown, updateInfo: string | undefined): void {
//   if (!updateInfo) return
//   let obj: any = data
//   const mr = updateInfo.match(/(.+)=(.+)/)
//   if (mr) {
//     const propStr = mr[1]
//     const value = mr[2]
//     propStr.split('.').forEach((s, idx, self) => {
//       if (obj === null || obj === undefined) return
//       let propName = s
//       let filterProp: string | null = null
//       let filterValue: string | null = null
//       const mr = s.match(/^(.+?)(?:{(.+?):(.+?)})?$/)
//       if (mr) {
//         propName = mr[1]
//         filterProp = mr[2]
//         filterValue = mr[3]
//       }
//       if (idx < self.length - 1) {
//         obj = obj[propName]
//         if (obj === null || obj === undefined) return
//         if (Array.isArray(obj) && filterProp && filterValue) {
//           obj = obj.find(item => item[filterProp!] === filterValue)
//         }
//       } else {
//         if (obj[propName] === null || obj[propName] === undefined) return
//         switch (typeof obj[propName]) {
//           case 'string':
//             obj[propName] = value
//             break
//           case 'number':
//             obj[propName] = convertNumberZero(value)
//             break
//           case 'boolean':
//             obj[propName] = value && value.toLowerCase() === 'true'
//             break
//           default:
//         }
//       }
//     })
//   }
// }

// export function makeSelectStr(
//   label: string,
//   value: any,
//   payload: {
//     // start
//     s?: number;
//     // end
//     e?: number;
//     // before
//     b?: string[];
//     // after
//     a?: string[];
//     // isHoseiNul
//     h?: boolean;
//   }
// ): string {
//   const selection: string[] = []
//   if (payload.b) selection.push(...payload.b)
//   if (payload.s !== undefined && payload.e !== undefined) {
//     if (payload.s < payload.e) {
//       for (let i = payload.s; i <= payload.e; i++) { selection.push(payload.h ? hoseiStr(i) : i.toString(10)) }
//     } else {
//       for (let j = payload.s; j >= payload.e; j--) { selection.push(payload.h ? hoseiStr(j) : j.toString(10)) }
//     }
//   }
//   let valueStr = value !== null && value !== undefined ? value.toString() : ''
//   if (payload.h && valueStr) {
//     const numVal = convertNumberNull(valueStr)
//     if (numVal !== null) valueStr = hoseiStr(numVal)
//   }
//   if (payload.a) selection.push(...payload.a)
//   return `{${label}}[${selection.join('|')}](${valueStr})`
// }

export const regStr = {
  button: '@@@(?:.+?):(?:(?!@@@).+?)@@@',
  check: '\\[([ x])]',
  select: '{([^}]+?)}\\[.*?]\\((.*?)\\)',
  text: '(.*?)',
  makeSelect: (label: string): string => `{${label}}\\[.*?]\\((.*?)\\)`
}

type FilterKeys<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never;
}[keyof T];

export function readMultiLine<T>(
  list: T[],
  text: string,
  regExpStr: string,
  keyProp: FilterKeys<T, string>,
  keyPropMatchIndex: number,
  copyProp: { [k: number]: [keyof T, 'b' | 'n' | 's'] },
  originalRecover = true
): void {
  const findList: T[] = Array.from(
    text.matchAll(new RegExp(`^\\|${regExpStr}\\|$`, 'gm'))
  ).map((r) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: any = {}

    obj[keyProp] = r[keyPropMatchIndex];
    ((Object.keys(copyProp) as unknown) as number[]).forEach(t => {
      obj[copyProp[t][0]] =
        copyProp[t][1] === 'b'
          ? r[t] === 'x'
          : copyProp[t][1] === 'n'
            ? convertNumberZero(r[t])
            : r[t]
    })
    return obj as T
  })
  mergeList(
    list,
    findList,
    keyProp,
    Object.values(copyProp).map(p => p[0]),
    originalRecover
  )
}

// type FilterArrayKeys<T, U> = {
//   [P in keyof T]: T[P] extends Array<U> ? P : never;
// }[keyof T];
