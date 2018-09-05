# http-helper

A library for HTTP request helper on node.

```js
import MHttp from 'm-http'
const http = new MHttp()

http.get('https://api.github.com', {
  headers: {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Test-App'
  }
}).then(res => {
  console.log(res.data)
})
```

## API

**new MHttp(options)** 创建一个请求对象http

  + **options** `object` 可选 配置对象
  + **options.urlEncode** `boolean` 是否编码url，默认true

### http

+ **http.fetch(options)** 创建一个请求，返回 Promise 对象；成功会resolve `IncomingMessage` 对象，IncomingMessage.body 返回响应 Buffer 数据。

  + **options** `object` 必须，请求参数配置
  + **options.url** `string` 必须，请求url
  + **options.method** `string` 可选，请求类型，默认 GET
  + **options.timeout** `string`
  + **options.headers** `object` 可选，请求头设置，key/val
  + **options.auth** `string`
  + **options.agent** `string`
  + **options.body** `object|string|FormData` 可选，含有body（POST/PUT/PATCH/DELETE）的提交，key/val
  + **options.params** `object` 可选，构造查询参数，key/val

+ **http.get(url, options)** 创建GET请求
+ **http.delete(url, options)** 创建DELETE请求
+ **http.head(url, options)** 创建HEAD请求
+ **http.post(url, options)** 创建POST请求
+ **http.put(url, options)** 创建PUT请求
+ **http.patch(url, options)** 创建PATCH请求

### Events

**start**

开始发起请求，参数： `options`

**end**

响应结束，参数：'IncomingMessage'

**error**

请求过程存在错误


**upload**

 `multipart/form-data` 请求时触发（每项数据上传会触发一次）


### interceptors

可以增加中间件处理一些请求前后的操作。

中间件必须调用 `next()` 才可继续下一步。

**请求中间件**

```js
http.request.use(function(options, next) {
  // do
  next()
})
```

**响应中间件**

```js
http.response.use(function(res, next) {
  // do
  // res.data = JSON.parse(res.body.toString())
  next()
})
```


## application/x-www-form-urlencoded

具有body体的请求， 默认 `Content-Type` 为 `application/x-www-form-urlencoded`

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

## application/json

如果想要提交json格式数据，需要指定 `Content-Type` 为 `application/json`

```js
http.post('http://localhost:3000/api/all', {
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({...data})
}).then(res => {
  console.log('response:', res.body.toString())
}).catch(err => {
  console.log('response err:', err)
})
```

## multipart/form-data

上传文件时，并不需要指定 `Content-Type` 为 `multipart/form-data`，默认会判断 `options.body` 对象类型是否为 `FormData` 来设置。

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
form.append('zip', new File({filePath: './test.zip'}))

console.log(form)

http.post('http://localhost:3000/api/file', {
  body: form
}).then(res => {
  console.log('response:', res.body.toString())
}).catch(err => {
  console.log('response err:', err)
})
```

## Other

**FormData**

```js
import FormData from 'm-http/form-data'
```

用于构造 `multipart/form-data` 数据。

```js
const form = new FormData()
form.append('key', 'val')
// ...
```

**File**

```js
import File from 'm-http/file'
```

用于定义文件的对象。

```js
new File({name: 'text.txt', buffer: Buffer.from('this is a test\r\n这是一个测试。')}
```
