# http-helper

http helper for node.

> 暂不支持上传文件！！

```js
const http = new HttpHepler()

http.get('https://github.com').then(res => {
  console.log(res.toString())
})
```

**interceptors**

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

## API

**new HttpHepler(options)** 创建一个请求对象http

  + **options** `array` 可选 配置对象
  + **options.urlEncode** `boolean` 是否编码url，默认true
  + **options.bodyEncode** `boolean` body编码类型，默认utf8

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
