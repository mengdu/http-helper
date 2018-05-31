'use strict'
import http from 'http'
import https from 'https'
import url from 'url'
import compose from './compose'

function request(options) {
  let net = options.protocol === 'http:' ? http : https
  return new Promise((resolve, reject) => {
    let req = net.request(options, res => {

      let chunks = []
      res.on('data', chunk => {
        chunks.push(chunk)
      })

      res.on('end', () => {
        resolve(chunks.join(), res)
     })
    })

    req.on('error', (err) => {
      reject(err)
    })

    req.on('timeout', () => {
      reject(new Error('Http request has timeout'))
    })
    req.end()
  })
}

class RequestOption {
  constructor (options = {}) {
    let {
      protocol,
      hostname,
      port,
      path 
    } = url.parse(options.url)

    this.method = (options.method || 'GET').toUpperCase()
    this.timeout = options.timeout
    this.headers = options.headers || []
    this.auth = options.auth
    this.agent = options.agent
    this.body = options.body
    this.type = options.type
    this.params = options.params

    this.hostname = hostname
    this.port = port
    this.protocol = protocol
    this.path = path
  }
}

export default class HttpHepler {
  constructor () {
    this.middlewares = []
  }

  get http () {
    return http
  }

  use (fn) {
    if (typeof fn !== 'function') throw new Error('The middleware must be a functon.')
    this.middlewares.push(fn)
  }

  async request (options) {
    if (typeof options !== 'object') {
      throw new Error('The options params must be an object.')
    }
    if (typeof options.url !== 'string' && !options.url) {
      throw new Error('The options.url params required.')
    }

    let reqOpts = new RequestOption(options)

    compose(this.middlewares)(reqOpts, async function (options, next) {

      let res = await request(options)

      options.res = res

      await next()
      console.log('http: end')
    })

  }
}
