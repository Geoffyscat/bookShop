<template>
  <div class="detail">
    <nav-bar>
      <template v-slot:default>商品详情:{{ id }}</template>
    </nav-bar>
    <van-image width="100%" height="30%" lazy-load :src="detail.cover_url" />

    <van-card
      style="text-align: left"
      :num="detail.stock"
      :price="detail.price + '.00'"
      :desc="detail.description"
      :title="detail.title"
    >
      <template #tags>
        <van-tag plain type="danger">新书</van-tag>
        <van-tag plain type="danger">推荐</van-tag>
      </template>
      <template #footer>
        <van-button type="warning" @click="goToCart">立即购买</van-button>
        <van-button type="danger" @click="handleAddCart">加入购物车</van-button>
      </template>
    </van-card>

    <van-tabs v-model="active">
  <van-tab title="概述">
    <div class="content" v-html="detail.details"></div>
  </van-tab>
  <van-tab title="热评">
    <div v-for="item in detail.comments">
      
    </div>
  </van-tab>
  <van-tab title="相关图书">
     <goods-list :goods="like_goods"></goods-list>
  </van-tab>
</van-tabs>

  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import GoodsList from "components/content/goods/GoodsList";
import { useRoute,useRouter } from "vue-router";
import { ref, onMounted, reactive, toRefs } from "vue";
import {useStore} from 'vuex';
import { getDetail } from "network/detail";
import { addCart } from "network/cart";
import { Toast } from 'vant';
export default {
  name: "detail",
  components: {
    NavBar,
    GoodsList
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore()
    let id = ref(0);
    let book = reactive({
      detail: {},
      like_goods: [],
      comments: [],
    });
    let active = ref(1)
    onMounted(() => {
      id.value = route.query.id;
      getDetail(id.value).then(res => {
        book.detail = res.data.goods;
        book.like_goods = res.data.like_goods;
      });
    });

    //事件 添加购物车
    const handleAddCart = ()=>{
      addCart({goods_id:book.detail.id,num:1}).then(res=>{
        if(res.status=="201" || res.status == '204'){
          Toast.success("添加成功")
          //分发购物车数量更新
          store.dispatch('updataCart')
        }
      })
    }
    //事件 立即购买
    const goToCart = ()=>{
        addCart({goods_id:book.detail.id,num:1}).then(res=>{
        if(res.status=="201" || res.status == '204'){
          Toast.success("添加成功,快去下单吧")
           //分发购物车数量更新
          store.dispatch('updataCart')
          router.push({path:"/shopcart"})
        }
      })
    }
    return {
      id,
      ...toRefs(book),
      active,
      handleAddCart,
      goToCart,
    };
  },
};
</script>

<style lang="scss" scoped>
.detail {
  margin-top: 30px;
}

.content{
  padding: 10px;
  margin-bottom: 50px;
  
  img{
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
  }
}
</style>