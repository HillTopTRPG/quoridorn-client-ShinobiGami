import { reactive } from 'vue'
import { commonStoreDataProcess, makeStore, StoreUpdateProperties } from '@/core/utility/vue3'
import { extname, StoreData } from '@/core/utility/FileUtility'

type UrlType = 'youtube' | 'image' | 'music' | 'setting' | 'unknown'

type IconClass =
  | 'icon-warning'
  | 'icon-youtube2'
  | 'icon-image'
  | 'icon-music'
  | 'icon-text'

export function getUrlTypes (url: string): { urlType: UrlType; iconClass: IconClass } {
  if (url.match(/^https?:\/\/www.youtube.com\/watch\?v=/)) {
    return { urlType: 'youtube', iconClass: 'icon-youtube2' }
  } else {
    const ext = extname(url)
    switch (ext) {
      case 'png':
      case 'gif':
      case 'jpg':
      case 'jpeg':
        return { urlType: 'image', iconClass: 'icon-image' }
      case 'mp3':
      case 'wav':
      case 'wave':
        return { urlType: 'music', iconClass: 'icon-music' }
      case 'json':
      case 'yaml':
        return { urlType: 'setting', iconClass: 'icon-text' }
      default:
        return { urlType: 'unknown', iconClass: 'icon-warning' }
    }
  }
}

export type MediaStore = {
  url: string;
  urlType: UrlType;
  iconClass: IconClass;
  name: string;
  rawPath: string;
  tag: string;
  dataLocation: 'server' | 'direct';
};

type Store = {
  ready: boolean,
  list: StoreData<MediaStore>[];
  requestData: () => Promise<void>;
}

export default makeStore<Store>('media-list-store', () => {
  const state = reactive<StoreUpdateProperties<Store, never>>({
    ready: false,
    list: []
  })

  const { requestData } = commonStoreDataProcess(
    state.list,
    'media-list',
    [
      'tag'
    ]
  )

  const setup = async (): Promise<void> => {
    await requestData()
    state.ready = true
  }
  setup().then()

  return {
    get ready() {
      return state.ready
    },
    get list() {
      return state.list
    },
    requestData
  }
})
