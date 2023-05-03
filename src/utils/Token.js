import {LocalStorage, SessionStorage} from "quasar";

export function getToken(){

  if(SessionStorage.getItem("token")!=="null"
    &&SessionStorage.getItem("token")!==undefined
    &&SessionStorage.getItem("token")!==''
  &&SessionStorage.getItem("token")!==null){
    return  SessionStorage.getItem('token')
  }else {
    return  LocalStorage.getItem('token')
  }
}
