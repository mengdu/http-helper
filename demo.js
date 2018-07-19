const HttpHepler = require('./dest').default
const http = new HttpHepler()

http.request.use(function (options, next) {
  console.log(1)
  console.log(options)
  next()
})
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
const crypto = require('crypto')
const fs = require('fs')
const img = fs.readFileSync('./test/demo.png')
// console.log(img)
const boundary = '----' + crypto.randomBytes(4).toString('hex')
// const boundary = 'AaB03x'
// const body = `--${boundary}\r\nContent-Disposition: form-data; name="attr1"\r\n\r\n123\r\n--${boundary}--`
const data = [
  '\r\nContent-Disposition: form-data; name=\"attr1\"\r\n\r\n123\r\n',
  // '\r\nContent-Disposition: form-data; name="attr2"\r\n\r\n123\r\n',
  // '\r\nContent-Disposition: form-data; name="file"; filename="demo.js"\r\nContent-Type: text/javascript\r\n\r\n123\r\n',
  // `\r\nContent-Disposition: form-data; name="file"; filename="demo.png"\r\nContent-Type: image/png\r\nContent-Transfer-Encoding: binary\r\n\r\n${img}\r\n`
]
const body = `--${boundary}${data.join('--' + boundary)}--${boundary}--`

// --------------http-helper-----------

http.post('http://localhost:3000/api/file', {
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    // 'Content-Type': `multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW`,
    // 'Content-Length': '7'
  },
  body: body,
  // body: {
  //   attr1: 123
  // }
}).then(res => {
  console.log('response:', res.body.toString())
}).catch(err => {
  console.log('response err:', err.message)
})



//-------------------node native----------
// var xhr = require("http");

// var options = {
//   protocol: 'http:',
//   "method": "POST",
//   "hostname": 'localhost',
//   "port": 3000,
//   "path": '/api/file',
//   "headers": {
//     'Content-Type': `multipart/form-data; boundary=${boundary}`,
//     'Transfer-Encoding': 'chunked'
//     // 'Content-Type': 'multipart/form-data; boundary=----5b04e390'
//     // 'Content-Type': 'application/x-www-form-urlencoded'
//   }
// };

// var req = xhr.request(options, function (res) {
//   var chunks = [];

//   res.on("data", function (chunk) {
//     chunks.push(chunk);
//   });

//   res.on("end", function () {
//     var data = Buffer.concat(chunks);
//     console.log(data.toString());
//   });
// });
// console.log(body)
// req.on('error', err => {
//   console.log('error', err)
// })
// // req.write(body)
// req.write(`--${boundary}`)
// req.write(`${data.join('--' + boundary)}`)
// req.write(`--${boundary}`)
// req.write('\r\nContent-Disposition: form-data; name="file"; filename="demo.js"\r\nContent-Type: text/javascript\r\n\r\n')
// req.write('this is a test\r\n这是一个测试。', 'utf8')
// req.write('\r\n')
// req.write(`--${boundary}`)
// // req.write('\r\nContent-Disposition: form-data; name="img"; filename="demo.png"\r\nContent-Type: image/png\r\n\r\n')
// // req.write(img, 'binary')
// // req.write('\r\n')
// // req.write(`--${boundary}--`)
// // req.end();


// const buf = fs.createReadStream('D:/Software/mysql-5.6.40-winx64.zip')

// // buf.pipe(function () {
// //   console.log(arguments)
// // })
// req.write('\r\nContent-Disposition: form-data; name="img"; filename="demo.zip"\r\nContent-Type: application/zip\r\n\r\n')
// buf.on('data', chunk => {
//   // console.log(chunk)
//   req.write(chunk, 'binary')
// })

// buf.on('end', () => {
//   console.log('end')
//   req.write('\r\n')
//   req.write(`--${boundary}--`)
//   req.end();
// })

