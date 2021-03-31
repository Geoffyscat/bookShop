<template>
  <div>
    <nav-bar>
      <template v-slot:default> {{ title }} </template>
    </nav-bar>
    <div class="addressedit">
      <van-address-edit
        :area-list="areaList"
        :address-info="addressInfo"
        :show-postal="false"
        :show-delete="type == 'edit'"
        show-set-default
        show-search-result
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSave"
        @delete="onDelete"
      />
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import NavBar from "components/common/navbar/NavBar";
import { AddressList, Toast } from "vant";
import { computed, onMounted, reactive, ref, toRefs } from "vue";
import {
  addAddress,
  EditAddress,
  DeleteAddress,
  getAddressDetail,
} from "network/address";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "AddressEdit",
  components: {
    NavBar,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const areaList = store.state.areaList;

    const state = reactive({
      areaList: {
        province_list: {},
        city_list: {},
        county_list: {},
      },
      searchResult: [],
      addressInfo: {},
      type: "add",
      addressId: "",
    });

    onMounted(() => {
      //从路由里获取参数 判断是添加还是修改
      const { type, addressId } = route.query;
      state.type = type;
      state.addressId = addressId;

      if (type == "edit") {
        getAddressDetail(addressId).then((res) => {
          const addressDetail = res.data;
          state.addressInfo = {
            name: addressDetail.name,
            tel: addressDetail.phone,
            province: addressDetail.province,
            city: addressDetail.city,
            county: addressDetail.county,
            addressDetail: addressDetail.address,
            isDeafult: !!addressDetail.is_default,
          };
        });
      }
    });

    //事件 保存地址 发送数据到后台
    const onSave = (content) => {
      //获取参数 上下文
      const data = {
        name: content.name,
        address: content.addressDetail,
        phone: content.tel,
        province: content.province,
        city: content.city,
        county: content.county,
        is_default: content.isDefault ? 1 : 0,
      };
      if (state.type == "edit") {
        //修改
        EditAddress(state.addressId, data);
        Toast.success("修改成功");
      } else if (state.type == "add") {
        //调取  添加地址API 将数据传递
        addAddress(data);
        Toast("保存成功");
      }
      //延时路由跳转回去
      setTimeout(() => {
        router.back();
      }, 1000);
    };
    //标题修改 计算属性
    const title = computed(() => {
      return state.type == "add" ? "新增地址" : "修改地址";
    });
    //事件  删除
    const onDelete = () => {
      DeleteAddress(state.addressId).then(res =>{
           Toast.success("删除成功");
           setTimeout(() => {
             router.back()
           }, 1000);
      })

    };

    return {
      title,
      ...toRefs(state),
      onSave,
      onDelete,
      areaList,
    };
  },
};
</script>

<style lang="scss" >
.addressedit {
  padding-top: 50px;
}
.van-address-list__bottom {
  position: fixed;
  bottom: 60px;
  z-index: 0;
}
</style>
