'use strict'


// export default function interceptors (middlewares) {
//   if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
//   for (const fn of middleware) {
//     if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
//   }
  
//   return function (content, next) {
//     let index = -1

//     function dispatch (i) {
//       let fn = middleware[i]
//       try {
//         return Promise.resolve(fn(content, function next () {
//           return dispatch(i + 1)
//         })
//       } catch (err) {
//         return Promise.reject(err)
//       }
//     }
//     return dispatch(0)
//   }
// }

// interceptors([], async function (ctx, next) {
//   ctx.xxx = 'xx'
//   next()
// })