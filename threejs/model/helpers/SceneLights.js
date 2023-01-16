import * as THREE from 'three'

export default class SceneLights {
  constructor(application) {
    this.scene = application.scene
    this.lightsList = []

    this.initializeLights()
  }

  getDirectionalLights(options = {}) {
    const pos = options.position || {
      x: 0,
      y: 0,
      z: 0,
    }
    const light = new THREE.DirectionalLight(0xffffff)
    light.intensity = 2
    light.castShadow = true
    light.shadow.bias = -0.009
    light.shadow.mapSize.set(512, 512)
    light.shadow.camera.far = 10
    light.shadow.camera.near = 0
    light.shadow.camera.top = 10
    light.shadow.camera.right = 10
    light.shadow.camera.left = -10
    light.shadow.camera.bottom = -10
    light.position.set(pos.x, pos.y, pos.z)
    light.lookAt(0, 0, 0)
    return light
  }

  initializeLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    this.scene.add(ambientLight)

    const directionLight = this.getDirectionalLights({
      position: { x: 2, y: 2.5, z: -1 },
    })
    // const helper1 = new THREE.DirectionalLightHelper(directionLight, 1)

    this.scene.add(directionLight)
    // this.scene.add(helper1)
    this.lightsList.push({
      name: 'spot1',
      lightObj: directionLight,
    })
  }
}
