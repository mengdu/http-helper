# http-helper

Http request tool for node.


```js
import MHttp from 'm-http'
const http = new MHttp()

http.get('https://github.com').then(res => {
  console.log(res.toString())
})
```

## API

**new MHttp(options)** 创建一个请求对象http

  + **options** `array` 可选 配置对象
  + **options.urlEncode** `boolean` 是否编码url，默认true

### http

+ **http.fetch(options)** 提交一个请求，返回promise

  + **options** `object` 必须，请求参数配置
  + **options.url** `string` 必须，路径
  + **options.method** `string` 可选，请求类型，默认 GET
  + **options.timeout** `string` 
  + **options.headers** `object` 可选，请求头设置，key/val  
  + **options.auth** `string`
  + **options.agent** `string`
  + **options.body** `object` 可选，含有body的提交，key/val
  + **options.params** `object` 可选，构造查询参数，key/val

+ **http.get(url, options)**
+ **http.delete(url, options)**
+ **http.head(url, options)**
+ **http.post(url, options)**
+ **http.put(url, options)**
+ **http.patch(url, options)**

### Events

**start**

开始发起请求，参数： `options`

**end**

响应结束，参数：'IncomingMessage'

**error**

请求过程存在错误


**upload**

 `multipart/form-data` 请求时触发


### interceptors



**请求中间件**

```js
http.request.use(function(options, next) {
  // do
  next()
})
```

**响应中间件**

```js
http.response.use(function(options, next) {
  // do
  next()
})
```


**e.g.**

```js

http.request.use(function (options, next) {
  console.log(1)
  next()
})
.use(function (options, next) {
  console.log(2)
  next()
})


http.response.use(function (res, next) {
  console.log(3)
  next()
})
.use(function (res, next) {
  console.log(4)
  next()
})
```


## application/x-www-form-urlencoded

```js
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
```

## multipart/form-data

```js
import MHttp from 'm-http'
import FormData from 'm-http/form-data'
import File from 'm-http/file'

const http = new MHttp()
const form = new FormData()

form.append('key', 'value')
form.append('username', 'admin')
form.append('password', '123456')
form.append('userId', 1001)
form.append('zh', '中文')
form.append('data', JSON.stringify({name: 'admin', info: 'this is a test.', zh: '中文'}))
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
```
