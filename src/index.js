import httpHelper from './node-http-helper'

httpHelper({
  url: 'https://www.lanyueos.com'
}, (err, res) => {
  if (err) {
    throw err
  }
  console.log(res)
  console.log(res.toString())
})
