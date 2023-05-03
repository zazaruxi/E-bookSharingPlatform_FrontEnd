import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import {getLoginUser} from "src/store/module-example/getters";
import {SessionStorage} from "quasar";
import {Notify} from "quasar";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */


  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

const Router= createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })
Router.beforeEach((to, from, next)=>{
  let user=SessionStorage.getItem("userinfo")
  if(to.name=="author"){
    console.log(user)
    if(user===null){
      Notify.create({
        message:'please login firstly',
        position:'top',
        type:'negative'
      })
    }else if (user.userRole!="author"){
      Router.push(
        '/author/register'
      )
    }else {
      next()
    }
  }else if(to.name==='comment'||to.name==='read'||to.name==='reply'||to.name==='shelf'){
    if(user===null) {
      Notify.create({
        message: 'please login firstly',
        position: 'top',
        type: 'negative'
      })
    }else {
      next()
    }
  }
  else {
    next()
  }

})
export default Router
