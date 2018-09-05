const MHttp = require('../dest').default

const http = new MHttp()

http.request.use(function (options, next) {
  console.log(1)
  console.log(options)
  next()
}).use(function (options, next) {
  console.log(2)
  next()
})


http.response.use(function (res, next) {
  console.log(3)
  next()
}).use(function (res, next) {
  try {
    res.data = JSON.parse(res.body.toString())
  } catch (err) {
    res.data = null
    // ro
    // throw err
  }
  console.log(4)
  next()
})


// GET
http.post('http://localhost:3000/api/post', {
  params: {
    keyword: 'test',
    isTrue: true
  },
  body: {
    username: 'root',
    password: '123456',
    sex: 1,
    bool: true,
    zh: '中文'
  }
}).then(res => {
  console.log(res.data)
}).catch(err => {
  console.log('err:', err)
})
