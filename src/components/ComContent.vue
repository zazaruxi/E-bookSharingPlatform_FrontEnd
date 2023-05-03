<template>
  <q-dialog style="width: 800px" ref="dialog" @hide="onDialogHide">
    <q-card style="width: 800px" class="q-dialog-plugin">
      <q-card-section class="text-center text-teal text-weight-bolder text-h6">
       {{this.bookId===undefined? 'Reply':'Comment'}}
      </q-card-section>
      <q-card-section>
        <q-input
          class="q-ma-lg"
          v-model="com"
          style="font-size: 25px"
          filled
          autogrow
        >
          <template v-slot:before>
            <span style="font-size: 15px">Comment:</span>
          </template>
        </q-input>

        <q-file
          class="q-ma-lg"
          filled
          accept=".jpg, image/*,.png"
          outlined
          v-model="files"
          clearable
          multiple
          append
          use-chips
          label="click to select file">
          <template v-slot:before>
            <span style="font-size: 15px">Pic:</span>
          </template>
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>

        </q-file>
        <div class="row">
          <q-card class="q-ma-sm"  v-for="file in files">
            <q-img :ratio="3/4" width="110px" :src="file!==null? this.URL.createObjectURL(file):'http://localhost:8081/bookInfo/img/'+this.val.bookId"></q-img>

          </q-card>

        </div>



      </q-card-section>
      <q-card-actions align="right">
        <q-btn class="q-ma-lg" color="secondary" rounded label="cancel" @click="onCancelClick()" />

        <q-btn class="q-ma-lg" color="secondary" rounded  @click="onOKClick()" >
          <template v-slot:default>
            <q-icon name="send" />
          </template>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>




export default {

  name: "ComContent",
  data() {
    return {
      com:'',
      files:[],
      URL:URL,}
  }
  ,
  props: {
    // ...你自定义的属性
    bookId: {
    },
    tp:{

    },
    cid:{

    },
    comt:{

    }

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

      if(this.files.length===0&&this.com===''){
        this.$q.notify({
          message:'Blank information',
          type:'negative',
          position:'top'
        })
        return
      }

if(this.comt){
  let data = new FormData
  if(this.files.length!==0){
    for(let i=0;i<=this.files.length;i++){
      data.append('files',this.files[i])
    }
  }

  data.append("commentContent",this.com)

  data.append("userId",this.$store.getters["example/getLoginUser"].userId)
  data.append("bookId",this.bookId)
  this.$api.post(
    'bookComment',data
  ).then(
    res=>{
      this.$emit('ok')
      // 然后隐藏对话框
      this.hide()
    }
  )
}else {
  let data = new FormData
  if(this.files.length!==0){
    for(let i=0;i<=this.files.length;i++){
      data.append('files',this.files[i])
    }
  }
  data.append("bookId",this.bookId)
  data.append("replyContent",this.com)
  data.append("userId",this.$store.getters["example/getLoginUser"].userId)
  data.append("commentId",this.tp+this.cid)
  this.$api.post(
    'bookCommentReply',data
  ).then(
    res=>{
      this.$emit('ok')
      // 然后隐藏对话框
      this.hide()
    }
  )
}


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
