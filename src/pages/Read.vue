<template>
  <div>
  <q-page-sticky position="top-left" style="z-index: 9999" :offset="[-100, 71]">
    <q-card  class="column q-ma-sm" style="width: 50px;float: right">
      <q-item clickable style="height: 50px;width: 50px" @click="getChapter">
        <q-icon size="20px" name="eva-list-outline"></q-icon>
        <q-popup-proxy style="z-index: 9999" @show="scoll">
          <q-card style="width: 400px;">
            <q-item
              :class="item.id== chapterid? 'text-orange':''"
              :id="item.id== chapterid? 'on':''"


              clickable v-for="item in chapdata" :key="item.id" @click="content(item.id)"
            >
              {{item.chapterName}}

            </q-item>
          </q-card>
        </q-popup-proxy>
      </q-item>
      <q-item @click="collect()" clickable style="height: 50px;width: 50px">
        <q-icon v-if="!co" size="20px" name="eva-bookmark-outline"></q-icon>

        <q-icon v-if="co" size="20px" name="eva-bookmark"></q-icon>
      </q-item>
      <q-item clickable style="height: 50px;width: 50px" @click="Routeto()">
        <q-icon size="20px" name="eva-message-circle-outline"></q-icon>

      </q-item>
      <q-item clickable style="height: 50px;width: 50px" @click="toggle()">
        <q-icon size="20px" :name="!q.dark.isActive? 'eva-moon-outline':'eva-sun-outline'"></q-icon>

      </q-item>
      <q-item clickable style="height: 50px;width: 50px" >
        <q-icon name="eva-settings-2-outline" size="20px" >
        </q-icon>

        <q-popup-proxy style="z-index: 9999">
          <q-card class="column" style="width: 400px;height: 200px">
            <p class="text-center text-weight-bolder">Background Color</p>
            <div class="row">
              <q-space/>
              <q-item clickable @click="changeClass('st1')">
                <q-avatar size="30px" class="st1 shadow-4"  ></q-avatar>
              </q-item>
              <q-item clickable @click="changeClass('st2')">
                <q-avatar size="30px" class="st2 shadow-4" ></q-avatar>
              </q-item>
              <q-item clickable @click="changeClass('st3')">
                <q-avatar size="30px" class="st3 shadow-4"></q-avatar>
              </q-item>
              <q-item clickable @click="changeClass('st4')">
                <q-avatar size="30px" class="st4 shadow-4" ></q-avatar>
              </q-item>
              <q-item clickable @click="changeClass('st5')">
                <q-avatar size="30px" class="st5 shadow-4" ></q-avatar>
              </q-item>
              <q-item clickable @click="changeClass('st6')">
                <q-avatar size="30px" class="st6 shadow-4" ></q-avatar>
              </q-item>
              <q-space/>
            </div>

<p class="text-center row q-mt-lg">
  <q-space/>
<span class="q-mt-sm text-weight-bolder">Font size:</span>
            <q-btn rounded @click="()=>{if(fontsize>20) changeSize(-1)}">-</q-btn>
            <input :value="fontsize" readonly style="border: 0;width: 30px">
            <q-btn rounded @click="()=>{if(fontsize<40)changeSize(1)}">+</q-btn>
  <q-space/>

</p>
          </q-card>
        </q-popup-proxy>
      </q-item>
    </q-card>
  </q-page-sticky>
  <q-card>

<div
:style="'font-size:'+fontsize+'px'"

:class="!q.dark.isActive? defclass:''"
class="q-pa-md"
>
  <p
    :style="'font-size:'+(fontsize+10)+'px'"

    class="text-weight-bolder text-center q-ma-lg"
  >{{data2.chapterName}}</p>
<p style="font-size: 10px;margin: 0" class="text-center row text-grey-7">
  <q-space/>Book: {{data3.bookName}}<q-space/>
  Category: {{data3.categoryName}}<q-space/>
  Time: {{data.createTime}}<q-space/>
  Author: {{data3.authorName}}<q-space/>
</p>
  <q-separator  class="bg-grey-5 q-ma-xl" >
  </q-separator>

  <p v-for="con in data.chapterContent" >
    {{con}}
  </p>
  <q-separator  class="bg-grey-5 q-ma-xl" >
  </q-separator>
<div class="text-center">
  <q-btn @click="goto(-1)">Last chapter</q-btn>
  <q-btn @click="goto(1)">next chapter</q-btn>

</div>
</div>

  </q-card>
  <q-drawer width="200" show-if-above  side="left">
    <!-- drawer content -->

  </q-drawer>

  <q-drawer width="200" show-if-above  side="right">
    <!-- drawer content -->
  </q-drawer>
  </div>
</template>

<script>
import '/src/css/Book.css'
import {reactive, toRefs, onMounted, ref, watch, onBeforeMount, computed} from "vue";
import {api} from "boot/axios";
import {useStore} from 'vuex'
import Router from "src/router/index";
import {useQuasar} from "quasar";
import {LocalStorage} from "quasar";
import {checkCollection, getCollection} from "src/utils/utils";

