'use strict'
import fileType from 'file-type'
import fs from 'fs'
import path from 'path'
import readHunk from 'read-chunk'

export default class File {
  constructor (options) {
    if (typeof options !== 'object') {
      throw new Error('The first arguments must be an object.')
    }
    if (!options.buffer && !options.filePath) {
      throw new Error('The options object must provide a `options.buffer` or `options.filePath`.')
    }
    this.buffer = options.buffer || []
    this.filePath = options.filePath
    this.name = options.name

    if (!options.name && options.filePath) {
      this.name = path.basename(options.filePath)
    }

    if (options.buffer) {
      this.buffer = Buffer.from(options.buffer)
      const type = fileType(this.buffer)
      this.type = type ? type.mime : 'application/octet-stream'
      this.size = this.buffer.length
    }

    if (!options.buffer && options.filePath) {
      const stat = fs.statSync(options.filePath)
      if (!stat.isFile()) {
        throw new Error('The `options.filePath` is not a file.')
      }
      const chunk = readHunk.sync(options.filePath, 0, 4100)
      const type = fileType(chunk)
      this.buffer = null
      this.size = stat.size
      this.type = type ? type.mime : 'application/octet-stream'
    }
  }
}
