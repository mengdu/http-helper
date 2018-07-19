'use strict'
import http from 'http'
import https from 'https'
import url from 'url'
import interceptors from './interceptors'
import urlparams from './urlparams'

function request(options) {
  let net = options.protocol === 'http:' ? http : https

  return new Promise((resolve, reject) => {
    let req = net.request(options, res => {
      // res.setEncoding('utf8')
      let chunks = []
      let totalLen = 0
      res.on('data', chunk => {
        chunks = [].concat(chunk)
        totalLen += chunk.length
      })

      res.on('end', () => {
        res.body = Buffer.concat(chunks, totalLen)
        resolve(res)
      })
    })

    req.on('error', (err) => {
      reject(err)
    })

    req.on('timeout', () => {
      reject(new Error('Http request has timeout'))
    })

    req.write(['POST', 'PUT', 'PATCH'].indexOf(options.method) > -1 ? options.body : '')
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
    this.headers = options.headers || {}
    this.auth = options.auth
    this.agent = options.agent
    this.body = options.body || {}
    this.params = options.params || {}

    this.hostname = hostname
    this.port = port
    this.protocol = protocol
    this.path = path
  }
}

export default class HttpHepler {

  constructor (options = {}) {
    this.urlEncode = options.urlEncode === 'undefined' ? options.urlEncode : true
    this.bodyEncode = this.bodyEncode === 'undefined' ? this.bodyEncode : false
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

        let url = urlparams.url(options.path, options.params, that.urlEncode)
        options.path = url
        options.method = (options.method || 'GET').toUpperCase()
        // options.headers['Content-Length'] = 0

        if (['POST', 'PUT', 'PATCH'].indexOf(options.method) > -1) {
          options.body = typeof options.body === 'object'
            ? urlparams.stringify(options.body)
            : options.body
          options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/x-www-form-urlencoded'
          // options.headers['Content-Length'] = Buffer.byteLength(options.body, that.bodyEncode)
        }
        console.log(options)
        request(options).then(res => {
          interceptors(that.response.middlewares)(res, function (newRes) {
            resolve(newRes)
          })
        }).catch(err => {
          reject(err)
        })
      })
    })
  }

  get (url, options = {}) {
    return this.fetch({url, ...options, method: 'GET'})
  }

  delete (url, options = {}) {
    return this.fetch({url, ...options, method: 'DELETE'})
  }

  head (url, options = {}) {
    return this.fetch({url, ...options, method: 'HEAD'})
  }

  post (url, options = {}) {
    return this.fetch({url, ...options, method: 'POST'})
  }

  put (url, options = {}) {
    return this.fetch({url, ...options, method: 'PUT'})
  }

  patch (url, options = {}) {
    return this.fetch({url, ...options, method: 'PATCH'})
  }
}
