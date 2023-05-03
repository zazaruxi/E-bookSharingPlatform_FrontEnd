<template>
  <q-dialog style="width: 700px" ref="dialog" @hide="onDialogHide">
    <q-card style="width: 700px" class="q-dialog-plugin">
      <q-card-section class="text-center text-teal text-weight-bolder text-h6">
        Sign Up
      </q-card-section>

      <q-card-section  class="text-center">
        <q-input
          class="q-ma-lg text-h6"
          v-model="nickname"
          filled type="text"
          :rules="[ (val) =>val!==''  || 'Please enter a valid nickname' ]"
          :error="error"
          error-message="message"
          label="Nickname"/>
        <q-input
          v-if="type"
          class="q-ma-lg text-h6"
          v-model="account"
          filled type="email"
          lazy-rules
          :rules="[ (val, rules) =>rules.email(val)  || 'Please enter a valid email address' ]"
          label="Email"
           />
        <q-input
          v-if="!type"
          class="q-ma-lg text-h6"
          v-model="account"
          mask="# # # - # # # # - # # # #"
          :rules="[ (val) =>val!==''  || 'Please enter a valid telephone' ]"
          filled type="tel"
          unmasked-value
          label="Telephone number"
        />
        <q-input v-model="code"
                 mask="# # # # # #"
                 unmasked-value
                 filled
                 :error="acerr"
                 error-message="Tel or mail can not be null"
                 class="q-ma-lg text-h6"
                 label="verification"

        >
          <template v-slot:after>
            <q-btn @click="verification()" :disable="disabled" color="secondary" :label="btnText">

            </q-btn>
          </template>
        </q-input>
        <p >
          <q-icon size="xs" color="secondary" name="phone"></q-icon>
          <q-toggle  size="sm" v-model="type" @click="()=>{this.account=''}" />
          <q-icon size="xs" color="secondary" name="email"></q-icon>
        </p>

        <q-input class="q-ma-lg text-h6"
                 v-model="password"
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
                   v-model="epassword"
                   filled
                   lazy-rules
                   :rules="[(val)=> val===password ||'The two passwords are the same']"
                   :type="isPwd ? 'password' : 'text'"
                   label="Ensure Password">

          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <div class="q-gutter-sm">
          <q-radio v-model="sex" :val='1' label="Male" color="secondary" />
          <q-radio v-model="sex" :val="0" label="Female" color="secondary" />
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn class="q-ma-lg" color="secondary" label="Sign up" @click="onOKClick()" />
        <q-btn class="q-ma-lg" color="secondary" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "Signup",
  data(){
    return{
      account:'',
      isPwd:true,
      password:'',
      type:false,
      rem: false,
      error:false,
      acerr:false,
      epassword:'',
      nickname:'',
      sex:0,
      message:'',
      code:'',
      btnText: this.$store.getters["example/getTimerUp"]===1? 'verification':this.$store.getters["example/getTimerUp"]+ 's',
      disabled: this.$store.getters["example/getTimerUp"]!==1, // 不禁用
      oneMinutes: this.$store.getters["example/getTimerUp"]===1?0:this.$store.getters["example/getTimerUp"], // 倒计时
      timer:setInterval(() => {
        this.btnText = `${this.oneMinutes}s`;
        this.oneMinutes--;
        if (this.oneMinutes <= 0) {
          this.btnText = 'verification';
          this.oneMinutes = 60;
          this.disabled = false;
          clearInterval(this.timer);
        }
      }, 1000), //
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
    verification(){
      if (this.account===''){
        this.acerr=true
      }



      this.$api.get(
        '/code/'+ (this.type? "mail":"tel"),
        {
          params:{
            account:this.account,
            type:0
          }
        }
      ).then(
        res=>{
          if (res.data.code===200){
            this.oneMinutes = 60;
            this.disabled = true;
            if (this.timer!==null){
              clearInterval(this.timer)
            }
            this.timer = setInterval(() => {
              this.btnText = `${this.oneMinutes}s`;
              this.oneMinutes--;
              if (this.oneMinutes <= 0) {
                this.btnText = 'verification';
                this.oneMinutes = 60;
                this.disabled = false;
                clearInterval(this.timer);
              }
            }, 1000)
            this.$store.dispatch("example/actTimerUp",this.oneMinutes)

            this.$q.notify(
              {
                message:"verification has been sent",
                type:'positive',
                position:'top'
              }
            )

          }
        }
      )
    },
    show () {
      this.$refs.dialog.show()
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
      if (this.code===''){
        this.acerr=true
        return;
      }
      if(this.nickname===''||this.password===""||this.account===""){

        return;
      }else if (this.type&&!this.account.match(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)){

        return;}

    this.$api.post(
      '/user',{},
      {params:{
        userName: this.nickname,
        password:this.password,
        userRole: 'common',
          account: this.account,
          code:this.code,
        userSex: this.sex}
      }).then(res=>{
        if (res.data.code===200){
          this.$q.dialog({
            message:"Sign up successfully!!!",
            cancel:true,
            ok:true,
            color:'secondary'
          })

          this.$emit('ok')
          // 然后隐藏对话框
          this.hide()
        }
    })
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
