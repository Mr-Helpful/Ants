function nArr(){
  if(arguments == []) return 0
  let arr = new Array(arguments[0]).fill(0)
  let nArgs = Array.prototype.slice.call(arguments, 1)
  return arr.map(_ => nArr(...nArgs))
}

function updateMouseVals(e){
  mouseX = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft)
  mouseY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop)
  d.mousePos = [mouseX, mouseY]
}

function unFocus(e){
  d.mousePos = null
}

function addLetterToWord(e){
  if(e.keyCode === 13){
    drawWords(d.letters)
    d.letters = ""
  }
  else{
    let inp = String.fromCharCode(e.keyCode)
    if (/[a-zA-Z0-9-_ .]/.test(inp)){
      d.letters += inp
    }
  }
}

let d = {}
d.mousePos = null
d.letters = ""
d.wordPoints = []

function setupSvg(name){
  let svg = document.getElementById(name)
  let w = document.body.clientWidth
  let h = document.body.clientHeight
  return [svg, w, h]
}

function nAnt(svg, S){
  let w = S.dims[0]
  let h = S.dims[1]
  let s = S.ants.minV
  let e = S.ants.maxV
  return {
    s: [500, 500],
    v: random(s, e),
    draw: newAnt(svg, S.ants.colour),
    state: "food"
  }
}

let pheremones = {
  nest: [],
  food: []
}
function setupScents(ps, w, h){
  let i = Math.floor(w/S.dots.grid)
  let j = Math.floor(h/S.dots.grid)
  for(k in ps){
    ps[k] = nArr(j, i, 0)
  }
}

let layOn = {
  nest: ["food"],
  food: ["nest", "food"]
}

let Ants, svg
function init(){
  let [s, w, h] = setupSvg("BoidGround"); svg = s
  setupScents(pheremones, w, h)

  S.dims = [w, h]

  svg.onmousemove = updateMouseVals
  svg.onmouseout = unFocus
  document.onkeydown = addLetterToWord

  Ants = new Array(S.ants.N).fill(0)
  Ants = Ants.map(function(){return nAnt(svg, S)})

  step(Ants)
}

function step(Ants){
  updateBoids(Ants, 60)
  if(!S.flow.paused) window.requestAnimationFrame(function(){
    step(Ants)
  })
}
