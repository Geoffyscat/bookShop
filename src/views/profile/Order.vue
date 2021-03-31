<template>
  <div>
    <nav-bar>
      <template v-slot:default> 我的订单 </template>
    </nav-bar>
    <div class="main">
      <div class="tab">
        <van-tabs :ref="tabs" @click="onChangeTab">
          <van-tab title="全部"> </van-tab>
          <van-tab title="待付款"></van-tab>
          <van-tab title="已支付"></van-tab>
          <van-tab title="发货"></van-tab>
          <van-tab title="交易完成"></van-tab>
          <van-tab title="已过期"></van-tab>
        </van-tabs>
      </div>
      <div class="content">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            loading-text=""
            finished-text="没有更多了"
            @load="onLoad"
            offset="50"
            ><!-- offset 控制多少个开始加载 -->
            <div class="item">
              <div
                class="itemList"
                v-for="(item, index) in list"
                :key="index"
                @click="goTo(item.id)"
              >
                <div class="header">
                  <span
                    >订单号:{{ item.order_no }}<br />创建时间：{{
                      item.created_at
                    }}</span
                  >
                </div>
                <van-card
                  v-for="sub of item.orderDetails.data"
                  :key="sub.id"
                  :num="sub.num"
                  :price="sub.goods.price"
                  :desc="sub.goods.description"
                  :title="sub.goods.title"
                  :thumb="sub.goods.cover_url"
                />
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import { onMounted, ref, reactive, toRefs } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getOrderList } from "network/order";
export default {
  name: "Order",
  components: {
    NavBar,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    let tabs = ref(null);
    const state = reactive({
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      page: 1,
      totalPage: 0,
      status: 1,
    });

    onMounted(() => {
      onRefresh();
    });

    const loadData = () => {
      //数据请求
      getOrderList({
        pade: state.page,
        status: state.status,
        include: "orderDetails.goods",
      }).then((res) => {
        let cont = res.data.data;
        state.list = state.list.concat(cont);
        //总页数获取
        state.totalPage = res.data.meta.pagination.total_pages;
        state.loading = false;
       
        if (state.page >= state.totalPage) {
          //停止刷新
          state.finished = true;
        }
    console.log(state.page+"页数");
    console.log(state.totalPage+"总页数");
        //数据更新完毕后，将 loading 设置成 false 即可。若数据已全部加载完毕，则直接将 finished 设置成 true 即可。

        state.finished = true;
      });
    };

    //滚动条与底部距离小于 offset 时触发
    const onLoad = () => {
        state.finished = false;
        if(state.page < state.totalPage){
            state.page = state.page +1;
        }

      if (state.refreshing) {
        state.list = [];
        state.refreshing = false;
      }
      loadData();
      state.loading = false;
    };

    //刷新事件  数据添加 
    const onRefresh = () => {
      //是否出于加载状态，加载过程中不触发load事件
      state.refreshing = false;
      // 清空列表数据
      state.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      state.loading = true;

      state.page = 1;
      onLoad();
    };
    //tab切换页
    const onChangeTab = (name) => {
      onRefresh();
    };
    //
    const goTo = (id) => {
      router.push({ path: "/orderdetail", query: { id } });
    };
    return {
      ...toRefs(state),
      onLoad,
      onRefresh,
      tabs,
      onChangeTab,
      goTo,
    };
  },
};
</script>




<style lang="scss">
.main {
  margin-top: 50px;
}

.itemList {
  padding: 20px;
  box-shadow: 0 0 2px rgb(183, 183, 185);
}
</style>