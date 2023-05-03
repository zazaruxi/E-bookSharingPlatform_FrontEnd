<template>
  <div >
    <q-page-sticky class="text-secondary" v-show="!inTop&&li.length!==0" style="z-index: 9999" position="top-right" :offset="[-100,300]">
      <q-btn @click="reflash(0)" label="new Message" icon="bi-chevron-double-up"></q-btn>
    </q-page-sticky>
  <div class="column" >
    <q-card >
      <q-card-section class="row">

      <q-img class="col-2 q-ma-sm" width="200px" :ratio="9/11"  :src="'http://localhost:8081/bookInfo/img/'+bookInfo.bookId"
      ></q-img>

        <div class="col column text-weight-bolder text-center q-mt-xl" style="font-size: 35px">
          <div class="col-2"></div>
          Comments of {{bookInfo.bookName}}
          <q-space/>
          <div >
            <p class=" text-grey-5 q-ma-sm row" style="font-size: 15px">Author : {{bookInfo.authorName===''? 'Unknow':bookInfo.authorName}}
              <q-space/>
              visit Count:{{bookInfo.visitCount}}
              <q-space/>
              Total comments : {{bookInfo.commentCount}}</p>

          </div>
        </div>

      </q-card-section>



    </q-card>
<div>

<!--  <q-card id="card" class="column" @scroll="handleScroll">-->
<!--    <q-item-->
<!--      :key="item.userId"-->
<!--      style="border: gray solid 1px;border-top:0"-->
<!--      class="row"-->

<!--      v-for="item in comList.list">-->
<!--      <div class="column col-2 text-center">-->
<!--        <q-img :key="item.id" class="q-ma-md" :ratio="3/4" width="110px" :src="'http://localhost:8081/user/img/'+item.userId"></q-img>-->

<!--        {{item.userName}}-->
<!--      </div>-->
<!--      <q-separator class="q-mr-xl" vertical></q-separator>-->
<!--      <div class="column ">-->
<!--        <div class="q-pa-md col-10" style="font-size: 15px">-->
<!--          {{item.commentContent}}-->
<!--          <div>-->
<!--            <div class="row"  v-if="item.imgUrl!==null"  style="margin-left: 90px;margin-top: 70px" >-->
<!--<q-img class="q-ma-sm col-4"-->
<!--       v-for="item2 in item.imgUrl"-->
<!--       :key="item2" :ratio="3/4"-->
<!--       width="100px"-->
<!--       loading="lazy"-->
<!--       placeholder-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWBAMAAADOL2zRAAAAG1BMVEXMzMyWlpaqqqq3t7fFxcW+vr6xsbGjo6OcnJyLKnDGAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABAElEQVRoge3SMW+DMBiE4YsxJqMJtHOTITPeOsLQnaodGImEUMZEkZhRUqn92f0MaTubtfeMh/QGHANEREREREREREREtIJJ0xbH299kp8l8FaGtLdTQ19HjofxZlJ0m1+eBKZcikd9PWtXC5DoDotRO04B9YOvFIXmXLy2jEbiqE6Df7DTleA5socLqvEFVxtJyrpZFWz/pHM2CVte0lS8g2eDe6prOyqPglhzROL+Xye4tmT4WvRcQ2/m81p+/rdguOi8Hc5L/8Qk4vhZzy08DduGt9eVQyP2qoTM1zi0/uf4hvBWf5c77e69Gf798y08L7j0RERERERERERH9P99ZpSVRivB/rgAAAABJRU5ErkJggg=="-->
<!--       :src="'http://localhost:8081/bookComment/img/'+item.id+'/'+item2">-->
<!--</q-img>-->
<!--          </div>-->
<!--          </div>-->
<!--        </div>-->


<!--        <div class="row col-2">-->
<!--          <div class="q-ma-sm text-grey-5">-->
<!--            {{item.updateTime}}-->

<!--          </div>-->

