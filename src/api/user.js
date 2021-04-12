import request from '@/utils/request'
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}
export function phoneLogin(data) {
  return request({
    url: '/user/phoneLogin',
    method: 'post',
    data
  })
}
export function wxLogin(data) {
  return request({
    url: '/user/wxLogin',
    method: 'post',
    data
  })
}
export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getVcode(data) {
  return request({
    url: '/user/getVcode',
    method: 'post',
    data
  })
}
