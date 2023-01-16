import Model from '../threejs/model/index.js'


const model = new Model()

const container = document.getElementById('canvasContainer')
const canvas = document.getElementById('model')

async function init() {
  await model.build(canvas, container)

  model.mount()
}

init()