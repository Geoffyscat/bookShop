<template>
  <!-- <router-view v-slot="{ Component }">
    <transition>
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
    </transition>
  </router-view> -->
  <router-view> </router-view>
  <div id="Tab-Bottom">
    <router-link to="/home" class="tab-bar-item">
      <div>
        <div class="icon">
          <i class="iconfont iconbiaoqiankuozhan_shouye-291"></i>
        </div>
        <div>首页</div>
      </div>
    </router-link>
    <router-link to="/category" class="tab-bar-item">
      <div>
        <div class="icon">
          <i class="iconfont iconbiaoqiankuozhan_fenlei-382"></i>
        </div>
        <div>分类</div>
      </div>
    </router-link>
    <router-link to="/shopcart" class="tab-bar-item">
      <div>
        <div class="icon">
          <van-badge :content="$store.state.cartCount" max="9">
            <i class="iconfont iconMBEfenggeduosetubiao-gouwuche"></i>
          </van-badge>
        </div>
        <div>购物车</div>
      </div>
    </router-link>
    <router-link to="/profile" class="tab-bar-item">
      <div>
        <div class="icon"><i class="iconfont icongerenzhongxin"></i></div>
        <div>我的</div>
      </div>
    </router-link>
  </div>
</template>
<script>
import {onMounted} from 'vue'
import {useStore} from 'vuex'
export default {
   setup(){
     const store = useStore()

      onMounted(()=>{
        store.dispatch('updataCart')
      })
   }
}
</script>

<style lang="scss">
@import url("assets/css/base.css");
@import url("assets/font/iconfont/iconfont.css");
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#Tab-Bottom {
  background-color: #F6F6F6;
  display: flex;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: 0 -3px 1px rgba(100, 100, 100, 0.1);
  a {
    color: var(-color-text);

    &.router-link-exact-active {
      color: var(--color-high-text);
    }
  }

  .tab-bar-item {
    flex: 1;
    height: 50px;
    text-align: center;
    font-size: var(--font-size);

    .icon {
      width: 25px;
      height: 25px;
      display: inline-block;
      margin-top: 5px;
      margin-bottom: 1px;
      vertical-align: middle;
      i {
        font-size: 20px;
      }
    }
  }
}
</style>
