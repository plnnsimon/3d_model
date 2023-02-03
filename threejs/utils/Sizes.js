export default class Sizes {
  constructor(canvasContainer) {
    this.width = canvasContainer.offsetWidth
    this.height = canvasContainer.offsetHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)
    this.aspect = this.width / this.height

    window.addEventListener('resize', () => {
      this.width = canvasContainer.offsetWidth
      this.height = canvasContainer.offsetHeight
      this.pixelRatio = Math.min(window.devicePixelRatio, 2)
      this.aspect = this.width / this.height
    })
  }
}
