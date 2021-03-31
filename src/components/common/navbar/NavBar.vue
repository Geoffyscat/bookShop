<template>
    <div class="nav-bar">
        <div class="left" @click="comeback"><slot name="left"><i class="iconfont iconleft-arrow"></i></slot></div>
        <div class="center"><slot>null</slot></div>
        <div class="right"><slot name="right"></slot></div>
    </div>
</template>

<script>
import {useRouter} from 'vue-router'
import {ref} from 'vue';
export default {
    name:"NavBar",
    setup(){
        const router = useRouter();
        const comeback = ref( ()=>{
              router.go(-1);
        })

        return {
            comeback
        }
    }
}
</script>

<style scoped>
    .nav-bar {
        background-color: var(--color-tint);
        color: white;
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10;
        height: 45px;
        line-height: 45px;
        text-align: center;
        box-shadow: 0 2px 0px rgba(100, 100, 100, 0.1);
    }
    .left,.right {
        width: 20%;
    }
    .center {
        flex: 1;
    }
    .iconfont{
        float: left;
        margin-left: 15%;
    }
</style>