<!--          <q-btn color="secondary" clickable flat  icon="message">-->
<!--            <template v-slot:default>-->
<!--              <div style="size: 2px">{{item.replyCount}}</div>-->
<!--            </template>-->
<!--          </q-btn>-->
<!--        </div>-->
<!--      </div>-->
<!--    </q-item>-->

<!--  </q-card>-->

  <q-table
    class="my-sticky-dynamic  shadow-4 q-ma-md"
    title="Comments"
    separator="cell"
    :columns="columns"
    :loading="loading"
    hide-bottom
    :rows="comList.list"
    hide-header
    :row-key="row=>row.id"
    :rows-per-page-options="[0]"
  >
    <template v-slot:top-right>
      <q-btn id="re" @click="reflash" flat color="secondary" round icon="bi-arrow-clockwise">
        <q-badge v-show="li.length!==0" color="orange" floating>{{li.length}}</q-badge>
      </q-btn>

    </template>

    <template v-slot:body="props">
      <q-tr @click="reply(props.row)" :props="props" class="def-tr" style="min-width: 950px">
        <q-td key="Cover" style="width: 150px">
          <div class="column col-2 text-center">
            <q-img style="border-radius: 50%"
                   :ratio="1" width="110px" :src="'http://localhost:8081/user/img/'+props.row.userId"></q-img>

            {{props.row.userName}}
          </div>        </q-td>
        <q-td key="Name"  :props="props">
          <div class="column ">
            <div class="q-pa-md col-10" style="font-size: 15px">
              {{props.row.commentContent}}
              <div>
                <div class="row"  v-if="props.row.imgUrl!==null"  style="margin-left: 90px;margin-top: 70px" >
                  <q-img class="q-ma-sm col-4"
                         v-for="item2 in props.row.imgUrl"
                         :key="item2" :ratio="3/4"
                         width="100px"
                         loading="lazy"
                         placeholder-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWBAMAAADOL2zRAAAAG1BMVEXMzMyWlpaqqqq3t7fFxcW+vr6xsbGjo6OcnJyLKnDGAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABAElEQVRoge3SMW+DMBiE4YsxJqMJtHOTITPeOsLQnaodGImEUMZEkZhRUqn92f0MaTubtfeMh/QGHANEREREREREREREtIJJ0xbH299kp8l8FaGtLdTQ19HjofxZlJ0m1+eBKZcikd9PWtXC5DoDotRO04B9YOvFIXmXLy2jEbiqE6Df7DTleA5socLqvEFVxtJyrpZFWz/pHM2CVte0lS8g2eDe6prOyqPglhzROL+Xye4tmT4WvRcQ2/m81p+/rdguOi8Hc5L/8Qk4vhZzy08DduGt9eVQyP2qoTM1zi0/uf4hvBWf5c77e69Gf798y08L7j0RERERERERERH9P99ZpSVRivB/rgAAAABJRU5ErkJggg=="
                         :src="'http://localhost:8081/bookComment/img/'+props.row.id+'/'+item2">
                  </q-img>
                </div>
              </div>
            </div>


            <div class="row col-2">
              <div class="q-ma-sm text-grey-5">
                {{props.row.updateTime}}

              </div>

              <q-btn color="secondary" clickable flat  icon="message">
                <template v-slot:default>
                  <div style="size: 2px">{{props.row.replyCount}}</div>
                </template>
              </q-btn>
            </div>
          </div>
        </q-td>
      </q-tr>
    </template>


  </q-table>














</div>


  </div>
  <q-drawer width="200" show-if-above  side="left">
    <!-- drawer content -->

  </q-drawer>

  <q-drawer width="200" show-if-above  side="right">
    <!-- drawer content -->
  </q-drawer>
  <q-page-sticky style="z-index: 9999"  :offset="fabPos">
    <q-fab
      :disable="click"
      style="z-index: 99999"
      color="secondary"
      @click.stop="writeComment()"
      v-touch-pan.prevent.mouse="moveFab"
    >
      <template v-slot:icon="{ opened }">
        <q-icon :class="{ 'example-fab-animate--hover': opened !== true }" name="bi-pen" />
      </template>
      <template v-slot:active-icon="{ opened }">
        <q-icon :class="{ 'example-fab-animate': opened === true }" name="bi-pen" />
      </template>
    </q-fab>
    <q-tooltip class="bg-secondary" :offset="[0, 10]">Write Comment</q-tooltip>
  </q-page-sticky>

