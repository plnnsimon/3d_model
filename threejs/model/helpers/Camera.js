import * as THREE from 'three'
import { OrbitControls } from 'https://unpkg.com/three@0.148.0/examples/jsm/controls/OrbitControls.js'

export default class Camera {
  constructor(application) {
    this.sizes = application.sizes
    this.scene = application.scene
    this.canvas = application.canvas

    this.cameraZPos = 4

    this.setInstance()
    this.setOrbitControls()
    this.resize()
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(50, this.sizes.aspect, 0.1, 100)
    this.instance.position.x = 0
    this.instance.position.z = 2.5
    this.instance.position.y = 0
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.enableDamping = true
    this.controls.target.set(0, 0, 0)
    this.controls.enabled = true
    // Zoom in / zoom out

    this.controls.minDistance = 0
    this.controls.maxDistance = 20
    // Where to stop rotation :

    this.controls.minPolarAngle = 0 // radians
    this.controls.maxPolarAngle = Math.PI
  }

  resize() {
    this.instance.aspect = this.sizes.aspect
    this.instance.updateProjectionMatrix()
  }

  update() {
    if (this.controls && this.controls.update) this.controls.update()
  }
}
