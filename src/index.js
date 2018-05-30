import httpHelper from './node-http-helper'

const http = new httpHelper()

http.use(async (ctx, next) => {
  console.log(ctx)
  await next()
  console.log('end')
  console.log(ctx.res)
})

http.request({
  url: 'https://www.lanyueos.com'
})
