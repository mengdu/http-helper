const MHttp = require('../dest').default
const FormData = require('../dest/form-data').default
const File = require('../dest/file').default

const http = new MHttp()

// 全局 headers
http.headers = {
  'Content-Type': 'application/json'
}

http.on('error', err => {
  console.log('global err:', err)
})

http.post('http://localhost:3000/api/post', {
  // headers: {
  //   'Content-Type': 'application/json; charset=utf-8'
  // },
  body: JSON.stringify({
    name: 'admin',
    pass: '123456'
  })
}).then(res => {
  console.log(res.body.toString())
}).catch(err => {
  console.log('err:', err)
})