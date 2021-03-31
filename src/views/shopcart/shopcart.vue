<template>
  <div>
    <nav-bar>
      <template v-slot:default>商品购物车</template>
    </nav-bar>
    <div class="cart-box">
      <div class="empty" v-if="!list.length">
          <!-- <img src="" alt=""> -->
          <!-- <div class="title">购物车为空</div> -->
          <!-- <h1 class="title">什么？你的购物车尽然是空的？还不快去添加商品</h1> -->
          <!-- <van-button round type="primary" block>前往购物</van-button> -->
        </div>
      <div class="cart-body" ref="root">
        <van-checkbox-group v-model="result"
        @change="groupChange" ref="checkboxGroup">
          <van-swipe-cell
            :right-width="50"
            v-for="(item, index) in list"
            :key="index"
          >
            <div class="good-item">
              <van-checkbox :name="item.id" />
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
                  <van-stepper
                    integer
                    :min="1"
                    :max="item.goods.stock"
                    :name="item.id"
                    :model-value="item.num"
                    async-change
                    :before-change="check"
                    @Change="onChange"
                  />
                </div>
              </div>
            </div>
            <template #right>
              <van-button
                style="height: 120px"
                square
                icon="delete"
                type="danger"
                class="delete-button"
                @click="deleteGood(item.id)"
              />
            </template>
          </van-swipe-cell>
        </van-checkbox-group>
      </div>
      <van-submit-bar :price="total*100" button-text="结算" @submit="onSubmit">
        <van-checkbox @click="allCheck" v-model:checked="checkAll">全选</van-checkbox>
      </van-submit-bar>
    </div>
  </div>
</template>


<script>
import NavBar from "components/common/navbar/NavBar";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { getCart, deleteCartItem, checkedCard, modifyCart } from "network/cart";
import { onMounted, reactive, toRefs, ref, computed } from "vue";
import { Toast } from "vant";
export default {
  name: "shopacrt",
  components: {
    NavBar,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    //数据模型 用于遍历
    const state = reactive({
      list: [],
      invalid: false,
      result:[],
      checkAll:true
    });
    //init 数据请求初始化
    const init = () => {
      Toast.loading("加载中");
      //调取接口 获取详情  include=goods 必传项
      getCart("include=goods").then((res) => {
        //录入数据
        state.list = res.data.data;
        //录入数据 复选框
        state.result = res.data.data.filter(n=>n.is_checked == 1).map( item => item.id) 
        Toast.clear();
      });
    };

    //检查多次点击 绑定事件
    const check = (val) => {
      //放行
      if (!state.invalid) {
        state.invalid = true;
        setTimeout(() => {
          state.invalid = false;
        }, 1000); //点击间隔 
        return true;
      } else {
        //拦截
        return false;
      }
    };

    //异步改变购物车数量  多次点击 事件
    const onChange = (value, detail) => {
     // 调取请求 id num
      modifyCart(detail.name, { num: value }).then((res) => {
        Toast.success("")
        state.list.forEach(item =>{
          if(item.id == detail.name){
            item.num =value
          }
        })
       
      });
    };
    //事件 复选框勾选 
    const groupChange = (result)=>{
       if(result.length == state.list.length) {
         state.checkAll =true;
       }else {
         state.checkAll = false;
       }
        state.result = result
        //改变数据库的信息 
        checkedCard({cart_ids:result}).then(res =>{
        })
    }
    //全选 事件
    const allCheck = ()=>{
      if(!state.checkAll) {
        state.result = state.list.map(item=>item.id)
        state.checkAll = true;
      }else {
        state.result =  [];
        state.checkAll = false
      }
    }
  //删除商品
    const deleteGood = (id)=>{
        deleteCartItem(id).then(res =>{
          //重获数据
          init()
          //改变购物车数量 vuex
          store.dispatch("updataCart");
        })
    }
    // 计算总价  
    const total = computed(()=>{
      let sum =0;
        state.list.filter(item =>state.result.includes(item.id)).forEach(item => {
          sum += parseInt(item.num)*parseInt(item.goods.price)
        })

      return sum
    })
    
    //创建订单判定
    const onSubmit = ()=>{
        if(state.result.length == 0){
          Toast.fail('请选择商品')
          return
        }else{
          router.push({path:'/createorder'})
        }
    }
    /* ------------------------------开启周期------------------- */
    onMounted(() => {
      //发送请求
      init();
    });


    return {
      ...toRefs(state),
      onChange,
      check,
      groupChange,
      allCheck,
      deleteGood,
      total,
      onSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
.cart-box {
  margin-top: 50px;
  margin-bottom: 100px ;
}
.cart-body {
  // padding: 2px;
  .van-swipe-cell {
    margin: 10px 0;
    box-shadow: 0 2px 3px gray;
  }
}
.good-item {
  display: flex;
  // padding: 10px;
  padding: 10px 10px 0 10px;
  .good-desc {
    flex: 1;

    .good-title {
      display: flex;
      margin-top: 20px;
      justify-content: space-between;
    }
    .good-btn {
      display: flex;
      margin-top: 25px;
      justify-content: space-between;
      .price {
        color: red;
      }
    }
  }
  img {
    height: 100px;
  }
}

.van-submit-bar {
  margin-bottom: 50px;
  z-index: -99;
}
</style>