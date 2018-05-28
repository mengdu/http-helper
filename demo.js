const http = require('http')
const url = require('url')

const req = http.request({}, res => {

  var chunks = []

  res.setEncoding('utf8')

  res.on('data', function (chunk) {
    chunks.push(chunk)
    console.log(arguments)
  })
  res.on('end', function () {
    console.log('data:', chunks.join())
  })
})

req.on('error', (e) => {
  console.error(`请求遇到问题: ${e.message}`)
})

req.end()