</div>
</template>

<script>
import {getToken} from "src/utils/Token";
import { debounce } from 'quasar'
import '/src/css/Book.css'
import {reactive, toRefs, onMounted,onBeforeUnmount ,ref, watch, onBeforeMount, computed} from "vue";
import {api} from "boot/axios";
import {useStore} from 'vuex'
import Router from "src/router/index";
import {useQuasar} from "quasar";
import {LocalStorage} from "quasar";
import {checkCollection, getCollection,wordtran} from "src/utils/utils";
import Comcontent from "components/ComContent";

const columns = [
  { name: 'Cover',
    style: 'min-width: 50px; width: 70px',
    align: 'center',
    label: '',
    required: true,
    field: 'bookId' },
  { name: 'Name',  align: 'left',label: '', field: 'bookName' }]



export default {
  name: "Comment",
  setup(){

    const bookId=Router.currentRoute.value.params.bookId
    const book=reactive({bookInfo:{}})
    var websocket=null
    const store=useStore()
    const move=ref(0)
    const q=useQuasar()
    const inTop=ref(true)
    const newCol=reactive({li:[]})
    const page=ref(1)
    const size=ref(10)
    const comment=reactive({comList:[]})
    const click=ref(false)
    const isConnect=ref(false)
    const fabPos = ref([ 40, 30 ])
    const draggingFab = ref(false)
    const total=ref(0)
    const loading=ref(false)
    const finished=ref(false)
    onMounted(()=>{
try{


      if ('WebSocket' in window) {
        websocket = new WebSocket('ws://localhost:8081/push/websocket/book'+bookId,[getToken()])
        // alert('连接浏览器')
        initWebSocket()
      } else {
        alert('Not support')
      }
}catch (e){
  reConnectFn()
      }
    })
    onBeforeUnmount(()=>{
      onbeforeunload()
    })
    const  initWebSocket=()=> {
      isConnect.value=true
      // 连接错误
      websocket.onerror = setErrorMessage

      // 连接成功
      websocket.onopen = setOnopenMessage
      // 收到消息的回调
      websocket.onmessage = setOnmessageMessage
      // 连接关闭的回调
      websocket.onclose = setOncloseMessage
      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = onbeforeunload
    }
    const reConnectFn=()=>{

      // 重连函数

      if (isConnect.value) {
        return;
      }
      const reConnect = setTimeout(() => {

        initWebSocket()

      }, 10000)

    }
    const  setErrorMessage =()=> {
      isConnect.value=false;
      reConnectFn()
      console.log('WebSocket连接发生错误   状态码：' + websocket.readyState)
    }
    const  setOnopenMessage =()=> {
      console.log('WebSocket连接成功    状态码：' + websocket.readyState)
    }
    const  setOnmessageMessage =(event)=> {
      // 根据服务器推送的消息做自己的业务处理
      console.log(JSON.parse(event.data))
      newCol.li.unshift(JSON.parse(event.data))
      book.bookInfo.commentCount+=1
      move.value+=1
    }
    const reflash = (val) => {

      if (val===0){
        document.getElementById("re").scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        })
      }

      loading.value=true
      while (newCol.li.length!==0){
        comment.comList.list.unshift(newCol.li.pop())
      }
      loading.value=false
    }


    const  setOncloseMessage =()=> {
      isConnect.value=false;
      reConnectFn()
      console.log('WebSocket连接关闭    状态码：' + websocket.readyState)
    }
    const onbeforeunload =()=> {
      closeWebSocket()
    }
    const closeWebSocket=()=>{
      websocket.close()
    }
