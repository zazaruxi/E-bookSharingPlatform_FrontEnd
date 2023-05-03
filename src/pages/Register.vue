<template>
  <q-page-container>
    <q-page
    style="width: 100%;"
    class="row">
      <div class="col">

      </div>
      <q-card
        tag="form"
        style="height: 400px"

        class="my-card col-6"
      >
        <q-card-actions
          align="center"
        >
          <h6 style="margin: auto">Register as a author</h6>
        </q-card-actions>
        <q-card-actions
          class="column"
          align="center"
        >
            <q-input
              color="teal"
              outlined
              v-model="uid"
              :error-message="message"
              :error="err"
              bottom-slots
              label="ID number"
              mask="######-########-####"
              unmasked-value
              style="width: 300px;"
              >
            </q-input>
            <br>
            <q-input
              color="teal"
              v-model="name"
              outlined
              label="Name"
              style="width: 300px;"

            >

            </q-input>
            <br>

            <q-btn
              color="secondary"
              label="Register"
              class="btu"
              @click="submit()"
            >
            </q-btn>
        </q-card-actions>

        <q-card-section style="font-size: 2px" class="text-grey-5">
免责声明：

        </q-card-section>
      </q-card>
      <div class="col">

      </div>
    </q-page>



  </q-page-container>
</template>

<script>
import {reactive, toRefs, onMounted, ref, watch, onBeforeMount, computed} from "vue";
import {api} from "boot/axios";
import {useStore} from 'vuex'
import Router from "src/router/index";
import {useQuasar} from "quasar";
import {LocalStorage} from "quasar";
import {checkCollection, getCollection} from "src/utils/utils";
export default {
  name: "Register",
  setup(){
    const uid=ref('')
    const name=ref('')
    const message=ref('Not Match')
    const err=ref(false)
    const q=useQuasar()
    const store=useStore()

    return{
      uid,
      name,
      message,
      err,
      submit(){
        if(uid.value.length!==18&&name.value===''){
          message.value='Not Null'
          err.value=true
          return
        }



        api.get(
          'https://idcardv2.shumaidata.com/new-idcard',
          {params:{
            idcard:uid.value,
              name:name.value
            }},
        ).then(res=>{
          if(res.data.code===200&&res.data.data.result===0){
            api.put(
              'user/common',
              {},
              {params:{
                  userId:store.getters["example/getLoginUser"].userId,
                  userRole:'author'
                }}
            ).then(res=>{
                if(res.data.code===200){
                  store.commit('example/setLoginUser',res.data.data)
                  Router.push(
                    '/author'
                  )
                }
              }
            )



          }else {
            message.value='Not Match'
            error.value=true
          }
        }
        ).catch(e=>{
          message.value='Not Match'
          err.value=true

        })

      }
    }
  }
}
</script>

<style scoped>
q-input{
  min-width: 400px;
}
</style>
