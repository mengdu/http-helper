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
export default function (options, cb) {

  if (typeof options !== 'object') {
    throw new Error('The options params must be an object.')
  }
  if (typeof options.url !== 'string' && !options.url) {
    throw new Error('The options.url params required')
  }
  let op = {...options}
  let {protocol, hostname, port, path} = url.parse(op.url)
  op.protocol = protocol
  op.hostname = hostname
  op.method = (op.method || 'GET').toUpperCase()

  let req = http.request(options, handleCallback(op, cb))

  req.on('error', (err) => {
    cb(err)
  })

  req.on('timeout', () => {
    cb({message: 'http timeout'})
  })
  req.end()
}
