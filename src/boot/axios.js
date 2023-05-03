import { boot } from 'quasar/wrappers'
import axios from 'axios'
import {getToken} from "src/utils/Token";
import {Loading,Notify} from "quasar";
import Router from "src/router";
// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: process.env.API_ROOT })
axios.defaults.withCredentials=true;

api.interceptors.request.use(config => {

  Loading.show()

  if(config.url==='https://idcardv2.shumaidata.com/new-idcard') {
    config.headers['Authorization']='APPCODE f2a84d92a86b4fdc899ee49f27465f2e'
  }else {
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    config.headers['Access-Control-Allow-Headers']='X-CSRFToken,X-Requested-With,Content-Type';
    config.headers['Access-Control-Allow-Methods']='OPTIONS, GET, POST,PUT';
    config.headers['Access-Control-Allow-Credentials']=true;
  }


  if (getToken()!==undefined&&getToken()!==null&&getToken()!==''&&getToken()!=='null'){
    config.headers['token']=getToken()
  }


  //
  // let regex = /.*XSRF-TOKEN=([^;.]*).*$/; // 用于从cookie中匹配 csrftoken值
  // console.log("csrf+"+document.cookie.match(regex))
  // config.headers['X-XSRF-TOKEN'] = document.cookie.match(regex) === null ? null : document.cookie.match(regex)[1];

  return config
}, err => {
  Loading.hide()
  return Promise.reject(err)
})

api.interceptors.response.use(res => {
  Loading.hide()
  if (res.data.code!==200){
      Notify.create({
        message:res.data.msg,
        type:"warning",
        position:'top'
      })
  }
  return Promise.resolve(res)
}, err =>{
  Loading.hide()
  Router.push(
    '/error'
  )
  // 注意这里应该return promise.reject(),
  // 因为如果直接return err则在调用此实例时，响应失败了也会进入then(res=>{})而不是reject或catch方法
  return Promise.reject(err)
})



export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
