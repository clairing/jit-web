let http = require('http')

let app = http.createServer((req, res) => {
  // 服务器端读取cookie
  req.cookie = {}
  let cookies = req.headers.cookie ? req.headers.cookie.split(';') : []
  if (cookies.length > 0) {
    cookies.forEach(item => {
      if (item) {
        let cookieArray = item.split('=')
        if (cookieArray && cookieArray.length > 0) {
          let key = cookieArray[0].trim()
          let value = cookieArray[1] ? cookieArray[1].trim() : undefined
          req.cookie[key] = value
        }
      }
    })
  }
  // 服务器端设置cookie
  console.log(req.cookie);
  res.setHeader('Set-Cookie', `key1=value1;httpOnly;expires=${getExpireTime()}`)

  res.end(
    JSON.stringify(req.cookie)
  )
})
app.listen(3002, () => {
  console.log('running on 3000')
})

function getExpireTime() {
  let d = new Date()
  d.setTime(d.getTime() + 15 * 60 * 1000)
  return d.toUTCString()
}
