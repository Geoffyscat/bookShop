<template>
  <div>
    <nav-bar> 订单预览 </nav-bar>

    <div class="main">
      <div class="addres" @click="goTo">
        <div class="addres-com">
          <div class="addres-top">
            <span>{{ address.name }}</span>
            <span>{{ " " + address.phone }}</span>
          </div>
          <div class="address-bot">
            <span
              >{{ address.province }} {{ address.city }} {{ address.county }}
              {{ address.address }}</span
            >
          </div>
        </div>

        <div>
          <van-icon name="arrow" />
        </div>
      </div>

      <div class="good">
        <div class="good-item" v-for="item in cartList" :key="item.id">
          <div class="good-img">
            <img :src="item.goods.cover_url" alt="" />
          </div>
          <div class="good-desc">
            <div class="good-title">
              <span>{{ item.goods.title }}</span>
              <span>x{{ item.num }}</span>
            </div>
            <div class="good-btn">
              <div class="price">
                <small>￥</small>{{ item.goods.price + ".00" }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="on">
        <van-submit-bar
          :price="totle"
          button-text="创建订单"
          @submit="onSubmit"
        />
      </div>
      <div>
        <van-popup
          position="bottom"
          :style="{ height: '30%' }"
          v-model:show="showPay"
          closeable
          @close='close'
        >
          <div>
            <van-grid :border="false" :column-num="2"
            >
              <van-grid-item>
                支付宝的二维码<br/>
                <van-image width="150" height="150" :src="aliyun" />
              </van-grid-item>
              <van-grid-item>
                微信的支付码 <br/>
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
import NavBar from "../../components/common/navbar/NavBar.vue";
import { Toast, ContactCard, Popup } from "vant";
import { computed, onMounted, reactive, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { getOrderPreview,creatOrder,payOrder,payOrderStatus } from "network/order";
export default {
  name: "CreateOrder",
  components: {
    NavBar,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const state = reactive({
      cartList: [], //购物车列表
      address: {}, //地址信息
      showPay: false, //弹出层 控制
      orderNo: "", //订单ID
      aliyun: "", //阿里云支付二维码图片
      weChat: "", //微信支付图片
    });

    const init = () => {
      Toast.loading("加载中");
      //获取 订单视图信息
      getOrderPreview().then((res) => {
        let address = res.data.address.filter((item) => item.is_default == "1");
        if (address.length == 0) {
          state.address = {
            address: "还没设置默认地址，请选择或添加地址信息",
          };
        } else {
          state.address = address[0];
        }
        state.cartList = res.data.carts;
      });
    };

    //计算总价
    const totle = computed(() => {
      let sum = 0;
      state.cartList.map((item) => {
        sum += parseInt(item.num) * parseInt(item.goods.price);
      });
      return sum * 100;
    });

    //地址修改跳转
    const goTo = () => {
      router.push({ path: "/address" });
    };
    //创建订单确认
    const onSubmit = () => {
      let address_id = state.address.id;
      //需要地址ID
      creatOrder({ address_id }).then((res) => {
        store.dispatch("updataCart");
        //弹出层
        state.showPay = true;
        //保存订单ID
        state.orderNo = res.data.id;
        //发起支付信息
        payOrder(state.orderNo, { type: "aliyun" }).
          then((res) => {
            //保存二维码图片地址
            state.aliyun = res.data.qr_code_url;
            state.weChat = res.data.qr_code_url;
          });

          //轮询查看
          const timer = setInterval(() => {
            //需要订单号
            payOrderStatus(state.orderNo).then(res =>{
                //2表示已支付
                if(res.data == 1){
                    Toast("支付成功")
                    //清除定时器
                    clearInterval(timer)
                    setTimeout(()=>{
                      router.push({path:'/orderdetail',query:{id:state.orderNo}})
                    },1000)
                }
            })
          }, 2000);
      });
    };
    const close = ()=>{
      router.push({path:'/orderdetail'})
    }
    //  绑定周期
    onMounted(() => {
      init();
    });

    return {
      ...toRefs(state),
      totle,
      goTo,
      onSubmit,
      close,
    };
  },
};
</script>

<style lang="scss" scoped >
.main {
  margin-top: 50px;
}

.addres {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: 70px;
  box-shadow: 0 2px 3px rgb(190, 188, 188);

  .addres-com {
    flex: 1;
    text-align: left;
    .address-bot {
      margin-top: 5px;
    }
  }
}
.good-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  img {
    height: auto;
    width: auto;
    max-width: 100px;
    max-height: 100px;
  }
  .good-desc {
    flex: 1;
    display: flex;
    // align-items: center;
    flex-direction: column;
    padding: 10px;
    .good-title {
      display: flex;
      justify-content: space-between;
    }
    .good-btn {
      margin-top: 25px;
      display: block;
      text-align: left;
      color: red;
    }
  }
}

.van-submit-bar {
  bottom: 50px;
  z-index: 0;
}
</style>