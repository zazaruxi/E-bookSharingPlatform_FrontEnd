<template>
  <div style="min-width: 1000px">
  <q-table
    class="my-sticky-dynamic  shadow-4 q-ma-lg"
    title="Books"
    :columns="columns"
    :loading="loading"
    hide-bottom
    row-key="index"
    :rows="data"
    virtual-scroll
    :virtual-scroll-item-size="30"
    :virtual-scroll-sticky-size-start="30"
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

        <q-td key="Type" :props="props" class="text-grey-5">
          [{{props.row.categoryName}}]
        </q-td>
        <q-td  key="Status" :props="props">
          {{props.row.bookStatus==0 ? "Updating":'Finished'}}
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

        <!--          -->

      </q-tr>
    </template>

  </q-table>
  <q-drawer width="100" show-if-above  side="left">
    <!-- drawer content -->
  </q-drawer>

  <q-drawer width="300" show-if-above  side="right">
    <!-- drawer content -->
    <q-card class="q-ma-xl">
      <q-card-section class="text-weight-bolder">
        Rank Type
      </q-card-section>
      <q-item
        :focused="ordertype==='visit_count'"
        @click="setRank('visit_count')" clickable >
click
      </q-item>
      <q-item
        :focused="ordertype==='create_time'"
        @click="setRank('create_time')"
        clickable >
        New book
      </q-item>
      <q-item
        :focused="ordertype==='last_chapter_time'"
        @click="setRank('last_chapter_time')"
        clickable >
        Updates
      </q-item>
      <q-item
        :focused="ordertype==='comment_count'"
        @click="setRank('comment_count')"
        clickable >
        Comments
      </q-item>


    </q-card>
  </q-drawer>
  </div>
</template>

<script>
import {reactive, ref, toRefs} from "vue";
import {api} from "boot/axios";
import Router from '../router/index'
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
  { name: 'Status', label: 'Status',align: 'center', field: 'bookStatus' },
  { name: 'Author', align: 'center', label: 'Author', field: 'authorName'},
  { name: 'visitCount', align: 'center', label: 'Visit Count', field: 'visitCount'},
  { name: 'wordCount', align: 'center', label: 'Word Count', field: 'wordCount'},
]
export default {

  name: "Rank",
  setup() {
    const loading = ref(false);
    const pagination = {rowsPerPage: 0}
    const ordertype =ref('visit_count')
    const page=ref(0);
    const size=ref(30);
    const book=reactive({data:[]})

    api.post(
      '/bookInfo/info',
      {
        bookCategory:{
          sortOn:ordertype.value
        },
        pageReq:{
          page:page.value,
          size:size.value
        }
      }
    ).then(
      res=>{
        if(res.data.code===200){
          console.log(res.data)
          book.data=res.data.data
        }

      }

    )
    const setRank=(val)=>{
      page.value=0
      size.value=30
      ordertype.value=val;
      api.post(
        '/bookInfo/info',
        {
          bookCategory:{
            sortOn:ordertype.value
          },
          pageReq:{
            page:page.value,
            size:size.value
          }

        },
        {

        }
      ).then(
        res=>{
          if(res.data.code===200){
            console.log(res.data)
            book.data=res.data.data
          }        }

      )

    }

    return {
      columns,
      loading,
      pagination,
      ordertype,
      setRank,
      ...toRefs(book),
      onScroll() {

      },
      detail(val){
        Router.push(
          '/bookDescp/'+val.bookId,
      )
      },
      wordtran
    }
  }
}
</script>

<style scoped>

</style>
