class EventEmitter {
  constructor () {
    this._events = {}
  }

  __addListener (type, listener, isOnce) {
    if (typeof type !== 'string') {
      throw new TypeError('`type` argument must be a string')
    }
    if (typeof listener !== 'function') {
      throw new TypeError('`listener` argument must be a function')
    }
    if (!this._events[type]) {
      this._events[type] = []
      this._events[type]['once'] = !!isOnce
    }
  
    this._events[type].push(listener)

    return this
  }

  on (type, listener) {
    return this.__addListener(type, listener)
  }

  once (type, listener) {
    return this.__addListener(type, listener, true)
  }

  emit (type, playload) {
    if (!this._events[type]) {
      console.warn('Can\'t find `' + type + '`type')
      return false
    }
    for (let i = 0; i < this._events[type].length; i++) {
      this._events[type][i](playload)
    }

    if (this._events[type] && this._events[type].once) {
      this.un(type)
    }

    return true
  }

  un (type) {
    if (!this._events[type]) return false

    delete this._events[type]

    return true
  }
}

export default EventEmitter
