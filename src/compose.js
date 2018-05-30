/**
* 洋葱模型
* @param {Array} middleware array
* @return {Promise}
**/
export default function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }
  /**
  * @param {Object} context
  * @param {Function} next
  * @return {Promise}
  **/
  return function (context, next) {
    // last called middleware #
    let index = -1

    function dispatch (i) {
      // 多次调用next()
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      // 中间件遍历完
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, function next () {
          // 调用下一个中间件
          return dispatch(i + 1)
        }))
      } catch (err) {
        return Promise.reject(err)
      }
    }
    // 从第一个中间件开始
    return dispatch(0)
  }
}