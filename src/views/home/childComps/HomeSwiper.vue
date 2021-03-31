<template>
  <div>
    <van-swipe
      v-if="banners.length"
      class="my-swipe"
      :autoplay="3000"
      indicator-color="white"
    >
      <van-swipe-item v-for="(item, index) in banners" :key="item.id">
        <img v-lazy="item.img_url" alt="" />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
export default {
  props: {
    banners: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>

<style lang="scss" scoped>


.my-swipe .van-swipe-item {

  img {
  width: 100%;
  height: 150px;
  }
}
</style>