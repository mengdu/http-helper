'use strict'

export default class FormData {
  constructor () {
    if (this.constructor !== FormData) {
      throw new Error('Must be new a FormData Object.')
    }
    this.body = {}
  }
  append (key, value) {
    if (!this.body[key]) {
      this.body[key] = []
    }
    this.body[key].push(value)
  }
  delete (key) {
    delete this.body[key]
  }
  // entries () {}
  // forEach () {}
  get (key) {
    if (this.body[key]) {
      return typeof this.body[key][0] === 'undefined' ? null : this.body[key][0]
    }
    return null
  }
  getAll (key) {
    return this.body[key] ? this.body[key] : []
  }
  has (key) {
    return !!this.body[key]
  }
  // keys () {
  // }
  set (key, value) {
    if (!this.body[key]) {
      this.body[key] = []
    }
    this.body[key] = [value]
  }
  // values () {}
}
