<template>
  <div class="recommend">
    <div class="recommend-item" v-for="item in recommends.slice(0,4)" :key="item.id" >
      <a href="" @click.prevent="goDetail(item.id)">
        <img v-lazy="item.cover_url" alt="网路超时" />
        <div>{{item.title}}</div>
      </a>
    </div>
    <!-- <div class="recommend-item">
      <a href="#">
        <img src="~assets/images/2.jpg" alt="" />
        <div>liunx内核</div>
      </a>
    </div>
    <div class="recommend-item">
      <a href="#">
        <img src="~assets/images/2.jpg" alt="" />
        <div>liunx内核</div>
      </a>
    </div>
    <div class="recommend-item">
      <a href="#">
        <img src="~assets/images/2.jpg" alt="" />
        <div>liunx内核</div>
      </a>
    </div> -->
  </div>
</template>

<script>
import {useRouter} from 'vue-router';
export default {
  name: "RecommendView",
  props:{
      recommends:{
          type :Array,
          default(){
              return [];
          }
      }
  },
  setup(){
      const router = useRouter()

      const goDetail = (id)=>{
          router.push({path:"/detail",query:{id}})
      }
      return {
          goDetail
      }
  }
};
</script>

<style lang="scss" scoped>
    .recommend{
        width: 100%;
        height: 120px;
        display: flex;
        font-size: 12px;
        text-align: center;
        border-bottom: solid 10px rgb(241, 239, 239);
        margin: 15px 0 0;
        border-radius: 5px;
        .recommend-item {
            flex: 1;
            
            img {
                width: 70px;
                height: 70px;
            }
        }
    }
    
</style>