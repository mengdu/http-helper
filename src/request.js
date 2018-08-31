'use strict'
import http from 'http'
import https from 'https'
import fs from 'fs'
import FormData from './form-data'
import File from './file'

export default function request(options, target) {
  const net = options.protocol === 'http:' ? http : https

  return new Promise(async (resolve, reject) => {
    const boundary = options.boundary
    const body = options.body

    delete options.boundary
    delete options.body

    const req = net.request(options, res => {
      // res.setEncoding('utf8')
      let chunks = []
      let totalLen = 0
      res.on('data', chunk => {
        chunks.push(chunk)
        totalLen += chunk.length
      })

      res.on('end', () => {
        res.body = Buffer.concat(chunks, totalLen)
        resolve(res)
      })
    })

    req.on('error', (err) => {
      target.emit('error', err)
      reject(err)
    })

    req.on('timeout', () => {
      target.emit('timeout')
      reject(new Error('Http request has timeout'))
    })

    function loop (item) {
      return new Promise((done) => {
        if (item.value instanceof File) {
          req.write(`\r\nContent-Disposition: form-data; name="${item.key}"; filename="${item.value.name}"\r\nContent-Type: ${item.value.type}\r\n\r\n`)
          if (item.value.buffer) {
            req.write(item.value.buffer, 'binary')
            req.write('\r\n')
            done()
          } else {
            // read buffer stream
            const buf = fs.createReadStream(item.value.filePath)
            buf.on('data', chunk => {
              req.write(chunk, 'binary')
            })
            buf.on('end', () => {
              req.write('\r\n')
              done()
            })
            buf.on('error', err => {
              target.emit('error', err)
            })
          }
        } else {
          req.write(`\r\nContent-Disposition: form-data; name="${item.key}"\r\n\r\n${item.value}\r\n`)
          done()
        }
      })
    }

    if (typeof body === 'object' && body instanceof FormData) {
      // send multipart/form-data
      const keys = Object.keys(body.body)
      const items = []
      for (const i in keys) {
        body.body[keys[i]].forEach(e => {
          items.push({
            key: keys[i],
            value: e
          })
        })
      }
      // send form-data https://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.2
      req.write(`--${boundary}`)

      const total = items.length
      for (const index in items) {
        await loop(items[index])

        target.emit('upload', items[index], total)

        if (index < (total - 1)) {
          req.write(`--${boundary}`)
        }
      }

      req.write(`--${boundary}--`)
      req.end()
    } else {
      // send application/x-www-form-urlencoded
      req.write(body || '', 'utf8')
      req.end()
    }
  })
}
