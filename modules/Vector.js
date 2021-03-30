/*
 * A test module to be used as an example of layout
 */

(function(global){
  function clamp(s, e, v){return Math.max(s, Math.min(e, v))}
  function rFlip(v){return (Math.random()>0.5?v:-v)}
  function rand(s, e){return s + Math.random()*(e-s)}
  function nAdd(x, y){
    if(isNaN(x)) return y
    if(isNaN(y)) return x
    return x+y
  }
  function modV(x, c){
    while(x < 0) x += c
    return x % c
  }

  /* add: v1 + v2
   * sub: v1 - v2
   * dot: v1 • v2
   * mul: cv
   * mag: |v|
   * set: v s.t. |v| = c
   * one: v s.t. |v| = 1
   * lim: v s.t. s <= |v| <= e
   * sum: sum of vs
   * avg: mean of vs
   * random: [x, y] s.t. s < x,y < e
   */
  global.add = (v1, v2)  => [nAdd(v1[0], v2[0]), nAdd(v1[1], v2[1])]
  global.sub = (v1, v2)  => [v1[0]-v2[0], v1[1]-v2[1]]
  global.dot = (v1, v2)  => v1[0]*v2[0] + v1[1]*v2[1]
  global.mul = (v, c)    => [v[0]*c, v[1]*c]
  global.div = (v, c)    => mul(v, 1/c)
  global.mod = (v1, v2)  => [modV(v1[0], v2[0]), modV(v1[1], v2[1])]
  global.mag =  v        => Math.sqrt(v[0]*v[0] + v[1]*v[1])
  global.one =  v        => div(v, mag(v))
  global.set = (v, c)    => mul(one(v), c)
  global.lim = (v, s, e) => set(v, clamp(s, e, mag(v)))
  global.sum =  vs       => vs.reduce(add, [0, 0])
  global.avg =  vs       => div(sum(vs), vs.length)
  global.random = (s, e) => {
    let x = rFlip(rand(0, 1))
    let y = rFlip(Math.sqrt(1 - x*x))
    return set([x, y], rand(s, e))
  }
})(this)
