import {LocalStorage, SessionStorage} from "quasar";

export default function () {
  var token=''
  if(SessionStorage.getItem("token")!=="null"
    &&SessionStorage.getItem("token")!==undefined
  &&SessionStorage.getItem("token")!==''
  &&SessionStorage.getItem("token")!==null){

    token= SessionStorage.getItem('token')

  }else {
    token= LocalStorage.getItem('token')
  }
  return {
    //
    token:token,
    login:false,
    loginuser:null,
    timerin:1,
    timerup:1

  }
}