q.loading.show()

    loading.value=true
    api.get(
      '/bookInfo/' + bookId
    ).then(
      res => {
        if (res.data.code === 200) {
          console.log(res.data)
          book.bookInfo = res.data.data
          api.get(
            'bookComment/page/'+bookId,
            {
              params:{
                page:(page.value-1)*size.value,
                size:size.value
              }
            }

          ).then(res=>{
            if (res.data.code===200){
              console.log(res.data.data)
              comment.comList=res.data.data
              total.value=res.data.data.total
              q.loading.hide()
              loading.value=false
              if ((page.value)*size.value+move.value >= res.data.data.total){
                finished.value=true;
              }
            }
          })
        }
      })




    return{
      ...toRefs(book),
      ...toRefs(comment),
      ...toRefs(newCol),
      page,
      size,
      loading,
      q,
      move,
      debounce,
      bookId,
      finished,
      inTop,
      columns,
      wordtran,
      console:console,
      fabPos,
      click,
      reflash,
      moveFab (ev) {
        draggingFab.value = ev.isFirst !== true && ev.isFinal !== true

        fabPos.value = [
          fabPos.value[ 0 ] - ev.delta.x,
          fabPos.value[ 1 ] - ev.delta.y
        ]
      },
      writeComment(){
        click.value=true
        q.dialog({
          persistent: true, // we want the user to not be able to close it
          ok: false, // we want the user to not be able to close it
          component: Comcontent,
          componentProps: {
            bookId:bookId,
            comt:true
          },
        }).onOk(() => {
          click.value=false
        }).onCancel(() => {
          click.value=false

        }).onDismiss(() => {
        })
      },

    }
    },
  methods:{
    lis(e){
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let clientHeight = document.documentElement.clientHeight;
      let scrollHeight = document.documentElement.scrollHeight;
      let bottomOfWindow = scrollTop + clientHeight >= scrollHeight-2
      this.inTop = scrollTop < 200;
      // 滚动距离顶部高度 + 可视区域高度 >= 滚动内容高度，说明滚动到底
      if (scrollTop != 0 && bottomOfWindow && !this.$q.loading.isActive&&!this.finished) {
        this.$api.get(
          'bookComment/page/'+this.bookId,
          {
            params: {
              page: this.page*this.size+this.move,
              size: this.size
            }
          }
        ).then(res => {
          if (res.data.data.list.length!=0) {
            for (let i = 0; i < res.data.data.list.length; i++) {
              this.comList.list.push(res.data.data.list[i])
            }
            this.page += 1
            console.log( this.comList.list)
          }
          console.log((this.page)*this.size+this.move+"+"+ res.data.data.total)
          if ((this.page)*this.size+this.move >= res.data.data.total){
            this.finished=true;
          }
        })

      }
    },
    reply(val){
      window.removeEventListener('scroll',this.lis)
      Router.push(
        {
          name:'reply',
          query:{
            type:'com',
            cid: val.id,
            bookId:this.bookId

          }
        }
      )

    }
  },
  mounted() {

    window.addEventListener('scroll', this.lis)
  }, beforeDestroy() {
  window.removeEventListener('scroll',this.lis)

}
}
</script>

<style scoped lang="sass">
.example-fab-animate,
.q-fab:hover .example-fab-animate--hover
  animation: example-fab-animate 0.82s cubic-bezier(.36,.07,.19,.97) both
  transform: translate3d(0, 0, 0)
  backface-visibility: hidden
  perspective: 1000px

@keyframes example-fab-animate
  10%, 90%
    transform: translate3d(-1px, 0, 0)

  20%, 80%
    transform: translate3d(2px, 0, 0)

  30%, 50%, 70%
    transform: translate3d(-4px, 0, 0)

  40%, 60%
    transform: translate3d(4px, 0, 0)
</style>
