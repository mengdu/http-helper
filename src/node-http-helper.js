'use strict'
import http from 'http'
import https from 'https'
import url from 'url'
import compose from './compose'
import interceptors from './interceptors'

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

class RequestHeader {
  constructor (options = {}) {
    let {
      protocol,
      hostname,
      port,
      path 
    } = url.parse(options.url)

    this.method = (options.method || 'GET').toUpperCase()
    this.timeout = options.timeout
    // this.headers = options.headers || []
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
    this.request = {
      middlewares: [],
      use (fn) {
        if (typeof fn !== 'function') throw new Error('The middleware must be a functon.')
        this.middlewares.push(fn)
        return this
      }
    }

    this.response = {
      middlewares: [],
      use (fn) {
        if (typeof fn !== 'function') throw new Error('The middleware must be a functon.')
        this.middlewares.push(fn)
        return this
      }
    }
  }

  fetch (options) {
    let that = this
    return new Promise((resolve, reject) => {
      if (typeof options !== 'object') {
        reject(new Error('The options params must be an object.'))
      }
      if (typeof options.url !== 'string' && !options.url) {
        reject(new Error('The options.url params required.'))
      }

      let reqOpts = new RequestHeader(options)

      interceptors(that.request.middlewares)(reqOpts, function (options) {
        request(options).then(res => {
          // resolve(res, options)
          interceptors(that.response.middlewares)(res, function (newRes) {
            resolve(newRes)
          })
        }).catch(err => {
          reject(err)
        })
      })
    })
  }
}
