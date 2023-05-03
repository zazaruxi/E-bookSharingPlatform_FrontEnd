<template>
  <q-table
    class="my-sticky-dynamic  shadow-4 q-ma-lg"
    title="Books"
    :columns="columns"
    hide-bottom
    :rows="data"
    row-key="Cover"
    wrap-cells
    :filter="filter"
  >

    <template v-slot:top>
      <q-btn class="q-ml-sm text-white bg-secondary" label="Create new book" @click="create()" />
      <q-space />
      <h6 style="margin: 0;">Fiction management</h6>
      <q-space />
      <q-input label="Search" borderless dense debounce="300" color="secondary" v-model="filter">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>

    <template v-slot:body="props">
      <q-tr :props="props" class="def-tr">
        <q-td  key="Cover" style="width: 150px">
          <q-img class="q-ma-md" :ratio="3/4" width="110px" :src="'http://localhost:8081/bookInfo/img/'+props.row.bookId"></q-img>
        </q-td>
        <q-td key="bookName"  :props="props">
          {{props.row.bookName}}
        </q-td>

        <q-td key="categoryName" :props="props">
          {{props.row.categoryName}}
        </q-td>
        <q-td  key="lastChapterName" :props="props">
          {{props.row.lastChapterName ? props.row.lastChapterName:'---'}}
        </q-td>

        <q-td key="authorName" :props="props">
          {{props.row.authorName ? props.row.authorName:'---'}}
        </q-td>
        <q-td key="visitCount" :props="props">
          {{props.row.visitCount ? props.row.visitCount:0}}
        </q-td>
        <q-td  key="wordCount" style="min-width: 150px; width:150px;text-align: center" :props="props">
          {{props.row.wordCount ? props.row.wordCount:0}}
        </q-td>
        <q-td class="text-center"  key="btn" :props="props">
         <q-btn icon="menu" @click.stop size="15px" flat>
           <q-popup-proxy>
             <q-item clickable class="item"   @click="edit(props.row)">Edit</q-item>
<q-separator/>
             <q-item clickable class="item"  >Write
               <q-popup-proxy :ref="popup">
                 <q-file
                   class="q-ma-lg"
                   filled
                   accept=".txt"
                   outlined v-model="file"
                   label="file should follow the format">
                   <template v-slot:before>
                     <span style="font-size: 15px">select file</span>
                   </template>
                   <template v-slot:prepend>
                     <q-icon  name="attach_file" />
                   </template>
                 </q-file>
                 <q-btn class="q-ma-md bg-secondary" @click="upload(props.row)" icon="upload" label="Upload"></q-btn>
               </q-popup-proxy>
             </q-item>
             <q-separator/>

             <q-item  clickable class="item " @click="chapter(props.row)">Chapter</q-item>
             <q-separator/>

             <q-item :disable="props.row.bookStatus==1"  clickable class="item"  @click="finish(props.row)">Finish</q-item>
             <q-separator/>

             <q-item clickable class="item  bg-red-6"  @click="del(props.row.bookId)">Delete</q-item>
           </q-popup-proxy>
         </q-btn>

        </q-td>

        <!--          -->

      </q-tr>
    </template>
  </q-table>
<q-card class="q-ma-xl">


</q-card>

</template>

<script>
import '/src/css/Book.css'
import { reactive, toRefs, onMounted, ref } from "vue";
import {api} from "boot/axios";
import {useStore} from 'vuex'
import CreateBook from "components/CreateBook";
import {useQuasar} from "quasar";
import EditBook from "components/EditBook";
import Chapter from "components/Chapter";

const columns = [
  { name: 'Cover',
    align: 'center',
    label: 'Cover',
    required: true,
    field: 'bookId' },
  { name: 'bookName',  align: 'center',label: 'Name', field: 'bookName' },
  { name: 'categoryName', style: 'min-width: 70px; width: 70px', align: 'center', label: 'Type', field: 'categoryName' },
  { name: 'lastChapterName', label: 'New Chapter',align: 'center', field: 'lastChapterName' },
  { name: 'authorName', align: 'center', label: 'Author', field: 'authorName'},
  { name: 'visitCount', align: 'center', label: 'Visit Count', field: 'visitCount'},
  { name: 'wordCount', align: 'center', label: 'Word Count', field: 'wordCount'},
  { name: 'btn'},

]
export default {

  name: "Author",
  setup(){
const filter=ref('')
    const store=useStore();
    const q = useQuasar();
    const updata=reactive({file:null})
    const popup=ref(null);
const obj=reactive({data:[]})
api.get(
  'bookInfo/author/'+store.getters["example/getLoginUser"].userId,
).then(res=>{
  console.log(res.data.data)
  obj.data=res.data.data
})
    const upload = (val) => {
      let data = new FormData
      data.append("bookId",val.bookId)
      data.append("file",updata.file)

      api.post(
        '/bookChapter',data).then(res=>{
        if(res.data.code===200){
          updata.file=null
          q.notify(
            {
              message:'success',
              type:'positive',
              position:'top'
            }
          )

        }else{
          q.notify(
            {
              message:'Fail',
              type:'negative',
              position:'top'
            }
          )
        }

      }).catch((e)=>{
        q.notify(
          {
            message:'Fail',
            type:'negative',
            position:'top'
          }
        )
      })


    }
    const create = () => {
        q.dialog({
          // persistent: true, // we want the user to not be able to close it
          // ok: false, // we want the user to not be able to close it
          component: CreateBook,
          componentProps: {}
        }).onOk(() => {
          api.get(
            'bookInfo/author/'+store.getters["example/getLoginUser"].userId,
          ).then(res=>{
            obj.data=res.data.data

          })

        }).onCancel(() => {


        }).onDismiss(() => {
        })
      }
      const edit = (val) => {
        q.dialog({
          // persistent: true, // we want the user to not be able to close it
          // ok: false, // we want the user to not be able to close it
          component: EditBook,
          componentProps: {
            val:val
          }
        }).onOk(() => {
          api.get(
            'bookInfo/author/'+store.getters["example/getLoginUser"].userId,
          ).then(res=>{
            obj.data=res.data.data

          })

        }).onCancel(() => {


        }).onDismiss(() => {
        })
      }
const chapter = (val) => {
  q.dialog({
    // persistent: true, // we want the user to not be able to close it
    // ok: false, // we want the user to not be able to close it
    component: Chapter,
    componentProps: {
      id:val.bookId
    }
  }).onOk(() => {

  }).onCancel(() => {

  }).onDismiss(() => {
  })
}


    return{
      columns,
      filter,
      create,
      store,
      popup,
      edit,
      chapter,
      upload,
      ...toRefs(obj),
      ...toRefs(updata),
      finish(val){
        api.put(
          '/bookInfo',
          {},
          {params:{ bookId:val.bookId,
              bookStatus:1}

          }).then(res=>{
          if (res.data.code===200){
            api.get(
              'bookInfo/author/'+store.getters["example/getLoginUser"].userId,
            ).then(res=>{
              obj.data=res.data.data

            })
          }
        })
      },
      del(val){
        api.delete(
          'bookInfo',
          {params:{
            id:val
            }}
        )

      }
    }

  }


}
</script>

<style scoped>

</style>
