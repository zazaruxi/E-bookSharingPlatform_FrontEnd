<template>
  <q-dialog style="width: 700px" ref="dialog" @hide="onDialogHide">
    <q-card style="width: 700px" class="q-dialog-plugin">
      <q-card-section class="text-center text-teal text-weight-bolder text-h6">
       Create new book
      </q-card-section>

      <q-card-section  class="text-center">
        <q-input
          class="q-ma-lg text-h6"
          v-model="bookname"
          filled type="text"
          :rules="[ (val) =>val!==''  || 'Please enter a valid nickname' ]"
          :error="error"
          error-message="message"
          >

          <template v-slot:before>
            <span style="font-size: 15px">Book Name:</span>
          </template>
        </q-input>
  <q-select
    class="q-ma-lg"
    standout="bg-teal text-white"  v-model="category" :options="options" >
    <template v-slot:before>
      <span style="font-size: 15px">Category:</span>
    </template>
  </q-select>

        <q-input
          class="q-ma-lg"
          v-model="descp"
          filled
          autogrow
        >
          <template v-slot:before>
            <span style="font-size: 15px">Description:</span>
          </template>
        </q-input>

        <q-file
                class="q-ma-lg"
                filled
                accept=".jpg, image/*,.png"
                outlined v-model="model"
        label="click to select file">
          <template v-slot:before>
            <span style="font-size: 15px">Book Cover:</span>
          </template>
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>

      </q-card-section>


      <q-card-actions align="center">
        <q-btn class="q-ma-lg" color="secondary" label="Create" @click="onOKClick()" />
        <q-btn class="q-ma-lg" color="secondary" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {

  name: "CreateBook",
  data(){
    return{
      type:false,
      error:false,
      bookname:'',
      message:'',
      author:'',
      category:'',
      model:null,
      descp:'',
      options:[
        'Fantasy',
        'Immortal',
        'Romantic',
        'History',
        'science',
        'Game',
      ]
    }
  }
  ,
  props: {
    // ...你自定义的属性

  },

  emits: [
    // 必需的
    'ok', 'hide'
  ],

  methods: {
    // 以下方法是必需的
    // (不要改变它的名称 --> "show")
    show () {
      this.$refs.dialog.show()
    },

    // 以下方法是必需的
    // (不要改变它的名称 --> "hide")
    hide () {
      this.$refs.dialog.hide()
    },

    onDialogHide () {
      // QDialog发出“hide”事件时
      // 需要发出
      this.$emit('hide')
    },

    onOKClick () {
      if (this.bookname===null
        ||this.bookname===undefined
        ||this.category===null
      ||this.category===undefined||
      this.category===''){
        return;
      }
      let data = new FormData
      data.append("userId", this.$store.getters["example/getLoginUser"].userId)
      data.append("bookName",this.bookname)
      if(this.model!==null&&this.model!==''&&this.model!==undefined){
        data.append("img",this.model)
      }      data.append("authorName",this.author)
      data.append('bookDescp',this.descp)
      data.append("categoryName",this.category)
      this.$api.post(
        '/bookInfo',data).then(res=>{
        if (res.data.code===200){
          this.$emit('ok')
          // 然后隐藏对话框
          this.hide()
        }
      })


    },

    onCancelClick () {
      // 我们只需要隐藏对话框
      this.hide()
    }
  }
}
</script>

<style scoped>
</style>
