import * as common from '@/types/common.d'

export function uiSize2css(size: common.UiSize): string {
  const sizeCalc = [
    size.em ? `${size.em}em` : '',
    size.rem ? `${size.rem}rem` : '',
    size.px ? `${size.px}px` : '',
    size.vw ? `${size.vw}vw` : '',
    size.vh ? `${size.vh}vh` : '',
    size.vmax ? `${size.vmax}vmax` : '',
    size.vmin ? `${size.vmin}vmin` : '',
    size.percent ? `${size.percent}%` : ''
  ].filter(s => Boolean(s)).join(' + ')
  return `calc(${sizeCalc})`
}
