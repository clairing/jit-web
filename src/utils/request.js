import axios from 'axios'
import store from '@/store'
import { getToken } from "@/utils/js-cookie"
import notify from 'devextreme/ui/notify';
// import jwt from 'jsonwebtoken';
// var express = require('express');
// var cookieParser = require('cookie-parser');
// var app = express();
// app.use(cookieParser())
// req.cookies['cookieName']
// 创建值
// const secret = 'KJSJ92388%233K#';
// const token = jwt.sign({
//   name: 123
// }, secret, {
//   expiresIn: 60 //秒到期时间
// });
// console.log(token)
axios.defaults.withCredentials = false
const service = axios.create({
  baseURL: process.APP_BASE_API,
  timeout: 50000
})
service.interceptors.request.use(
  config => {
    // console.log(config)
    if (store.getters.token) {
      config.headers['X-Token'] = getToken()
      config.headers.authorization = `Bearer ${getToken()}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      // notify("11", "error", 2000);
      if (res.code === 50014) {
        notify("单点登录，需退出", "error", 2000);
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    }
    else {
      return res
    }
  }, error => {
    console.log('error' + error)
    return Promise.reject(error)
  }
)
export default service
