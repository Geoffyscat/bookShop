<template>
  <div>
    <nav-bar>
      <template v-slot:default>商品分类</template>
    </nav-bar>
    <div id="main-box">
      <div class="orber-tab">
        <van-tabs v-model="active" @click="tabIndex">
          <van-tab title="销量排序"></van-tab>
          <van-tab title="价格排序"></van-tab>
          <van-tab title="好评排序"></van-tab>
        </van-tabs>
      </div>
      <div class="left-side-bar">
        <van-sidebar v-model="activeKey">
          <van-collapse v-model="activeName" accordion>
            <van-collapse-item
              v-for="(item, index) in goods.categories"
              :key="item.id"
              :title="item.name"
            >
              <van-sidebar-item
                v-for="child in item.children"
                :title="child.name"
                :key="child.id"
                @click="getGoods"
              />
            </van-collapse-item>
          </van-collapse>
        </van-sidebar>
      </div>

      <div class="goodslist">
        <div class="content">
          <van-card
            v-for="item in showGoods"
            :key="item.id"
            :num="item.comments_count"
            tag=""
            @click="itemClick(item.id)"
            :price="item.price"
            :desc="item.updated_at"
            :title="item.title"
            :thumb="item.cover_url"
            :lazy-load="true"
          />
        </div>
      </div>
    </div>

    <back-top v-show="isBackTop" @btop="btop" @click="btop"></back-top>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import { ref, reactive, onMounted, computed, watchEffect, nextTick } from "vue";
import BScroll from "better-scroll";
import { getCategory, getCategoryGoods } from "network/category";
import BackTop from "components/common/backtop/BackTop";
import { useRouter } from "vue-router";
export default {
  name: "Category",
  components: {
    NavBar,
    BackTop,
  },
  setup() {
    //vant组件参数
    let activeKey = ref(0);
    let activeName = ref(0);
    let active = ref(0);
    let isBackTop = ref(false);
    const router = useRouter();

    //当前Tab的查询字段 -> api请求的参数之一  排序
    let currentTab = ref("sales");

    //点击事件 tab选项卡的索引 -->  用于查询商品排序字段
    const tabIndex = (name) => {
      //查询字段
      let type = ["sales", "price", "comments_count"];
      //重新加载分类数据
      currentTab.value = type[name];
      getCategoryGoods(currentTab.value, currentCid.value).then((res) => {
        goodsQuest[currentTab.value].list = res.data.goods.data;
        bscroll && bscroll.refresh();
      });
    };
    // 分类 id -> api 请求参数之一  排序
    let currentCid = ref(0);
    //点击事件  侧边栏二级 ->  获取点击索引
    let getGoods = (id) => {
      currentCid.value = id;
      //重新加载数据
      init();
    };
    //数据类型集合
    const goods = reactive({
      categories: [],
      goods: [],
      recommend_goods: [],
    });
    //查询数据集合
    const goodsQuest = reactive({
      sales: { page: 1, list: [] },
      price: { page: 1, list: [] },
      comments_count: { page: 1, list: [] },
    });
    //初始数据获取，商品页 ->
    const init = () => {
      getCategoryGoods("sales", currentCid.value).then((res) => {
        goodsQuest.sales.list = res.data.goods.data;
      });
      getCategoryGoods("price", currentCid.value).then((res) => {
        goodsQuest.price.list = res.data.goods.data;
      });
      getCategoryGoods("comments_count", currentCid.value).then((res) => {
        goodsQuest.comments_count.list = res.data.goods.data;
      });
    };

    //声明滚动插件
    let bscroll = reactive({});
    /*----------------------挂载周期-----------------*/
    onMounted(() => {
      //api请求
      getCategory().then((res) => {
        goods.categories = res.data.categories;
      });
      init();
      //创建BetterScroll对象
      bscroll = new BScroll(document.querySelector(".goodslist"), {
        probeType: 3,
        click: true, //点击允许
        pullUpLoad: true, //上拉加载
      });
      //滚动事件
      bscroll.on("scroll", (position) => {
        isBackTop.value = -position.y > 250;
      });
      //上拉加载  数据请求  难点 多次计算页面高度
      bscroll.on("pullingUp", () => {
        console.log("上拉加载");
        const page = goodsQuest[currentTab.value].page + 1;

        getCategoryGoods(currentTab.value, currentCid.value).then((res) => {
          goodsQuest[currentTab.value].list.push(...res.data.goods.data);
          goodsQuest[currentTab.value].page += 1;
        });

        bscroll.finishPullUp();

        bscroll.refresh();
        console.log(
          "contentheight:" + document.querySelector(".content").clientHeight
        );
        console.log("当前类型" + currentTab.value + "当前页数" + page);
      });
    });

    /* ------------------计算属性---------------- */

    const showGoods = computed(() => {
      return goodsQuest[currentTab.value].list;
    });
    /* --------------------------监听属性------------------ */
    watchEffect(() => {
      nextTick(() => {
        bscroll && bscroll.refresh();
      });
    });

    const btop = () => {
      return bscroll.scrollTo(0, 0, 300);
    };

    return {
      activeKey,
      goods,
      activeName,
      active,
      tabIndex,
      currentTab,
      getGoods,
      init,
      showGoods,
      bscroll,
      isBackTop,
      btop,
      itemClick: (id) => {
        router.push({ path: "/detail", query: { id } });
      },
    };
  },
};
</script>

<style lang="scss" scoped>
#main-box {
  margin-top: 45px;
  .orber-tab {
    width: 70%;
    height: 45px;
    position: fixed;
    right: 0;
    box-shadow: 10px 3px 10px gray;
    float: right;
    z-index: 10;
  }
  .left-side-bar {
    width: 30%;
    position: fixed;
    left: 0;
    box-shadow: 0 0 10px gray;
    margin-top: 45px;
  }
  .goodslist {
    width: 70%;
    height: 500px;
    float: right;
    padding: 10px;
    margin-top: 45px;
  }
  .van-card {
    box-shadow: 1px 1px 3px gray;
  }
}

.van-sidebar {
  width: 100%;
}

.van-card__content {
  text-align: left;
}
</style>