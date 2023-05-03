<template>

  <div class="channelWrap classTable cf shadow-4">
    <div class="so_tag">
      <ul class="list">

        <li id="idGirl" class="so_class">
          <span class="tit">Category：</span>
          <span class="so_boy" id="boyCategoryList">
              <a
                href="javascript:void(0)"
                :class="`${categoryOn == null ? 'on' : ''}`"
                @click="changeCategory(null)"
              >Unlimited</a
              >
              <a
                v-for="item in bookCategorys"
                href="javascript:void(0)"
                :class="`${categoryOn == item ? 'on' : ''}`"
                @click="changeCategory(item)"
              >{{ item }}</a
              >
            </span>
        </li>
        <li class="so_progress">
          <span class="tit">Finished：</span>
          <a
            href="javascript:void(0)"
            :class="`${bookStatusOn == null ? 'on' : ''}`"
            @click="changeBookStatus(null)"
          >Unlimited</a
          >
          <a
            filter-value="0"
            href="javascript:void(0)"
            :class="`${bookStatusOn == 0 ? 'on' : ''}`"
            @click="changeBookStatus(0)"
          >Updating</a
          >
          <a
            filter-value="1"
            href="javascript:void(0)"
            :class="`${bookStatusOn == 1 ? 'on' : ''}`"
            @click="changeBookStatus(1)"
          >Finished</a
          >
        </li>
        <li class="so_words">
          <span class="tit">Word Count：</span>
          <a
            href="javascript:void(0)"
            :class="`${wordCountOn.min == null ? 'on' : ''}`"
            @click="changeWordCount(null, null)"
          >Unlimited</a
          >
          <a
            filter-value-max="300000"
            href="javascript:void(0)"
            :class="`${wordCountOn.min == 0 ? 'on' : ''}`"
            @click="changeWordCount(0, 300000)"
          >300t</a
          >
          <a
            filter-value-min="300000"
            filter-value-max="500000"
            href="javascript:void(0)"
            :class="`${wordCountOn.min == 300000 ? 'on' : ''}`"
            @click="changeWordCount(300000, 500000)"
          >300t-500t</a
          >
          <a
            filter-value-min="500000"
            filter-value-max="1000000"
            href="javascript:void(0)"
            :class="`${wordCountOn.min == 500000 ? 'on' : ''}`"
            @click="changeWordCount(500000, 1000000)"
          >500t-1m</a
          >
          <a
            filter-value-min="1000000"
            href="javascript:void(0)"
            :class="`${wordCountOn.min == 1000000 ? 'on' : ''}`"
            @click="changeWordCount(1000000, null)"
          >over 1t</a
          >
        </li>
        <li class="so_update">
          <span class="tit">Update time：</span>
          <a
            href="javascript:void(0)"
            :class="`${updateTimeOn == null ? 'on' : ''}`"
            @click="changeUpdateTime(null)"
          >Unlimited</a
          >
          <a
            filter-value="3"
            href="javascript:void(0)"
            :class="`${updateTimeOn == 3 ? 'on' : ''}`"
            @click="changeUpdateTime(3)"
          >Within 3 days</a
          >
          <a
            filter-value="7"
            href="javascript:void(0)"
            :class="`${updateTimeOn == 7 ? 'on' : ''}`"
            @click="changeUpdateTime(7)"
          >Within 1 week</a
          >
          <a
            filter-value="15"
            href="javascript:void(0)"
            :class="`${updateTimeOn == 15 ? 'on' : ''}`"
            @click="changeUpdateTime(15)"
          >Within 15 days</a
          >
          <a
            filter-value="30"
            href="javascript:void(0)"
            :class="`${updateTimeOn == 30 ? 'on' : ''}`"
            @click="changeUpdateTime(30)"
          >Within 30 days</a
          >
        </li>
        <li class="so_sort">
          <span class="tit">Sort：</span>
          <a href="javascript:void(0)"
             :class="`${sortOn == null ? 'on' : ''}`"
             @click="changeSort(null)">Unlimited</a>
          <a
            filter-value="last_index_update_time"
            href="javascript:void(0)"
            :class="`${sortOn == 'last_chapter_time' ? 'on' : ''}`"
            @click="changeSort('last_chapter_time')"
          >Update Time</a
          >
          <a filter-value="word_count" href="javascript:void(0)"
             :class="`${sortOn == 'word_count' ? 'on' : ''}`"
             @click="changeSort('word_count')"
          >Word count</a
          >
          <a
            filter-value="visit_count"
            href="javascript:void(0)"
            :class="`${sortOn == 'visit_count' ? 'on' : ''}`"
            @click="changeSort('visit_count')"
          >Visit count</a
          >
        </li>
      </ul>
    </div>
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

        <q-td key="Type" :props="props" class="text-grey-5">
          [{{props.row.categoryName}}]
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
          {{props.row.bookStatus===0 ? 'Updating':'Finished'}}
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
import {useQuasar} from "quasar";
import {wordtran} from "src/utils/utils";
import Router from "src/router";

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

  name: "Book",
  setup(){
    const state = reactive({
      bookCategorys: [
        'Fantasy',
        'Immortal',
        'Romantic',
        'History',
        'science',
        'Game',
      ],
      books: [],
      searchCondition: {},
      backgroud: true,
      total: 0,
      pageSize: 10,
      //分类
      workDirectionOn: 0,
      categoryOn: null,
      bookStatusOn: null,
      wordCountOn: {min:null,max:null},
      updateTimeOn: null,
      sortOn:null
    });
const book=reactive({data:[]})
    const q=useQuasar();
    var loading=ref(false);
   var pagination= { rowsPerPage: 0 }
    const page=ref(0);
    const size=ref(10);
const changeSort = (val) => {
  page.value=0
  size.value=10
  state.sortOn=val
  loadbook()
}
const changeUpdateTime = (val) => {
  page.value=0
  size.value=10
  state.updateTimeOn=val
  loadbook()
}
const changeWordCount = (val,val2) => {
  page.value=0
  size.value=10

 state.wordCountOn={
    min:val,
      max:val2
  }
  loadbook()
}

const changeBookStatus = (val) => {
  page.value=0
  size.value=10
  state.bookStatusOn=val
  loadbook()
}
const changeCategory = (val) => {
  page.value=0
  size.value=10
  state.categoryOn=val
  loadbook()
}
const loadCategoryList = (val) => {
  page.value=0
  size.value=10
  state.workDirectionOn=val
  loadbook()
}

const loadbook = () => {
  q.loading.show({
    message:'Waiting...'
  })
  api.post(
    '/bookInfo/info',
    {
      bookCategory:{
        workDirectionOn: state.workDirectionOn,
        categoryOn: state.categoryOn,
        bookStatusOn: state.bookStatusOn,
        wordCountOn: state.wordCountOn,
        updateTimeOn: state.updateTimeOn,
        sortOn:state.sortOn
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
      console.log(res.data)
      if(res.data.code===200){
        book.data=res.data.data
        book.data.forEach((item,index)=>{
          return item.index=index
        })
      }
      q.loading.hide()
    }

  )


}
    loadbook()
return {
  ...toRefs(state),
  ...toRefs(book),
  columns,
  loading,
  pagination,
  changeSort,
  changeBookStatus,
  changeCategory,
  changeWordCount,
  changeUpdateTime,
  loadCategoryList,
  onScroll(){

  },
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
