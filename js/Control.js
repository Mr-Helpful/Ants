let avgT = {
  select:{all:0,grid:0,near:0,seen:0},
  accels:{vecs:0},
  decay:{update:0,draw:0}
}
let times
function updateBoids(ants, T){
  times = {
    select:{all:0,grid:0,near:0,seen:0},
    accels:{vecs:0},
    decay:{update:0,draw:0}
  }
  for(ant of ants){
    update(ant)
  }
  for(ant of ants){
    move(ant, T/1000)
  }
  decay(pheremones)
  if(S.flow.timed) addTimes(times)
}

function addTimes(ts){
  for(j in ts){
    for(i in ts[j]){
      avgT[j][i] *= S.flow.avgOver-1
      avgT[j][i] += ts[j][i]
      avgT[j][i] /= S.flow.avgOver
    }
  }
}

let accels
/** Updates the acceleration for a single boid
  * @param {Object} boid - a single boid object
  * @param {Vector} t - a position to target
  * @return {Object} - the boid with its acceleration updated
  */
function update(ant){
  let t, t0 = performance.now()
  let ps = select(ant, pheremones[ant.state])
  t = performance.now(); times.select.all += t-t0; t0 = t

  // we bind all the common variables to be used in finding an acceleration
  let aAccel = getAcc.bind(this, ant, ps, S.ants.maxV)

  let accels = [
    [scents, S.ants.pWeight],
    [wander, S.ants.wWeight]
  ]
  if(S.ants.edges) accels.push([edges, S.ants.eWeight])
  accels = accels.map(v => aAccel(...v))
  t = performance.now(); times.accels.vecs += t-t0

  ant.a = set(avg(accels), S.ants.maxA)
  return ant
}

/** Gets the acceleration of a single boid from its desired velocity
  * @param {Object} boid - a single boid object
  * @param {Vector} t - a position to target
  * @param {Number} maxV - the maximum velocity the boids can move at
  * @param {Function} f - the function used to determine the boid's desired
  * velocity
  * @param {Number} weight - the weight to assign to the given acceleration
  * @return {Vector} - the acceleration to use
  */
function getAcc(ant, ps, maxV, f, weight){
  let v0 = f(ant, ps)
  let v1 = set(v0, maxV)
  if(v1 == [0, 0]) return v1
  return mul(sub(v1, ant.v), weight)
}

/** Selects all the pheremones that the current ant can "see"
  * @param {Object} ant - a single ant object
  * @param {Array} boids - all other ants
  * @return {Array} - the boids that the current boid can "see"
  */
function select(ant, ps){
  let t, t0 = performance.now()
  let r = Math.ceil(S.ants.vRadius/S.dots.grid)
  let grid = gridSelect(ant, r, ps)
  t = performance.now(); times.select.grid += t-t0; t0 = t

  let seen = grid.filter(p => {
    let o = sub(p.s, ant.s)
    if(!(0 < mag(o) <= S.ants.vRadius)) return false
    return dot(o, ant.v)/(mag(o)*mag(ant.v)) > S.ants.vCosine
  })
  t = performance.now(); times.select.seen += t-t0
  return seen
}

function gridSelect(ant, R, ps){
  let [w, h] = S.dims.map(x => Math.floor(x/S.dots.grid))
  let s = ant.s.map(x => Math.floor(x/S.dots.grid))
  let [l, t] = sub(s, [R, R])
  let [r, b] = add(s, [R, R])
  let matrix = []

  for(let x = Math.max(l, 0); x < Math.min(r, w); x++){
    for(let y = Math.max(t, 0); y < Math.min(b, h); y++){
      matrix.push([x, y])
    }
  }

  return matrix
    .filter(c => {
      let o = sub(c, s)
      if(mag(o) > r) return false
      return dot(o, ant.v)/(mag(o)*mag(ant.v)) > S.ants.vCosine
    })
    .reduce((a, c) => {a.push(...ps[c[1]][c[0]]); return a}, [])
}

function scents(ant, ps){
  return sum(ps.map(p => sub(p, ant.s)))
}

function wander(ant){
  return add(ant.v, random(-S.ants.maxA, S.ants.maxA))
}

function edges(ant){
  let fVec = v => v.map(x => Math.abs(x) > S.ants.vRadius? 0: 1/(x + 0.001))
  let sep = [ant.s, sub(ant.s, S.dims)]
  let vec = sep.map(fVec)
  return add(...vec)
}

function move(ant, T){
  let [w, h] = S.dims.map(v => Math.floor(v/S.dots.grid))
  let [i, j] = mod(ant.s.map(x => Math.floor(x/S.dots.grid)), [w, h])
  let toLay = layOn[ant.state]
  toLay.forEach(l => layScent(pheremones[l][j][i], ant))

  ant.v = add(ant.v, mul(ant.a, T))
  ant.s = add(ant.s, mul(ant.v, T))
  ant.s = mod(ant.s, S.dims)
  ant.draw()
}

function layScent(ps, ant){
  ps.push({s:ant.s, T:S.dots.T/*, draw:newScent(svg, S.dots.T, S.dots.colour, S.dots.R, ant.s)*/})
}

function decay(ps){
  let t, t0 = performance.now()
  for(k in ps){
    ps[k].forEach(m => m.forEach(v => v.forEach(p => {p.T -= 1; /*p.draw()*/})))
    ps[k] = ps[k].map(m => m.map(v => v.filter(p => p.T > 0)))
    t = performance.now(); times.decay.update += t-t0; t0 = t
  }
}
