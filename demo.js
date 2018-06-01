const HttpHepler = require('./dest').default
const http = new HttpHepler()

// http.request.use(function (options, next) {
//   console.log(1)
//   next()
// })
// .use(function (options, next) {
//   console.log(2)
//   next()
// })


// http.response.use(function (res, next) {
//   console.log(3)
//   next()
// })
// .use(function (res, next) {
//   console.log(4)
//   next()
// })


// http.fetch({
//   url: 'http://localhost:3000/api/put',
//   params: {
//     userId: 1001
//   },
//   method: 'put',
//   headers: {
//     Authorization: '62a0db74ddb370b96548aed1a3ab8852'
//   },
//   body: {
//     username: 'admin',
//     password: '123456'
//   }
// }).then(res => {
//   console.log(res.headers)
//   console.log('end', res.body.toString())
// }).catch(err => {
//   console.log(err)
// })

http.post('http://localhost:3000/api/all?callback=test', {
  params: {
    page: 1,
    pageSize: 12,
    zh: '中文'
  },
  body: {
    username: 'admin',
    password: '123456',
    zh: '中文'
  }
}).then(res => {
  console.log(res.body.toString())
})
