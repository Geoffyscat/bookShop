<template>
  <div class="profile">
    <nav-bar>
      <template v-slot:default>个人中心</template>
    </nav-bar>

  <div class="user-box">
    <div class="user-info">
      <div class="info">
        <img src="https://user-images.githubusercontent.com/499550/93624428-53932780-f9ae-11ea-8d16-af949e16a09f.png" alt="">
        <div class="user-desc">
          <span>昵称：{{user.name}}</span>
          <span>登陆名：{{user.email}}</span>
          <span class="name">个性签名：成就自己的只需一套精品</span>
        </div>
      </div>
    </div>


      <ul class="user-list">
      <li @click="goTo('/collect')">
        <span>我的收藏</span>
        <van-icon name="arrow" />
      </li>
      <li @click="goTo('/order')">
        <span>我的订单</span>
        <van-icon name="arrow" />
      </li>
      <li @click="goTo('/setting')">
        <span>账号管理</span>
        <van-icon name="arrow" />
      </li>
      <li @click="goTo('/address')">
        <span>地址管理</span>
        <van-icon name="arrow" />
      </li>
      <li @click="goTo('/about')">
        <span>关于我们</span>
        <van-icon name="arrow" />
      </li>

      </ul>

  </div>
    <div>
      <van-button type="danger" round block @click="toLogout">退出</van-button>
  
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import {logout,getUser} from "network/user"
import {useRouter} from 'vue-router'
import {Toast} from 'vant'
import { useStore } from 'vuex';
import { onMounted, reactive, toRefs } from 'vue';
export default {
  name: "profile",
  components: {
    NavBar,
  },
  setup(){
    const router = useRouter()
    const store = useStore()
    //user包
    const state = reactive({
     user:{}
    })
    //事件 退出登录
    const toLogout = ()=>{
        logout().then(res =>{
          if(res.status == '204'){
            Toast.success('退出成功')

            //请token
            // window.localStorage.setItem('token','')
            window.localStorage.removeItem('token')
            store.commit("setIsLogin",false)
            store.commit("addCart",0)
            setTimeout(() => {
              router.push({path:'/login'})
            }, 500);
          }
        })
    }
  // 事件 跳转
  const goTo = (path,query) =>{
    router.push({path,query:query || {}})
  }
    onMounted( ()=>{
      getUser().then(res =>{
      
       state.user = res.data
    
      })
    })
    return {
      toLogout,
      ...toRefs(state),
      goTo
    }
  }
};
</script>

<style lang="scss" scoped>
.user-box {
  padding-top: 55px;
   background-color: rgba($color: #d4d0d0, $alpha: 0.3);
}
.user-info {
  padding: 0 20px;
}
.info {
  display: flex;
    justify-content: space-between;
    align-items: center;
  height: 120px;
  border-radius: 5px;
  background-color: rgba($color:rgba(5, 134, 5, 0.933), $alpha: 0.5);
  img {
    min-width: 100px;
    max-height: 100px;
    width: auto;
    height: auto;
  }
  .user-desc {
    // display: flex;
    // flex-wrap: wrap;
   
    span {
      display: block;
      text-align: left;
      
    }
    .name {
      color: red;
    }
  }
}
.user-list {
 
  padding-top: 10px;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    padding: 10px 10px;
    margin: 10px 5px;
    background-color: white;
    border-radius: 5px;
  }
}
</style>