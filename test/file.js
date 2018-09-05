const MHttp = require('../dest').default
const FormData = require('../dest/form-data').default
const File = require('../dest/file').default

const http = new MHttp()

http.on('start', options => {
  console.log('start:\n', options)
})

http.on('upload', (item) => {
  console.log('upload:\n', item)
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
form.append('img', new File({filePath: __dirname + '/demo.png'}))

console.log(form)

http.post('http://localhost:3000/api/file', {
  body: form
}).then(res => {
  console.log('response:', res.body.toString())
}).catch(err => {
  console.log('response err:', err)
})
