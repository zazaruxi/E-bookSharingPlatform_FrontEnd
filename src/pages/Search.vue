<template>

  <div class="channelWrap classTable cf shadow-4">
  </div>
  <q-table
    class="my-sticky-dynamic  shadow-4 q-ma-md"
    title="Books"
    :columns="columns"
    :loading="loading"
    hide-bottom
    :rows="data"
    row-key="index"
    virtual-scroll
    :virtual-scroll-item-size="48"
    :virtual-scroll-sticky-size-start="48"
    :pagination="pagination"
    :rows-per-page-options="[0]"
    @virtual-scroll="onScroll"
  >
    <template v-slot:body="props">
      <q-tr @click="detail(props.row)" :props="props" class="def-tr" style="min-width: 950px">
        <q-td  :key="props.row.bookId" style="width: 150px">
          <q-img class="q-ma-md" :ratio="3/4" width="110px" :src="'http://localhost:8081/bookInfo/img/'+props.row.bookId"></q-img>
        </q-td>
        <q-td key="Name"  :props="props">
          {{props.row.bookName}}
        </q-td>

        <q-td key="Type" :props="props">
          {{props.row.categoryName}}
        </q-td>


        <q-td key="Author" :props="props">
          {{props.row.authorName ? props.row.authorName:'---'}}
        </q-td>
        <q-td key="visitCount" :props="props">
          {{props.row.visitCount ? props.row.visitCount:0}}
        </q-td>
        <q-td  key="wordCount" style="min-width: 150px; width:150px;text-align: center" :props="props">
          {{props.row.wordCount ? wordtran(props.row.wordCount):0}}
        </q-td>
        <q-td  key="BookStatus" :props="props">
          {{props.row.bookStatus===0 ? 'updating':'over'}}
        </q-td>
        <!--          -->

      </q-tr>
    </template>


  </q-table>
  <q-drawer width="150" show-if-above  side="left">
    <!-- drawer content -->
  </q-drawer>

  <q-drawer width="150" show-if-above  side="right">
    <!-- drawer content -->
  </q-drawer>

</template>

<script>
import '/src/css/Book.css'
import { reactive, toRefs, onMounted, ref } from "vue";
import {api} from "boot/axios";
import {useStore} from 'vuex'
import Router from "src/router";
import {useQuasar} from "quasar";
import {wordtran} from "src/utils/utils";

const columns = [
  { name: 'Cover',
    style: 'min-width: 50px; width: 60px',
    align: 'center',
    label: 'Cover',
    required: true,
    field: 'bookId' },
  { name: 'Name',  align: 'center',label: 'Name', field: 'bookName' },
  { name: 'Type', align: 'center', label: 'Type', field: 'categoryName' },
  { name: 'Author', align: 'center', label: 'Author', field: 'authorName'},
  { name: 'visitCount', align: 'center', label: 'Visit Count', field: 'visitCount'},
  { name: 'wordCount', align: 'center', label: 'Word Count', field: 'wordCount'},
  { name: 'BookStatus', align: 'center', label: 'Book Status', field: 'bookStatus'},

]

export default {

  name: "Search",
  setup(){
    const book=reactive({data:[]})
    const q=useQuasar();
    var loading=ref(false);
    var pagination= { rowsPerPage: 0 }

    const page=ref(0);
    const size=ref(10);
    const text=ref(Router.currentRoute.value.query.search)
    const loadbook = () => {
      q.loading.show({
        message:'Waiting...'
      })
      api.post(
        '/bookInfo/search',
        {
        },
        {params:{
          size:size.value,
            page:page.value,
            order:text.value
          }
        }
      ).then(
        res=>{
          console.log(res.data)
          if(res.data.code===200){
            book.data=res.data.data
          }
          q.loading.hide()
        }

      )


    }
    loadbook()
    return {
      ...toRefs(book),
      columns,
      loading,
      pagination,
      wordtran,
      detail(val){
        Router.push(
          '/bookDescp/'+val.bookId,
        )
      }

    }
  }

}
</script>

<style scoped>

</style>
