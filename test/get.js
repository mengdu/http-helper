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
http.get('http://localhost:3000/api', {
  params: {
    keyword: 'test'
  }
}).then(res => {
  // console.log(res.constructor)
  console.log(res.data)
}).catch(err => {
  console.log('err:', err)
})

http.get('https://api.github.com', {
  headers: {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Test-App'
  }
}).then(res => {
  console.log(res.data)
})
