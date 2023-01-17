import { GLTFLoader } from 'https://unpkg.com/three@0.148.0/examples/jsm/loaders/GLTFLoader.js'
import { LoadingManager } from 'three'
import { DRACOLoader } from 'https://unpkg.com/three@0.148.0/examples/jsm/loaders/DRACOLoader.js'

// const manager = new LoadingManager();
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/dist/draco/')
dracoLoader.setDecoderConfig({ type: 'js' })

export default class ModelLoader {
  constructor(url, application) {
    this.loadedModel = null
    this.url = url
    this.application = application
  }

  async initGLTFLoader() {
    const loadingManager = new LoadingManager(
      () => {
        if (!this.application) return
        // this.application.eventEmitter.notify('setLoadingFinished')
        console.log('LOADED')
      },

      // progress
      (item, loaded, total) => {
        if (!this.application) return
        const progress = loaded / total
        console.log(progress * 100, ' progress');
        // this.application.eventEmitter.notify('setProgress', progress)
      }
    )
    const loader = new GLTFLoader(loadingManager)
    loader.setDRACOLoader(dracoLoader)
    let obj
    try {
      obj = await loader.loadAsync(this.url)
    } catch (e) {
      console.error(e.message)
    }
    console.log(obj, ' OBJ')
    return obj
  }
}
