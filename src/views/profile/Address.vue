<template>
  <div>
    <nav-bar>
      <template v-slot:default> 地址管理 </template>
    </nav-bar>
    <div class="address">
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
      />
      <div v-show="list.length == 0"></div>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import { AddressList, Toast } from "vant";
import { onMounted, reactive, ref, toRefs } from "vue";
import {useRouter,useRoute} from 'vue-router';

import {getAddressList} from "network/address"
export default {
  name: "Address",
  components: {
    NavBar,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()

    const state = reactive({
      chosenAddressId:"1",
      list:[],
      
    })

    onMounted( ()=>{

      //数据请求  地址信息获取
      getAddressList().then(res =>{
          //初始化判断 是否有值   无责赋空
          if(res.data.data.length == 0){
            state.list = [];
            return
          }
            //有责 按固定格式 返回数据
          state.list =res.data.data.map(item =>{
            return {
              id:item.id,
              name:item.name,
              tel:item.phone,
              address:`${item.province} ${item.city} ${item.county} ${item.address}`,
              isDefault:!!item.is_default
            }
          })
      })
    })
    //事件 添加 跳转到添加路由页面
    const onAdd = () => {
      router.push({path:'addressedit',query:{type:'add'}})
    }
    //事件 修改 跳转到修改页面  item 地址数据 index 索引值
    const onEdit = (item,index) => {
      router.push({path:'/addressedit',query:{type:'edit',addressId:item.id}})
    }


    return {
      onAdd,
      onEdit,
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" >
.address {
  padding-top: 50px;
}
.van-address-list__bottom {
  position: fixed;
  bottom: 60px;
  z-index: 0;
}
</style>
