# http-helper

http helper for node.

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