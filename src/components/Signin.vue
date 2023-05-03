<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="text-center text-teal text-weight-bolder text-h6">
        Sign In
      </q-card-section>
      <q-card-section class="text-center">
        <p >
          <q-icon size="xs" color="secondary" name="phone"></q-icon>
          <q-toggle  size="sm" v-model="type"  />
          <q-icon size="xs" color="secondary" name="email"></q-icon>
        </p>

        <q-input
          class="q-ma-lg text-h6"
                 v-model="account"
                 filled
          error-message="account or password is wrong"
          :error="err"
          lazy-rules
          label="account"
          hint="Email or Telephone number" />



        <q-input class="q-ma-lg text-h6"
                 v-if="!type"

                 v-model="password" filled :type="isPwd ? 'password' : 'text'" hint="Password with toggle">

          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-input
          class="q-ma-lg text-h6"
          v-if="type"
          v-model="code"
          mask="# # # # # #"
          filled
          unmasked-value
          label="verification"
          hint="verification" >
          <template v-slot:after>
            <q-btn @click="verification()" color="secondary" :disable="disabled" :label="btnText">
            </q-btn>
          </template>
        </q-input>
        <q-checkbox color="secondary" v-model="rem" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" label="Remember me" />

      </q-card-section>
      <q-card-actions align="center">
        <q-btn class="q-ma-lg" color="secondary" label="Sign in" @click="onOKClick" />
        <q-btn class="q-ma-lg" color="secondary" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "Signin",
  data(){
    return{
     account:'',
     isPwd:true,
     password:'',
      type:false,
      err:false,
      rem: false,
      code:'',
      error:true,
      btnText: this.$store.getters["example/getTimerIn"]===1? 'verification':this.$store.getters["example/getTimerIn"]+ 's',
      disabled: this.$store.getters["example/getTimerIn"]!==1, // 不禁用
      oneMinutes: this.$store.getters["example/getTimerIn"]===1?0:this.$store.getters["example/getTimerIn"], // 倒计时
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
      if (this.account===''||this.code===''){
        this.acerr=true
      }

      this.$api.get(
        '/code/'+ (this.account.endsWith(".com")? "mail":"tel"),
        {
          params:{
            account:this.account,
            type:1
          }
        }
      ).then(
        res=>{
          if (res.data.code===200){
            this.oneMinutes = 60;
            this.disabled = true;
            this.timer = setInterval(() => {
              this.btnText = `${this.oneMinutes} s`;
              this.oneMinutes--;
              if (this.oneMinutes <= 0) {
                this.btnText = 'verification';
                this.oneMinutes = 60;
                this.disabled = false;
                clearInterval(this.timer);
              }
            }, 1000)
            this.$store.dispatch("example/actTimerIn",this.timer)
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
      if (this.type){
        this.$api.post(
          '/user/login/code',
          {},
          {params:{
              account:this.account,
              code:this.code
            }}
        ).then(res=>{
          if (res.data.code===200){
            if (this.rem){
              this.$store.commit('example/setTokenLocal',res.data.data)
            }else {
              this.$store.commit('example/setTokenLocal',null)
              this.$store.commit('example/setTokenSession',res.data.data)
            }
            this.$emit('ok')
            // 或带有有效负载：this.$emit('ok', { ... })
            // 然后隐藏对话框
            this.hide()
          }


        })

      }else {
        this.$api.post(
          '/login',
          {},
          {params:{
              username:this.account,
              password:this.password
            }}
        ).then(res=>{
          console.log(res)
          if (res.data.code===200){
            if (this.rem){
              this.$store.commit('example/setTokenLocal',res.data.data)
            }else {
              this.$store.commit('example/setTokenLocal',null)
              this.$store.commit('example/setTokenSession',res.data.data)
            }
            this.$emit('ok')
            // 或带有有效负载：this.$emit('ok', { ... })
            // 然后隐藏对话框
            this.hide()
          }


        })

      }







    },

    onCancelClick () {
      // 我们只需要隐藏对话框
      this.hide()
    }
  },
  beforeDestroy() {
  }
}
</script>

<style scoped>

</style>
