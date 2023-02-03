// import * as THREE from 'three'
import * as THREE from 'three';
import { Clock } from 'https://unpkg.com/three@0.148.0/src/core/Clock.js';
// import TWEEN from '@tweenjs/tween.js'

// import Sizes from '../../utils/Sizes.js'
import Sizes from '../utils/Sizes.js';
// import AnnotationMaker from '../../utils/AnnotationMaker.js'
import ThreejsApplication from '../ThreejsApplication.js';
import ModelLoader from '../utils/GLTFLoader.js';

import SceneLights from './helpers/SceneLights.js';
import Camera from './helpers/Camera.js';
import Renderer from './helpers/Renderer.js';

export default class Model extends ThreejsApplication {
  constructor(eventEmitter) {
    super();

    this.canvas = null;
    this.canvasDomElement = null;
    this.model = null;
    this.eventEmitter = eventEmitter;

    this.camera = null;
    this.annotation = null;
    this.scene = new THREE.Scene();
    this.renderer = null;
    this.sizes = null;
    this.mixer = null;
    this.sceneLights = null;
    this.time = new Clock();

    this.loadingManager = new THREE.LoadingManager();
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
  }

  async build(canvas, canvasDomElement) {
    this.canvas = canvas;
    this.canvasDomElement = canvasDomElement;
    this.sizes = new Sizes(canvasDomElement);

    this.camera = new Camera(this);
    this.renderer = new Renderer(this);
    this.sceneLights = new SceneLights(this);

    // resize event
    this.resize();
    // this.sizes.subscribe('resize', () => {
    //   this.resize()
    // })
    this.resizeContainer(canvasDomElement);

    await this.initGLTFLoader();
  }

  animateFrame() {
    this.animate();
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  animate() {
    const delta = this.time.getDelta()
    
    if (this.camera && this.renderer) {
      this.camera.update(delta);
      this.renderer.update(delta);
    }

    if (this.mixer) {
      this.mixer.update(delta);
    }
  }

  async initGLTFLoader() {
    const loader = new ModelLoader('./threejs/sources/girl_test.glb', this);
    const model = await loader.initGLTFLoader();

    model.scene.traverse((el) => {
      if (el.material) {
        el.material.emissiveIntensity = 30
        el.material.needUpdate = true
      }
    })

    const clips = model.animations;
    this.mixer = new THREE.AnimationMixer(model.scene);

    const clip = THREE.AnimationClip.findByName(clips, "All Animations");
    this.mixer.clipAction(clip).setLoop(THREE.LoopRepeat);

    const action = this.mixer.clipAction(clip);
    action.play();

    // model.scene.scale.set(550, 550, 550);

    this.scene.add(model.scene);
    this.scene.position.set(0, -1.5, 0);
    this.scene.scale.set(1.2, 1.2, 1.2);
  }

  resizeContainer(canvasContainer) {
    this.width = canvasContainer.offsetWidth;
    this.height = canvasContainer.offsetHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.aspect = this.width / this.height;

    window.addEventListener('resize', () => {
      this.width = canvasContainer.offsetWidth;
      this.height = canvasContainer.offsetHeight;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);
      this.aspect = this.width / this.height;
    });
  }

  dispose() {
    this.clearAnnotations();

    if (!this.renderer) return;
    this.renderer.instance.dispose();
    THREE.Cache.remove();

    this.sizes.unsubscribe('resize', () => {
      this.resize();
    });
  }
}
