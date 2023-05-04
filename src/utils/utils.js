import {api} from "boot/axios";
import {SessionStorage} from "quasar";

export function checkCollection(id,list){
  let check=null
  console.log(list)
  list.forEach(
  (item)=>{
    console.log(item.bookId + id)
    if (item.bookId==id){
      check=item.id
    }
  }
)
return check;

}
export async function getCollection(){
  let data=[]
  await api.get(
    '/userBookShelf/info',
    {params:{
        userId:SessionStorage.getItem("userinfo").userId
      }}
  ).then(res=>{
    console.log(res.data)
    if(res.data.data!==null&&res.data.data!==undefined){
      data=res.data.data
    }
  })
  return data
}

export function   wordtran(wordCount){
  if (wordCount.length > 5) {
    return parseInt(wordCount / 10000) + "w";
  }
  if (wordCount.length > 4) {
    return parseInt(wordCount / 1000) + "k";
  }
  return wordCount;

}
