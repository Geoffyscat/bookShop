<template>
  <div class="home">
    <nav-bar>
      <template v-slot:default>首页</template>
    </nav-bar>

    <tab-control
      v-show="isTabFixed"
      :titles="['畅销', '新书', '精选']"
      style="margin-top:45px"
    ></tab-control>
    <div class="wrapper">
      <div class="content">
        <div ref="banref">
            <home-swiper :banners="banners" class="banners"></home-swiper>
          
          <div id="view">
            <recommend-view :recommends="recommends"></recommend-view>
          </div>
        </div>
        <tab-control :titles="['畅销', '新书', '精选']"
        v-show="!isTabFixed"></tab-control>
        <goods-list :goods="showGoods"></goods-list>
      </div>
    </div>


    <back-top v-show="isBackTop" @btop="btop" @click="btop"></back-top>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import RecommendView from "./childComps/RecommendView.vue";
import TabControl from "components/content/tabControl/TabControl.vue";
import GoodsList from "components/content/goods/GoodsList";
import  BackTop from "components/common/backtop/BackTop";
import HomeSwiper from "./childComps/HomeSwiper";
import { getHomeAllData, getHomeGoods } from "network/home";
import {
  ref,
  onMounted,
  inject,
  provide,
  reactive,
  computed,
  watchEffect,
  nextTick,
} from "vue";
import BScroll from "better-scroll";
export default {
  name: "Home",
  components: {
    NavBar,
    RecommendView,
    TabControl,
    GoodsList,
    BackTop,
    HomeSwiper
  },
  setup() {
    let isTabFixed = ref(false);
    let isBackTop = ref(false);
   
    //数据传递
    let nowIndex = ref(0);
    let banref = ref(null);
    let banners = ref([]);
    const tabIndex = (value) => {
      nowIndex.value = value;
      let types = ["sales", "new", "recommend"];
      currentType.value = types[value];
      nextTick(() => {
        bscroll && bscroll.refresh();
      });
    };
    provide("get", tabIndex);

    //商品列表数据模型
    const goods = reactive({
      sales: { page: 0, list: [] },
      new: { page: 0, list: [] },
      recommend: { page: 0, list: [] },
    });

    //使用计算属性监听 tab选项卡的切换
    let currentType = ref("sales");

    const showGoods = computed(() => {
      return goods[currentType.value].list;
    });

    //
    let bscroll = reactive({});
  
    //绑定周期  用于发送请求
    const recommends = ref([]);
    onMounted(() => {
      //调取api获取数据
      getHomeAllData().then((res) => {
        recommends.value = res.data.goods.data;
        //轮播图数据获取
        banners.value = res.data.slides
      });
      //调取api 获取热销数据
      getHomeGoods("sales").then((res) => {
        goods.sales.list = res.data.goods.data;
      });
      //调取api 获取热销数据
      getHomeGoods("recommend").then((res) => {
        goods.recommend.list = res.data.goods.data;
      });
      //调取api 获取新品数据
      getHomeGoods("new").then((res) => {
        goods.new.list = res.data.goods.data;
      });

      //创建BetterScroll对象
      bscroll = new BScroll(document.querySelector(".wrapper"), {
        probeType: 2,
        click: true, //点击允许
        pullUpLoad: true, //上拉加载
        scrollY: true,
        bindToWrapper: true
      });
      //触发滚动事件  刷新高度
      bscroll.on("scroll", (position) => {
        bscroll.refresh()
        // console.log(banref.value.offsetHeight);
        // console.log(-position.y);
        isBackTop.value=isTabFixed.value = (-position.y) >banref.value.offsetHeight
      });

      //上拉加载  数据请求  难点 多次计算页面高度
      bscroll.on("pullingUp", () => {
        const page = goods[currentType.value].page + 1;
        //重新获取数据 并加入旧数组中 注意解构扩展运算符
        getHomeGoods(currentType.value, page).then((res) => {
          goods[currentType.value].list.push(...res.data.goods.data);
          goods[currentType.value].page += 1;
        });
        bscroll.finishPullUp();
        bscroll.refresh();
      });
    });

    // //启动监听属性监听
    // watchEffect(() => {
    //   nextTick(() => {
    //     bscroll && bscroll.refresh();
    //   });
    // });

     const btop = ()=>{
      // return console.log("父方法");
      return bscroll.scrollTo(0,0,500)
    }
    return {
      recommends,
      nowIndex,
      goods,
      showGoods,
      isTabFixed,
      banref,
      isBackTop,
      btop,
      banners
    };
  },
};
</script>







<style lang="scss" scoped>

.home {
  height: 100vh;
  position: relative;
}
.wrapper {
  position: absolute;
  top: 45px;
  bottom: 50px;
  left: 0;
  right: 0;
  overflow: hidden;
}
.content {
  margin-bottom: 100px;
}


</style>