'use strict'
import url from 'url'

export default class RequestHeader {
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
