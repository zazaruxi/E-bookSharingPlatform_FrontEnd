import { LocalStorage, SessionStorage } from 'quasar'
import {api} from "boot/axios";
export function getToken(state) {
  if (!state.token) {

  }
  return state.token
}

export function getLoginUser(state){
if (state.loginuser===null||state.loginuser===undefined||state.loginuser===''||state.loginuser==='null'){
  return SessionStorage.getItem("userinfo")
}
  return state.loginuser
}

export function getTimerIn(state){

  return state.timerin
}
export function getTimerUp(state){

  return state.timerup
}
