<template>
  <q-dialog style="width: 900px" ref="dialog" @hide="onDialogHide">

    <q-card @scroll="onScroll" style="width: 900px;height: 650px" class="q-dialog-plugin ">
      <q-table
        class="my-sticky-dynamic  shadow-4 q-ma-lg"
        title="Books"
        :columns="columns"
        :loading="loading"
        style="max-height: 600px"
        hide-bottom
        virtual-scroll
        :pagination="pagination"
        row-key="id"
        binary-state-sort
        :filter="filter"
        wrap-cells
        :selected-rows-label="getSelectedString()"
        selection="multiple"
        :rows="data"
        v-model:selected="selected"
        :rows-per-page-options="[0]"
        @virtual-scroll="onScroll"

      >
        <template v-slot:top>
          <q-btn :disable="selected.length===0" label="delete" @click="del()" color="red-5"></q-btn>
          <q-space />
          <q-input label="Filter" borderless dense debounce="300" color="secondary" v-model="filter">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body="props">
          <q-tr @click="content(props.row)" :props="props" class="def-tr" style="min-width: 950px">
            <q-td key="index">
              <q-checkbox @click.stop v-model="props.selected" >
              </q-checkbox>
            </q-td>
            <q-td key="index"  :props="props">
              {{props.row.index}}
            </q-td>
            <q-td key="chapterName" :props="props" >
              [{{props.row.chapterName}}]
            </q-td>
            <q-td  key="wordCount" style="min-width: 150px; width:150px;text-align: center" :props="props" class="text-grey-5">
              {{props.row.wordCount ? wordtran(props.row.wordCount):0}}
            </q-td>
            <q-td  key="createTime" :props="props" class="text-grey-5">
              {{props.row.createTime}}
            </q-td>
            <!--          -->

          </q-tr>
        </template>

      </q-table>
    </q-card>

  </q-dialog>
</template>

<script>
import {wordtran} from "src/utils/utils";
import Router from "src/router";
const columns = [
  { name: 'index',
    required: true,
    sortable: true,
    label: "#",
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
    field: 'index' },
  { name: 'chapterName',  align: 'center',label: 'chapterName', field: 'chapterName' },
  { name: 'wordCount', align: 'center', label: 'wordCount', field: 'wordCount' },
  { name: 'createTime', align: 'center', label: 'createTime', field: 'createTime'},
]

export default {

  name: "CreateBook",
  data() {
    return {
      filter: '',
      page: 1,
      data: [],
      columns,
      nextpage: 2,
      selected:[],
      loading: false,
      total: 0,
      wordtran,
      pagination: {
        rowsPerPage: 0
      }
    }
  },
  computed: {

    lastPage: function () {
      return Math.ceil(this.total / 50);
    }
  }
  ,
  props: {
    // ...你自定义的属性
    id: {
      type: String,
      require: true
    }
  },

  emits: [
    // 必需的
    'ok', 'hide'
  ],

  methods: {
    // 以下方法是必需的
    // (不要改变它的名称 --> "show")
    del(){
      let list=[]
      for(let i in this.selected){
        list.push(this.selected.at(i).id)
      }
      this.$api.post(
        'bookChapter/delete',
        JSON.parse(JSON.stringify(list))
      )
    },
    show() {
      this.$refs.dialog.show()
    },

    // 以下方法是必需的
    // (不要改变它的名称 --> "hide")
    hide() {
      this.$refs.dialog.hide()
    },
    getSelectedString(){
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.data.length}`

    },

    onDialogHide() {
      // QDialog发出“hide”事件时
      // 需要发出
      this.$emit('hide')
    },

    onOKClick() {

      this.$emit('ok')
      // 然后隐藏对话框
      this.hide()

    },
    content(val) {
      console.log("ss")
      Router.push(
        '/read/' + val.id + '/' + val.bookId
      )

    },
    onCancelClick() {
      // 我们只需要隐藏对话框
      this.hide()
    },
    onScroll(info) {
    } },
    beforeCreate() {
      this.$api.post(
        'bookChapter/all/' + this.id
        , {
          order:"asc"
        }
      ).then(res => {
        if (res.data.code === 200) {
          console.log(res.data.data.list)
          this.data = res.data.data.list
          this.data.forEach((item,index)=>{
            item.index=index
          })
          this.total = res.data.data.total
        }
      })

    }

}
</script>

<style scoped>
</style>
