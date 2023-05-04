<template>
  <q-dialog style="width: 700px" ref="dialog" @hide="onDialogHide">
    <q-card style="width: 700px" class="q-dialog-plugin text-center column">
      <div >

        <q-img class="q-ma-md shadow-3"
               style="border-radius: 50%"
               @mouseenter="()=>{this.ishow=true}"
               @mouseout="()=>{this.ishow=false}"
               :ratio="1" width="200px" :src="'http://localhost:8081/user/img/'+userInfo.userId">
          <div
            @mouseenter="()=>{this.ishow=true}"
            @mouseout="()=>{this.ishow=false}"

            v-show="this.ishow"
            class="absolute-bottom text-subtitle2 text-weight-bold text-center text-secondary" style="background-color: rgba(0,0,0,0.5);font-size: 18px;">
           click upload a new img
          </div>
          <q-popup-proxy>
            <q-uploader
              color="secondary"
              with-credentials
              style="max-width: 300px"
              @failed="failed"
              accept='.JPG,.JPEG,.PNG,.GIF'
              @uploaded="uploaded"
              :url="'http://localhost:8081/user/userimgs/'+userInfo.userId"
              :headers="header"
              method="POST"
              label="上传文件(不超过512km)"
              field-name="file"
              :max-file-size="1024*512"
              @rejected="onRejected"
            />
          </q-popup-proxy>
        </q-img>

      </div>
      <div v-if="this.ep">
      <div class="q-ma-sm text-weight-bold" style="font-family: cursive;font-size: 15px" >
        <q-input :borderless="!this.edit" v-model="userName"
                 :readonly="!this.edit"
                 style="font-size: 22px;" class="text-weight-bold">
          <template v-slot:before >
            <div style="font-size: 18px" class="text-secondary">
            Nick name:
            </div>
          </template>
        </q-input>
      </div>
      <div class="q-ma-sm  text-weight-bold" style="font-family: cursive;font-size: 15px" >
        <q-input borderless v-model="account"
                 readonly
                 style="font-size: 22px;" class="text-weight-bold">
          <template v-slot:before >
            <div style="font-size: 18px" class="text-secondary">
              Account:
            </div>
          </template>
        </q-input>


      </div>
      <div class="q-mx-sm  text-weight-bold" style="font-family: cursive;font-size: 15px" >
        <q-select :borderless="!this.edit" v-model="userSex" :readonly="!this.edit" :options="['Male','Female']"  style="font-size: 22px;" class="text-weight-bold">
          <template v-slot:before >
            <div style="font-size: 18px" class="text-secondary">
            User Sex:
            </div>
          </template>
        </q-select>

      </div>
      <div class="q-ma-sm  text-weight-bold" style="font-family: cursive;font-size: 15px" >
        <q-input borderless v-model="userRole" readonly style="font-size: 22px;" class="text-weight-bold">
          <template v-slot:before >
            <div style="font-size: 18px" class="text-secondary">
            User Role:
            </div>
          </template>
        </q-input>

      </div>
      <div class="q-ma-sm text-weight-bold" style="font-family: cursive;font-size: 20px" >
        <q-input borderless v-model="createTime" readonly style="font-size: 22px;" class="text-weight-bold">
          <template v-slot:before >
            <div style="font-size: 18px" class="text-secondary">
           Register Time:
            </div>
          </template>
        </q-input>
      </div>
      <div class="row col-1 q-mb-xl" v-if="this.edit===false">
        <q-btn class="absolute-bottom-right q-ma-md" @click="edit=true">Setting</q-btn>
      </div>

      <div class="row col-1 q-mb-xl" v-if="this.edit===true">
        <q-btn class="absolute-bottom-right q-ma-md" @click="save()">save</q-btn>
        <q-btn class="absolute-bottom-left q-ma-md" @click="this.ep=false;">Edit password</q-btn>
      </div>
      </div>
      <div v-if="!ep">
        <q-input class="q-ma-lg text-h6"
                 v-model="pd"
                 filled
                 :type="isPwd ? 'password' : 'text'"
                 :rules="[ (val) =>val!==''  || 'Please enter a valid password' ]"
                 label="Password">

          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-input class="q-ma-lg text-h6"
                 v-model="opd"
                 filled
                 lazy-rules
                 :type="isPwd ? 'password' : 'text'"
                 label="Old Password">

          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-btn @click="password"  class="bg-secondary">Save</q-btn>
      </div>

    </q-card>
  </q-dialog>
