import { App } from 'vue'
import battleField from '@/feature/battle-field'
import character from '@/feature/character'
import cutIn from '@/feature/cut-in'
import enigma from '@/feature/enigma'
import localSetting from '@/feature/local-setting'
import memo from '@/feature/memo'
import persona from '@/feature/persona'
import scenario from '@/feature/scenario'
import scene from '@/feature/scene'
import tag from '@/feature/tag'
import userSetting from '@/feature/user-setting'
import { installFeatures } from '@/core'

const Plugin = {
  install(app: App): void {
    const features = [
      battleField,
      character,
      cutIn,
      enigma,
      localSetting,
      memo,
      persona,
      scenario,
      scene,
      tag,
      userSetting
    ]
    installFeatures(app, features)
  }
}

export default Plugin