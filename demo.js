const http = require('http')
const https = require('https')
const url = require('url')

// const req = http.request({
//   protocol: 'http:',
//   hostname: 'www.baidu.com',
//   agent: false
// }, res => {

//   var chunks = []

//   res.setEncoding('utf8')

//   res.on('data', function (chunk) {
//     chunks.push(chunk)
//     console.log(arguments)
//   })
//   res.on('end', function () {
//     console.log('data:', chunks.join())
//   })
// })

// req.on('error', (e) => {
//   console.error(`请求遇到问题: ${e.message}`)
// })

// req.end()
// console.log('agent:', http.globalAgent)
// https.get('https://www.lanyueos.com', res => {
//   res.setEncoding('utf8');
//   let rawData = '';
//   res.on('data', (chunk) => { rawData += chunk; })
//   res.on('end', () => {
//     console.log(rawData)
//   })
// }).on('error', err => {
//   console.log('错误', err)
// })