</template>

<script>
import {api} from "boot/axios";
import Router from "src/router";
import {getToken} from "src/utils/Token";

export default {
  name: "UserInfo",
  data(){
    return{
      userInfo:this.$store.getters["example/getLoginUser"],
      ishow:false,
      createTime:this.$store.getters["example/getLoginUser"].createTime,
      account:this.$store.getters["example/getLoginUser"].account,
      userSex:this.$store.getters["example/getLoginUser"].userSex==1?"Female":"Male",
      userRole:this.$store.getters["example/getLoginUser"].userRole.toUpperCase(),
      userName:this.$store.getters["example/getLoginUser"].userName,
      edit:false,
      ep:true,
      pd:'',
      opd:'',
      isPwd:true
    }
  }
  ,
  props: {
    // ...你自定义的属性
  },

  emits: [
    // 必需的
    'ok', 'hide'
  ],

  methods: {
    // 以下方法是必需的
    // (不要改变它的名称 --> "show")
    password(){
      if(this.pd===''||this.opd===''){
this.$q.notify({
  message:"password can not be null",
  position:"top",
  type:"warning"
})
  return;
      }
      api.put(
        'user/common/password',
        {},
        {params:{
            userId:this.userInfo.userId,
            password:this.pd,
            oldpassword:this.opd
          }}
      ).then(res=>{
          if(res.data.code===200){
            this.userInfo=res.data.data
            this.$store.commit('example/setLoginUser',res.data.data)
            this.$q.notify({
              message:"edit success",
              position:"top",
              type:"positive"
            })
          }else {
            this.$q.notify({
              message:"edit failed",
              position:"top",
              type:"negative"
            })
          }
        }
      )
      this.edit=false;

    },

    save(){
      api.put(
        'user/common',
        {},
        {params:{
            userId:this.userInfo.userId,
            userSex:this.userSex==="Male"? 0:1,
            userName:this.userName
          }}
      ).then(res=>{
          if(res.data.code===200){
            this.userInfo=res.data.data
            this.$store.commit('example/setLoginUser',res.data.data)
          }else {
            this.$q.notify({
              message:"edit failed",
              position:"top",
              type:"negative"
            })
          }
        }
      )
this.edit=false;
    },

    header(){
      return [{
        name:"X-Requested-With",value:'XMLHttpRequest' },
        {name:'Access-Control-Allow-Headers',value:'X-Requested-With,Content-Type,X-XSRF-TOKEN'},
        {name:'Access-Control-Allow-Methods',value:'OPTIONS, GET, POST,PUT'},
        {name:'Access-Control-Allow-Credentials',value:true},
        {name:'token',value:getToken()}]
      // 用于从cookie中匹配 csrftoken值

    },
    show () {
      this.$refs.dialog.show()
    },
    failed(){
     this.$q.notify({
       message:'Img update Failed',
       position:'top',
       type:'negative'
     })
    },
    uploaded(info){
      const data=JSON.parse(info.xhr.response)
      console.log(data)
      if(data.code!==200){
        this.$q.notify({
          message: "File update failed",
          icon: 'announcement',
          type:"negative",
          position:"top"
        })
      }else if(data.code===200){
        this.userInfo=data.data

      }

    },
  onRejected (rejectedEntries) {
    this.$q.notify({
      message: `${rejectedEntries.length}+file should less than 512kb`,
      icon: 'announcement',
      type:"negative",
      position:"top"
    })
  },
    // 以下方法是必需的
    // (不要改变它的名称 --> "hide")
    hide () {
      this.$refs.dialog.hide()
    },

    onDialogHide () {
      // QDialog发出“hide”事件时
      // 需要发出
      this.$emit('hide')
    },

    onOKClick () {
      // 按OK，在隐藏QDialog之前
      // 发出“ok”事件（带有可选的有效负载）
      // 是必需的
      // 或带有有效负载：this.$emit('ok', { ... })


    },
    newOmg(){


    },

    onCancelClick () {
      // 我们只需要隐藏对话框
      this.hide()
    }
  }
}
</script>

<style scoped>
</style>
