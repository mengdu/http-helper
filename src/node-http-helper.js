'use strict'
import http from 'http'
import url from 'url'


const handleCallback = function (options, cb) {
  return function (res) {
    let chunks = []

    res.on('data', chunk => {
      chunks.push(chunk)
    })

    res.on('end', () => {
      cb(null, [].concat(chunks))
    })
  }
}

function request(options, cb) {

  if (typeof options !== 'object') {
    throw new Error('The options params must be an object.')
  }
  if (typeof options.url !== 'string' && !options.url) {
    throw new Error('The options.url params required.')
  }
  let op = {...options}
  let {protocol, hostname, port, path} = url.parse(op.url)
  delete op.url
  op.protocol = protocol
  op.hostname = hostname
  op.port = port
  op.path = path
  op.method = (op.method || 'GET').toUpperCase()

  console.log(op)
  let req = http.request(op, handleCallback(op, cb))

  req.on('error', (err) => {
    cb(err)
  })

  req.on('timeout', () => {
    cb({message: 'http timeout'})
  })
  req.end()
}

export default class HttpHepler {
  constructor () {
    this.middlewares = []
  }
  get request () {
    return request
  }
  get http () {
    return http
  }
  use (fn) {
    if (typeof fn !== 'function') throw new Error('The middleware must be a functon.')
    this.middlewares.push(fn)
  }
}
