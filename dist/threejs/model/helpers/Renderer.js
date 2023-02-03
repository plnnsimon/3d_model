/* eslint-disable dot-notation */
import * as THREE from 'three'
import { RGBELoader } from 'https://unpkg.com/three@0.148.0/examples/jsm/loaders/RGBELoader'
// import { Clock } from 'three'

// postprocessing
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
// // import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

// // shaders
// import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
// import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'
// import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
// import { ColorifyShader } from 'three/examples/jsm/shaders/ColorifyShader.js'

export default class Renderer {
  constructor(application) {
    this.canvas = application.canvas
    this.sizes = application.sizes
    this.scene = application.scene
    this.camera = application.camera
    this.raycaster = application.raycaster
    this.pointer = application.pointer

    this.setRenderer()

    // this.setPostprocessing()

    // window.addEventListener('pointermove', (e) => this.onPointerMove(e))
  }

  setRenderer() {
    this.instance = new THREE.WebGLRenderer({
      alpha: true,
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
    })
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap
    this.instance.shadowMap.enabled = true
    this.instance.shadowMap.autoUpdate = false
    this.instance.shadowMap.needsUpdate = true
    this.instance.toneMapping = THREE.ACESFilmicToneMapping
    this.instance.toneMappingExposure = 0.8
    this.instance.autoClear = false
    this.instance.setClearColor(0xffffff, 1)
    this.instance.physicallyCorrectLights = true

    this.instance.outputEncoding = THREE.sRGBEncoding

    const generator = new THREE.PMREMGenerator(this.instance)
    new RGBELoader().load(
      '/dist/threejs/sources/environment/planet-lava-env-map.hdr',
      (hdrmap) => {
        // ...
        const envmap = generator.fromEquirectangular(hdrmap)
        this.scene.environment = envmap.texture
        this.scene.environment.encoding = THREE.sRGBEncoding
      }
    )
  }

  // setPostprocessing() {
  //   const renderTargetParameters = {
  //     minFilter: THREE.LinearFilter,
  //     magFilter: THREE.LinearFilter,
  //     format: THREE.RGBAFormat,
  //     encoding: THREE.sRGBEncoding,
  //   }

  //   const renderTarget = new THREE.WebGLRenderTarget(
  //     800,
  //     600,
  //     renderTargetParameters
  //   )

  //   // Render pass
  //   const renderPass = new RenderPass(this.scene, this.camera.instance)
  //   renderPass.renderToScreen = false

  //   this.composer = new EffectComposer(this.instance, renderTarget)
  //   this.composer.setPixelRatio(this.sizes.pixelRatio)
  //   this.composer.setSize(this.sizes.width, this.sizes.height)

  //   // Gamma correction pass
  //   const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)

  //   const pixelRatio = this.instance.getPixelRatio()

  //   // FXAAPass
  //   const fxaaPass = new ShaderPass(FXAAShader)
  //   fxaaPass.material.uniforms['resolution'].value.x =
  //     1 / (this.sizes.width * pixelRatio)
  //   fxaaPass.material.uniforms['resolution'].value.y =
  //     1 / (this.sizes.height * pixelRatio)
  //   fxaaPass.enabled = true
  //   fxaaPass.renderToScreen = false

  //   // RGBShift shader
  //   const rgbShiftPass = new ShaderPass(RGBShiftShader)
  //   rgbShiftPass.uniforms['amount'].value = 0.0015
  //   rgbShiftPass.renderToScreen = false

  //   // Colorify Shader
  //   const effectColorify = new ShaderPass(ColorifyShader)
  //   effectColorify.uniforms['color'] = new THREE.Uniform(
  //     new THREE.Color(0.6, 0.3, 0.8)
  //   )

  //   this.composer.addPass(renderPass)
  //   this.composer.addPass(gammaCorrectionPass)
  //   this.composer.addPass(fxaaPass)
  // }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
    // this.composer.setSize(this.sizes.width, this.sizes.height)
    // this.composer.setPixelRatio(this.sizes.pixelRatio)
  }

  update() {
    // const time = new Clock().getDelta()
    // this.composer.render(time)
    this.instance.render(this.scene, this.camera.instance)
  }

  onPointerMove(event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
  }
}
