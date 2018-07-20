'use strict'
import crypto from 'crypto'
import EventEmitter from 'events'
import request from './request'
import RequestHeader from './request-header'
import interceptors from './interceptors'
import urlparams from './urlparams'
import FormData from './form-data'

export default class HttpHepler extends EventEmitter {
  constructor (options = {}) {
    super()
    this.urlEncode = options.urlEncode === 'undefined' ? options.urlEncode : true

    // 请求中间件
    this.request = {
      middlewares: [],
      use (fn) {
        if (typeof fn !== 'function') throw new Error('The middleware must be a functon.')
        this.middlewares.push(fn)
        return this
      }
    }

    // 响应中间件
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
    const that = this
    return new Promise((resolve, reject) => {
      if (typeof options !== 'object') {
        reject(new Error('The options params must be an object.'))
      }
      if (typeof options.url !== 'string' && !options.url) {
        reject(new Error('The options.url params required.'))
      }
      // 创建请求对象
      const reqOpts = new RequestHeader(options)

      // 请求中间件
      interceptors(that.request.middlewares)(reqOpts, function (options) {

        const url = urlparams.url(options.path, options.params, that.urlEncode)
        options.path = url
        options.method = (options.method || 'GET').toUpperCase()

        if (['POST', 'PUT', 'PATCH'].indexOf(options.method) > -1) {

          options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/x-www-form-urlencoded'

          if (typeof options.body === 'object') {

            if (!(options.body instanceof FormData)) {
              options.body = urlparams.stringify(options.body)
            } else {
              const randString = crypto.randomBytes(32).toString('hex')
              options.boundary = crypto.createHash('md5').update(randString + Date.now()).digest('hex')
              options.headers['Content-Type'] = 'multipart/form-data; boundary=' + options.boundary + ''
              options.headers['Transfer-Encoding'] = 'chunked'
            }
          }
        } else {
          options.body = ''
        }

        // 触发 start 事件
        that.emit('start', options)

        // 发起请求
        request(options, that).then(res => {
          // 触发 end 事件
          that.emit('end', options, res)

          // 响应中间件
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
