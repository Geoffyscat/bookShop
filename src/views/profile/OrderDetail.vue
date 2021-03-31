<template>
  <div>
    <nav-bar>
      <template v-slot:default> 订单详情 </template>
    </nav-bar>

    <div class="main">
      <div class="content">
        <div class="paydetail">
          <span><small>订单状态:</small>{{ statusString }}</span>
          <span><small>订单编号:</small>{{ orderNo }}</span>
          <span><small>下单时间:</small>{{ created_at }}</span>
        </div>
        <div class="btn">
          <van-button
            v-if="status == 1"
            @click="showPay"
            block
            hairline
            type="primary"
            color="red"
            >去支付</van-button
          >
          <van-button v-if="status == 2" @click="confirm" block hairline type="default"
            >确认订单</van-button
          >
        </div>
      </div>
      <div class="paydetail">
        <span><small>商品总价:</small>{{ amount }}</span>
        <span><small>物流配送:</small>普通快递</span>
      </div>
      <div class="list">
        <div class="listCon" v-for="item in orderDetail">
          <van-card
            :num="item.num"
            :price="item.goods.price + '.00'"
            :desc="item.goods.description"
            :title="item.goods.title"
            :thumb="item.goods.cover_url"
          />
        </div>
      </div>
      <div>
        <van-popup
          position="bottom"
          :style="{ height: '30%' }"
          v-model:show="show"
          closeable
          @close="close"
        >
          <div>
            <van-grid :border="false" :column-num="2">
              <van-grid-item>
                支付宝的二维码<br />
                <van-image width="150" height="150" :src="aliyun" />
              </van-grid-item>
              <van-grid-item>
                微信的支付码 <br />
                <van-image width="150" height="150" :src="weChat" />
              </van-grid-item>
            </van-grid>
          </div>
        </van-popup>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";

import { Button, Card, Toast, Popup } from "vant";
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, reactive, toRefs } from "vue";

import { getOrderDetail, payOrder, payOrderStatus,confirmOrder } from "network/order";
import SettingVue from "./Setting.vue";
export default {
  name: "orderDetail",
  components: {
    NavBar,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      orderId: '', //订单id
      orderNo: "", //订单编号
      created_at: "", //订单创建时间
      orderDetail: {}, //订单信息
      status: "", //订单状态
      amount: "", //商品总价
      show: false, //支付弹出层  IO
      aliyun: "", //阿里云支付二维码图片
      weChat: "", //微信支付图片
      timer: "", //定时器
    });

    //初始化信息
    const init = () => {
      const { id } = route.query;
      state.orderNo = id;
      getOrderDetail(id).then((res) => {
        //状态码
        state.amount = res.data.amount;
        state.orderNo = res.data.order_no;
        state.created_at = res.data.created_at;
        state.status = res.data.status;//res.data.status
        state.orderId = res.data.id;
        if (res.data.orderDetail == 0) {
          console.log("商品为空");
        } else {
          state.orderDetail = res.data.orderDetails.data;
        }
      });
    };
    //计算状态
    const statusString = computed(() => {
      let statusArray = [
        "",
        "已下单",
        "已支付",
        "待发货",
        "确认收货",
        "已过期",
      ];
      return statusArray[state.status];
    });
    //周期
    onMounted(() => {
      Toast.loading({ message: "加载中", forbidClick: true });
      init();
      Toast.clear();
    });
    //事件  点击支付
    const showPay = () => {
      state.show = true;
      //发起支付信息
      payOrder(state.orderId, { type: "aliyun" }).then((res) => {
        //保存二维码图片地址
        state.aliyun = res.data.qr_code_url;
        state.weChat = res.data.qr_code_url;
      });

      //轮询判断是否支付
      state.timer = setInterval(() => {
        //需要商品id
        payOrderStatus(state.orderId).then((res) => {
          if (res.data == 2) {
              Toast.success("支付成功")
            clearInterval(state.timer);
            setTimeout(() => {
                router.push({path:''})
            }, 1000);
          }
        });
      }, 2000);
    };
    //事件 确认订单
    const confirm = ()=>{
        console.log("11111");
        //发送订单确认 需要传递商品id
        confirmOrder(state.orderId).then(res =>{
                console.log(res);
                if(res.data.status_code == 204){
                    Toast.success("确认成功")
                    init()
                }
        })
    }
    //弹出层关闭
    const close = () => {
      clearInterval(state.timer);
    };
    return {
      ...toRefs(state),
      statusString,
      showPay,
      close,
      confirm,
    };
  },
};
</script>

<style lang="scss">
.main {
  margin-top: 50px;
  .content {
    box-shadow: 0 2px 10px #f1eeee;
  }
  .list {
    width: 100%;
    // padding: 20px;
    text-align: left;
    margin-bottom: 50px;
    .listCon {
      margin-top: 10px;
    }
  }
  .paydetail {
    text-align: left;
    padding: 20px;
    span {
      display: block;
      height: 20px;
      line-height: 20px;
      small {
        color: red;
      }
    }
  }
  .btn {
    padding: 0 20px;
    margin-bottom: 20px;
    .van-button {
      margin-top: 10px;
    }
  }
}
</style>