import axios from 'axios'
import Qs from 'qs'
import { Message } from 'element-ui'
import router from '../router'

const config = {
  baseURL: 'http://localhost/api/public',
  method: 'get', // default

  // transformRequest: [(data, headers) => {
  //   // Do whatever you want to transform the data
  //   console.log(headers);
  //   return data;
  // }],

  // transformResponse: [(data) => {
  //   // Do whatever you want to transform the data
  //   console.log(data);
  //   return data;
  // }],

  headers: {'X-Requested-With': 'XMLHttpRequest'},

  params: {},

  paramsSerializer (params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },

  data: {},

  timeout: 10000,

  // `withCredentials` indicates whether or not cross-site Access-Control requests
  // should be made using credentials
  withCredentials: false, // default

  responseType: 'json', // default

  maxContentLength: 2000,

  // `validateStatus` defines whether to resolve or reject the promise for a given
  // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
  // or `undefined`), the promise will be resolved; otherwise, the promise will be
  // rejected.
  validateStatus (status) {
    return status >= 200 && status < 300 // default
  },

  // `maxRedirects` defines the maximum number of redirects to follow in node.js.
  // If set to 0, no redirects will be followed.
  maxRedirects: 5
}

const api = axios.create(config)

// http request 拦截器
api.interceptors.request.use((req) => {
  req.headers.Authorization = localStorage.getItem('token')
//   // req.data.token = 'sdfsdf'
//   // console.log(req)
//   // console.log(req.headers.Authorization)
  return req
}, error => Promise.reject(error))

// http response 拦截器
api.interceptors.response.use(res => {
  if (res.data.code === 401) {
    Message.error('用户没有权限')
    router.replace({
      path: '/adminlogin'
    })
  } else if (res.data.code === 402) {
    Message.error('请先登录')
    router.replace({
      path: '/login'
    })
  } else {
    return res
  }
}, (error) => {
  throw error
})

export default api
