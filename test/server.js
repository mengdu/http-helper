const Koa = require('koa')
const KoaRouter = require('koa-router')
const KoaBodyParser = require('koa-bodyparser')
const KoaBody = require('koa-body')

const app = new Koa()
const router = new KoaRouter()

app.use(async (ctx, next, app) => {
  const start = Date.now()
  await next()

  var delta = Math.ceil(Date.now() - start)

  var info = `[HTTP]: ${ctx.method} ${ctx.status} ${ctx.url} - ${delta}ms`

  ctx.set('X-Response-Time', delta + 'ms')

  if (ctx.status > 400 && ctx.status < 500) {
    console.warn(info)
  } else if (ctx.status < 400) {
    console.log(info)
  } else {
    console.error(info)
  }
})

// post解析，不支持文件上传
app.use(KoaBodyParser())
// app.use(KoaBody({
//   multipart: true
// }))

router.get('/', ctx => {
  ctx.body = {msg: 'wellcome home'}
})

router.get('/api', ctx => {
  ctx.body = {api: true, msg: 'api', query: ctx.query}
})

router.post('/api/post', ctx => {
  console.log(ctx.headers)
  ctx.body = {
    api: true,
    type: 'post',
    msg: ctx.url,
    query: ctx.query,
    body: ctx.request.body
  }
})

router.put('/api/put', ctx => {
  ctx.body = {
    api: true,
    type: 'put',
    query: ctx.query,
    body: ctx.request.body
  }
})

router.all('/api/all', async ctx => {
  console.log(ctx.request)
  ctx.body = {
    api: true,
    type: ctx.method,
    query: ctx.query,
    body: ctx.request.body
  }
})

router.all('/api/file', KoaBody({
  multipart: true,
  formLimit: 400 * 1024 * 1024,
  formidable: {
    maxFileSize: 400 * 1024 * 1024
  }

}), async ctx => {
  ctx.body = {
    api: true,
    type: ctx.method,
    query: ctx.query,
    body: ctx.request.body
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000)
console.log('listen on 3000')
