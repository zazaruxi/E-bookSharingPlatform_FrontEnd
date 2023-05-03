<template>
 <div>
  <q-layout view="hHh lPr fFf">

    <q-header reveal  :class="!q.dark.isActive ? 'bg-white text-black':'bg-black text-white'   " elevated height-hint="120">
      <q-toolbar class="row" style="height: 80px">
        <q-toolbar-title class="col-4">
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Title

        </q-toolbar-title>

        <q-input class="text-center col-4" color="secondary" rounded outlined v-model="text" label="Auther/books name/etc">
          <template v-slot:append>
            <q-icon v-if="text !== ''" name="close" @click.stop.prevent="text = ''" class="cursor-pointer" />
          </template>
          <template v-slot:after>
            <q-btn round dense class="text-secondary" @click="Search()" flat icon="send" />
          </template>
        </q-input>
<div v-if="!va" class="col text-right">
  <q-btn class="q-ma-lg" :ripple="{ center: true }" color="secondary" @click="signup()" label="Sign up" no-caps />
  <q-btn class="q-ma-lg" :ripple="{ center: true }" color="secondary" @click="signin()" label="Sign in" no-caps />
</div>
        <div v-if="va" class="row col-4" >
          <q-space></q-space>
<q-btn class="q-ma-md" icon="eva-book-outline" @click="shelf()" label="Book"></q-btn>
          <q-separator size="2px" class="bg-secondary q-ma-sm" vertical></q-separator>
            <q-btn style="margin-right: 0"
                   class="q-ma-md"
                   filled
                   @click="userInfo()"
                   :label="data!==undefined? data.userName:''"
                   icon="eva-person-outline" color="secondary">
            </q-btn>

          <q-btn class="q-ma-md" @click="logout">Log Out</q-btn>
        </div>

      </q-toolbar>

      <q-tabs align="left" class="bg-secondary">
        <q-route-tab to="/home" label="Home"/>|
        <q-route-tab to="/book" label="Classify"/>|
        <q-route-tab to="/rank" label="Rank"/>|
        <q-route-tab to="/author" label="Author"/>|
      </q-tabs>
    </q-header>



    <q-page-container>
      <router-view :key="key"/>
    </q-page-container>



  </q-layout>
 </div>
   <Footer></Footer>
</template>
<script>
import {ref, reactive, toRefs,computed} from "vue";
import { useQuasar } from 'quasar';
import Signin from "components/Signin";
import Signup from "components/Signup";
import {useStore} from 'vuex'
import {api} from "boot/axios";
import router from "src/router";
import Footer from "components/Footer";
import UserInfo from "components/UserInfo";
export default {


  name:'Mainpage'
,
  components: {Footer},
  setup() {
    const store = useStore();
    const q = useQuasar();
    const text = ref(router.currentRoute.value.query.search===undefined ? "":router.currentRoute.value.query.search)
    const login = reactive({va:false});
     const obj = reactive({data: {}});
     const collection=reactive({list:[]})
     const key=computed(()=>{
       return router.currentRoute.value.path+Math.random()
     })

     if (store.state.example.token !== undefined
      && store.state.example.token !== null
      && store.state.example.token !== ''
      && store.state.example.token !== "null") {
      api.get(
        '/user/info'
      ).then(res => {
        console.log(res.data.data)
        obj.data = res.data.data;
        store.commit('example/setLoginUser',res.data.data)
        login.va = true
      }).catch(()=>{

      })

    }

     const userInfo = () => {
       q.dialog({
         // persistent: true, // we want the user to not be able to close it
         // ok: false, // we want the user to not be able to close it
         component: UserInfo,
         componentProps: {}
       }).onOk(() => {
       }).onCancel(() => {
       }).onDismiss(() => {
       })
     }
    const signin = () => {
      q.dialog({
        // persistent: true, // we want the user to not be able to close it
        // ok: false, // we want the user to not be able to close it
        component: Signin,
        componentProps: {}
      }).onOk(() => {
        api.get(
          '/user/info'
        ).then(res => {
          obj.data = res.data.data;
          store.commit('example/setLoginUser',res.data.data)
          login.va=true
        }).catch(()=>{

        })
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    }
    const signup = () => {
      q.dialog({
        // persistent: true, // we want the user to not be able to close it
        // ok: false, // we want the user to not be able to close it
        component: Signup,
        componentProps: {}
      }).onOk(() => {

      }).onCancel(() => {
      }).onDismiss(() => {
      })
    }

    const logout = ()=>{

       api.get(
         '/logout'
       ).then(
         res=> {
           store.commit('example/setTokenSession', null);
           store.commit('example/setTokenLocal', null);
           sessionStorage.clear()
           login.va = false;
           router.push(
             '/home'
           )
         }
       )


     }
    return {
      ...toRefs(obj),
      ...toRefs(login),
      text,
      signup,
      signin,
      key,
      logout,
      userInfo,
      router,
      q,
      shelf(){
        router.push(
          '/shelf'
        )
      },
      Search(){
        router.push({
          name:'search',
          query:{
            search:text.value
          }
        })
      }}
  }



}

</script>
