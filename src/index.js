import httpHelper from './node-http-helper'

const http = new httpHelper()

// console.log(http)

http.request({
  url: 'http://www.baidu.com',
}, (err, res) => {
  if (err) {
    throw err
  }
  console.log(res)
  console.log(res.toString())
})


function sss () {
  return new Promise((resolve, reject) => {
    resolve({})
  })
}

async function test () {
  await sss()
}

// import compose from './compose'

// let test = {
//   middlewares: [],
//   use (fn) {
//     this.middlewares.push(fn)
//   }
// }

// test.use(async (ctx, next) => {
//   console.log('1', ctx)
//   let res
//   try {
//     res = await next()
//   } catch (err) {
//     console.log('error：', err)
//   }

//   console.log('3', res)
// })

// test.use(async (ctx, next) => {
//   console.log('4', ctx)
//   // throw new Error('has error')
//   let res = await next()
//   console.log('6', res)
//   return res
// })

// compose(test.middlewares)({method: 'GET'}, async function (ctx, next) {
//   console.log('start1', ctx)

//   await next()
//   console.log('start2', ctx)

//   return {data: []}
// })
