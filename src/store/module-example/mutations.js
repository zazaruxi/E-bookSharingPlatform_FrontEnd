import { LocalStorage, SessionStorage } from 'quasar'

export function setTokenLocal(state, token) {
  state.token = token
  LocalStorage.set("token",token) //同步存储token至localstorage
}
export function setTokenSession(state, token) {
  state.token = token
  SessionStorage.set("token",token) //同步存储token至localstorage
}
export function setLogin(state, login) {
  state.login = login
}
export function setLoginUser(state, loginuser) {
  SessionStorage.set("userinfo",loginuser)
  state.loginuser = loginuser
}
export function setTimerIn(state, timerin) {
  state.timerin = timerin
}
export function setTimerUp(state, timerup) {
  state.timerup = timerup
}