export default {
  name: "Read",
  setup(){
    const content=reactive({data:{}})
    const chapter=reactive({data2:{},chapdata:[],total:0})
    const book=reactive({data3:{}})
    const q=useQuasar();
    const bookid=Router.currentRoute.value.params.bookid
    const chapterid=ref(Router.currentRoute.value.params.chapterid)
    const on=ref(null)
    const collec = reactive({list: []})
    const set=reactive({fontsize:25,defclass:'st1'})
    const store=useStore()
    onBeforeMount(async()=>{
      collec.list = await getCollection()
    })

    const co=computed(()=>{
      console.log("conput")
      return checkCollection(bookid,collec.list)
    })
    if(LocalStorage.getItem('set')!==null
      &&LocalStorage.getItem('set')!==undefined
      &&LocalStorage.getItem('set')!==''){
      set.fontsize=LocalStorage.getItem('set').fontsize;
      set.defclass=LocalStorage.getItem('set').defclass;
    }

    const getinfo = () => {
      q.loading.show({
        message: 'Waiting'
      })

      if(chapterid.value==-1){
              api.get(
                '/chapterContent/continue/'+bookid
              ).then(res=>{
                if(res.data.code===200){
                  Router.replace(
                    '/read/'+res.data.data.chapterId+'/'+bookid
                  )
                  content.data=res.data.data;
                  content.data.chapterContent= content.data.chapterContent.split('\r\n');
                  content.data.chapterContent[0]=null;
                  chapterid.value=res.data.data.chapterId
                  api.get(
                    '/bookChapter/' +  chapterid.value
                  ).then(res => {
                    if (res.data.code === 200) {
                      chapter.data2=res.data.data
                    }
                  })
                  q.loading.hide()
                }
              })


      }else {
        api.get(
          '/chapterContent/'+chapterid.value+'/'+bookid
        ).then(res=>{
          if(res.data.code===200){
            content.data=res.data.data;
            content.data.chapterContent= content.data.chapterContent.split('\r\n');
            content.data.chapterContent[0]=null;
            api.get(
              '/bookChapter/' + chapterid.value
            ).then(res => {
              if (res.data.code === 200) {
                chapter.data2=res.data.data
              }
            })
            q.loading.hide()
          }
        })
      }
      api.get(
        '/bookInfo/'+bookid
      ).then(
        res=>{
          if(res.data.code===200){
            book.data3=res.data.data
          }
        })
    }


    getinfo()

    const toggle = () => {
      q.dark.toggle()
    }
    return{
      ...toRefs(content),
      ...toRefs(chapter),
      ...toRefs(book),
      ...toRefs(set),
      bookid,
      chapterid,
      on,
      co,
      q,
      toggle,
      scoll(){
        document.getElementById('on').scrollIntoView({
          behavior: 'auto',
          block: 'center',
          inline: 'nearest'
        })
      },
      content(val){

        Router.push(
          '/read/'+val+'/'+bookid
        )
        chapterid.value=val;
        getinfo()
      },
      getChapter(){
        api.post(
          'bookChapter/all/' + Router.currentRoute.value.params.bookid
          , {
            order:'asc'
          }
        ).then(res => {
          if (res.data.code === 200) {
            chapter.chapdata = res.data.data.list
            chapter.total = res.data.data.total
          }
        })
      },
      changeClass(val){
        set.defclass=val;
        LocalStorage.set('set',set)
      },
      changeSize(val){
        set.fontsize=set.fontsize+val;
        LocalStorage.set('set',set)

      },
      collect() {
        let id = checkCollection(bookid, collec.list)
        if (id !== null) {
          api.delete(
            '/userBookShelf',
            {
              params: {
                id: id,
                bookId:bookid
              }
            }
          ).then(async res => {
            if (res.data.code === 200) {
              collec.list = await getCollection();
            }
          })

        } else {
          api.post(
            '/userBookShelf',
            {},
            {
              params: {
                bookId: bookid,
                userId: store.getters["example/getLoginUser"].userId
              }
            }
          ).then(async res => {
            if (res.data.code === 200) {
              collec.list = await getCollection();
            }
          })
        }


      },
      goto(val){
        api.get(
          '/chapterContent/near/'+bookid+'/'+chapter.data2.chapterNum+'/'+val
        ).then(res=>{
          if(res.data.code===200){
            Router.push(
              '/read/'+res.data.data.chapterId+'/'+bookid
            )
            content.data=res.data.data;
            content.data.chapterContent= content.data.chapterContent.split('\r\n');
            content.data.chapterContent[0]=null;
            chapterid.value=res.data.data.chapterId
            api.get(
              '/bookChapter/' +  chapterid.value
            ).then(res => {
              if (res.data.code === 200) {
                chapter.data2=res.data.data
              }
            })
            q.loading.hide()
          }
        })
      },
      Routeto(){
        Router.push(
          '/comments/'+bookid
        )
      },
    }

  }
}
</script>

<style scoped>
.body--dark {
  /* ... */
}
.st1{
  background-color: #FFFFFF;
  color: #1D1D1D;
}
.st2{
  background-color: #FAF9DE ;
  color: #1D1D1D;
}
.st3{
  background-color: #FDE6E0  ;
  color: #1D1D1D;
}
.st4{
  background-color: #E3EDCD ;
  color: #1D1D1D;
}
.st5{
  background-color: #DCE2F1 ;
  color: #1D1D1D;
}
.st6{
  background-color: #EAEAEF ;
  color: #1D1D1D;
}

</style>
