<template>
  <q-card class="row q-ma-sm"  >

    <q-img   :src="'http://localhost:8081/bookInfo/img/'+bookdata.bookId"
             :ratio="9/12"
    class="q-ma-lg col-4" ></q-img>
    <div class="column col-7">
      <p class="col-2">
    <span class="q-ma-lg text-weight-bolder" style="font-size: 45px"> {{bookdata.bookName}}</span>
      <span class="text-grey">Auther:{{bookdata.autherName}} </span>
      </p>
    <div  class="row col-1" style="width: 100%;font-size: 10px">
      <div class="col text-grey">
        Category:{{bookdata.categoryName}}
      </div>

      <div class="col text-grey"> Book status:{{bookdata.bookStatus===0? "cun":"over"}}</div>

      <div class="col text-grey">
        Visit Count:{{bookdata.visitCount}}
      </div>


      <div class="col text-grey">
        Word Count:{{bookdata.wordCount}}

      </div>


        </div>
      <q-separator></q-separator>
      <div class="col-4 q-ma-md" style="font-size: 15px">
      {{bookdata.bookDescp}}
      </div>
      <q-separator></q-separator>

      <div class="col" style="margin-bottom: 20px">
        <q-btn rounded style="width: 180px" @click="content(-1)" class="bg-secondary q-ma-md">Read</q-btn>
        <q-btn rounded style="width: 180px" class= "q-ma-md" @click="collect()">
          {{co===null? 'Collect':'Delete'}}
        </q-btn>

      </div>

    </div>

  </q-card>

  <q-card class="column q-ma-sm"  >
<div class="row text-black text-h6 text-weight-bolder q-ma-md">New Chapter <div class="text-grey" style="font-size: 5px">({{total}} chapter)</div>
<q-space/>

  <q-btn @click="getAll">all chapter</q-btn>

</div>
    <q-separator class="bg-grey-10"></q-separator>
    <ul>
      <q-item clickable v-for="item in chapdata" :key="item.id" @click="content(item.id)">
{{item.chapterName}}<q-space/><div class="text-grey" style="font-size: 5px">updata Time : {{item.createTime}}</div>
      </q-item>
    </ul>



  </q-card>


  <q-card v-if="allchapdata!==null" class="column q-ma-sm"  >
    <div class="row text-black text-h6 text-weight-bolder q-ma-md">All Chapter <div class="text-grey" style="font-size: 5px">({{total}} chapter)</div>

    </div>
    <q-separator class="bg-grey-10"></q-separator>
    <ul class="row">
      <q-item class="col-4" clickable v-for="item in allchapdata" :key="item.id" @click="content(item.id)">
        {{item.chapterName}}
      </q-item>
    </ul>



  </q-card>



  <q-drawer width="150" show-if-above  side="left">
    <!-- drawer content -->
  </q-drawer>

  <q-drawer width="150" show-if-above  side="right">
    <!-- drawer content -->
  </q-drawer>
</template>

<script>
import Router from "src/router/index";
import {reactive, ref, toRefs,onBeforeMount,computed} from "vue";
import {api} from "boot/axios";
import {useStore} from "vuex";
import {checkCollection,getCollection} from "src/utils/utils";
import {useQuasar} from "quasar";

export default {
  name: "BookDescp",
   setup() {
    const bookId = Router.currentRoute.value.params.id
    const book = reactive({bookdata: {}})
    const chapter = reactive({chapdata: [], total: 0})
    const allchapter = reactive({allchapdata: null, total2: 0})
    const collec = reactive({list: []})
    const store = useStore();
    const q=useQuasar()

    onBeforeMount(async()=>{
      collec.list = await getCollection()
    })

     const co=computed(()=>{
       console.log("conput")
       return checkCollection(book.bookdata.bookId,collec.list)
     })

      api.put(
        '/bookInfo',
        {},
        {
          params: {
            visitCount: 1,
            bookId: bookId

          }
        }
      )



    api.get(
      '/bookInfo/' + bookId
    ).then(
      res => {
        if (res.data.code === 200) {
          console.log(res.data)
          book.bookdata = res.data.data
        }
      })
    api.post(
      'bookChapter/all/' + bookId
      , {
        page: 1,
        size: 5,
        order: 'desc'
      }
    ).then(res => {
      if (res.data.code === 200) {
        console.log(res.data.data.list)
        chapter.chapdata = res.data.data.list
        chapter.total = res.data.data.total
      }
    })
    return {
      ...toRefs(chapter),
      ...toRefs(book),
      ...toRefs(allchapter),
      ...toRefs(collec),
      co,
      q,
      content(val) {
        Router.push(
          '/read/' + val + '/' + bookId
        )

      },
      getAll() {
        api.post(
          'bookChapter/all/' + bookId
          , {
            order: 'asc'
          }
        ).then(res => {
          if (res.data.code === 200) {
            console.log(res.data.data.list)
            allchapter.allchapdata = res.data.data.list
            allchapter.total2 = res.data.data.total
          }
        })

      },
      collect() {
        if(store.getters["example/getLoginUser"]===null){
          this.q.notify({
            message:"please login firstly",
            type:'negative',
            position:'top'
          })
          return;
        }

        let id = checkCollection(book.bookdata.bookId, collec.list)
        if (id !== null) {
          api.delete(
            '/userBookShelf',
            {
              params: {
                id: id,
                bookId:bookId
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
                bookId: bookId,
                userId: store.getters["example/getLoginUser"].userId
              }
            }
          ).then(async res => {
            if (res.data.code === 200) {
              collec.list = await getCollection();
            }
          })
        }


      }

    }
  }
}
</script>

<style scoped>

</style>
