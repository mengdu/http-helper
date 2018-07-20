const MHttp = require('./dest').default
const FormData = require('./dest/form-data').default
const File = require('./dest/file').default

const http = new MHttp()

// http.request.use(function (options, next) {
//   console.log(1)
//   console.log(options)
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

// http.post('http://localhost:3000/api/all?callback=test', {
//   params: {
//     page: 1,
//     pageSize: 12,
//     zh: '中文'
//   },
//   body: {
//     username: 'admin',
//     password: '123456',
//     zh: '中文'
//   }
// }).then(res => {
//   console.log(res.body.toString())
// }).catch(err => {
//   console.log(err.message)
// })

// --------------http-helper-----------

http.on('start', options => {
  console.log('start:\n', options)
})

http.on('upload', (item) => {
  console.log('upload:\n', item)
})

// application/x-www-form-urlencoded
http.post('http://localhost:3000/api/all', {
  params: {
    page: 1,
    pageSize: 12,
    zh: '中文'
  },
  body: {
    username: 'admin',
    password: '123456'
  }
}).then(res => {
  console.log('response:', res.body.toString())
}).catch(err => {
  console.log('response err:', err)
})


// multipart/form-data
const form = new FormData()

form.append('key', 'value')
form.append('username', 'admin')
form.append('password', '123456')
form.append('userId', 1001)
form.append('zh', '中文')
// form.append('data', JSON.stringify({name: 'admin', info: 'this is a test.', zh: '中文'}))
form.append('text', new File({name: 'text.txt', buffer: Buffer.from('this is a test\r\n这是一个测试。')}))
form.append('zip', new File({filePath: 'D:/Software/mysql-5.6.40-winx64.zip'}))

console.log(form)

http.post('http://localhost:3000/api/file', {
  body: form
}).then(res => {
  console.log('response:', res.body.toString())
}).catch(err => {
  console.log('response err:', err)
})
