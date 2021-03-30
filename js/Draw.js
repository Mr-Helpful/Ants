/*
 * A test module to be used as an example of layout
 */

(function(global){
  let id = 0
  function matrix(s, v){
    let nv = mul(v, 1/mag(v))
    return `matrix(${nv[0]}, ${nv[1]}, ${-nv[1]}, ${nv[0]}, ${s[0]}, ${s[1]})`
  }
  function toRgba(hex, a){

  }

  global.newAnt = function(svg, c){
    let ant = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
    ant.setAttribute("points", "5,0,-3,-4,0,0,-3,4")
    ant.setAttribute("stroke", c)
    ant.setAttribute("fill", "none")
    svg.appendChild(ant)

    return function(){
      let m = matrix(this.s, this.v)
      ant.setAttribute("transform", m)
    }
  }

  global.newScent = function(svg, v, c, r, s){
    let scent = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    scent.setAttribute("r", r)
    scent.setAttribute("cx", s[0])
    scent.setAttribute("cy", s[1])
    scent.setAttribute("fill", c)
    scent.setAttribute("opacity", 0.2)
    svg.appendChild(scent)

    return function(){
      if(this.T > 0){
        scent.setAttribute("opacity", this.T/v*0.2)
      }
      else {
        scent.remove()
      }
    }
  }
})(this)
