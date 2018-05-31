import httpHelper from './node-http-helper'

const http = new httpHelper()

http.request.use(function (options, next) {
  console.log(1, options)
  next()
})
.use(function (options, next) {
  console.log(2, options)
  next()
})


http.response.use(function (res, next) {
  console.log(3, res)
  next()
})
.use(function (res, next) {
  console.log(4, res)
  next()
})


http.fetch({
  url: 'http://blog.lanyueos.com'
}).then(res => {
  console.log('end', res)
})
