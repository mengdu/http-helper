'use strict'
/**
* 中间件执行器
* e.g. interceptors(obj.middlewares)(ctx, fn)
* @param {Array} middlewares 中间件数组
* @return {Function}
**/
export default function interceptors (middlewares) {
  if (!Array.isArray(middlewares)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middlewares) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }
  
  return function (content, next) {
    let index = -1
    function dispatch (i) {
      if (i <= index) throw new Error('next() called multiple times')
      index = i
      if (i >= middlewares.length) {
        return next(content)
      }
      let fn = middlewares[i]

      fn(content, function () {
        dispatch(i + 1)
      })
    }
    dispatch(0)
  }
}
