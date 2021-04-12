import Cookies from "js-cookie"

const TokenKey = "dev-token"

console.log('Auth:' + Cookies.get('DJITD_SITES_AUTH_V6.0'))
export function getToken() {
  console.log("cookie:" + Cookies.get(TokenKey))
  if (Cookies.get(TokenKey)) {
    return "admin_token"
  }
  else {
    return ""
  }
}
var option = {}
if (window.location.host != 'localhost:3001') {
  option = { domain: ".djitd.com" }
}
export function setToken(token) {
  return Cookies.set(TokenKey, token, option)
}


export function removeToken() {
  return Cookies.remove(TokenKey)
}
