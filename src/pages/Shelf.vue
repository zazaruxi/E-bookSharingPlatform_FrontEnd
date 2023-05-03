<template>

  <div>
<div>
  <q-tabs
    v-model="tab"
    class="bg-white text-secondary shadow-2"
  >
    <q-space/>
    My Book Shelf
    <q-space/>
    <q-tab name="keypad" icon="eva-keypad-outline" />
    <q-tab name="list" icon="eva-list-outline" />


  </q-tabs>
</div>
    <div v-if="tab=='keypad'" class="row">
<div v-for="item in list" :key="item.bookId" class="col-3">
      <q-card  class="shadow-4  q-ma-md" :ratio="9/12" @click="read(item)">
        <q-img  :ratio="9/11" :src="'http://localhost:8081/bookInfo/img/'+item.bookId"
                  ></q-img>

      </q-card>
  <p class="text-center text-grey text-weight-bold" style="font-size: 20px">{{item.bookName}}</p>

    </div>
    </div>
    <div v-if="tab=='list'" class="column q-ma-lg">
      <q-card @click="read(item)" style="width: 100%" v-for="item in list" :key="item.bookId" class="row">
        <div style="width: 20px"></div>
        <q-img style="min-width: 100px;width: 110px" class="q-ma-sm" :ratio="9/11"  :src="'http://localhost:8081/bookInfo/img/'+item.bookId"
        ></q-img>
        <div class="col-1"></div>
        <div class="col column">
          <p class="col text-weight-bolder q-ma-sm" style="font-size: 30px">{{item.bookName}}
          </p>
          <p class="col text-grey-5 q-ma-sm" style="font-size: 15px">Author：{{item.authorName}}<br/> Word Count: {{wordtran(item.wordCount)}}</p>
          <p class="col text-grey-5 q-ma-sm" style="font-size: 15px">Newest Chapter: {{item.lastChapterName}}</p>

        </div>
    <div>
      <q-item clickable @click.stop>
<q-icon name="eva-menu-outline" size="20px">

</q-icon>
        <q-popup-proxy >
          <q-card>
            <q-item clickable @click="collect(item)">
              Delete
            </q-item >
            <q-item clickable @click="goto(item)">
            More Info
            </q-item>
          </q-card>
        </q-popup-proxy>
      </q-item>
    </div>

      </q-card>
    </div>
  </div>
  <q-drawer width="300" show-if-above  side="left">
    <!-- drawer content -->
  </q-drawer>

  <q-drawer width="300" show-if-above  side="right">
    <!-- drawer content -->
  </q-drawer>

</template>

<script>
import Router from "src/router/index";
import {reactive, ref, toRefs,onBeforeMount,computed} from "vue";
import {api} from "boot/axios";
import {useStore} from "vuex";
import {checkCollection,getCollection,wordtran} from "src/utils/utils";
export default {
  name: "Shelf",
  setup(){
    const book=reactive({list:[]})
    const store = useStore();
    api.get(
      '/userBookShelf/bookInfo/'+store.getters["example/getLoginUser"].userId
    ).then(res=>{
      if(res.data.code===200){
        book.list=res.data.data
      }
    })



    return{

      tab: ref('list'),
      ...toRefs(book),
      read(val){
        Router.push(
          '/read/'+(-1)+'/'+val.bookId
        )

      },
      async collect(val) {
        let id=checkCollection(val.bookId, await getCollection())
        console.log(id)
        api.delete(
          '/userBookShelf',
          {
            params: {
              id: id,
              bookId: val.bookid
            }
          }
        ).then(res => {
          if (res.data.code === 200) {
            api.get(
              '/userBookShelf/bookInfo/' + store.getters["example/getLoginUser"].userId
            ).then(res => {
              if (res.data.code === 200) {
                book.list = res.data.data
              }
            })
          }
        })
      },
      goto(val){
Router.push(
  '/bookDescp/'+val.bookId
)
      },
      wordtran
    }
  }
}
</script>

<style scoped>

</style>
