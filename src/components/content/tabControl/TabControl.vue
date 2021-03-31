<template>
    <div class="tab-control">
        <div class="tab-control-item "
        v-for="(item,index) in titles" :key="index"
        @click="TabIndex(index)"
        :class="{active:index==nowIndex}">
            <span>{{item}}</span>
        </div>
    </div>
</template>

<script>
import {inject, provide, ref} from "vue"
export default {
    name:"TabControl",
    props:{
        titles:{
            type:Array,
            default(){
                return []
            }
        }
    },
    setup(){
        let nowIndex = ref(0)
        const fn = inject('get')
        const TabIndex = (index)=>{
            nowIndex.value = index
            fn(index)
        }
        return{
            TabIndex,
            nowIndex
        }
    }
}
</script>

<style lang="scss" scoped>
    .tab-control {
        height: 40px;
        width: 100%;
        line-height: 40px;
        display: flex;
        font-size: 14px;
        text-align: center;
        background-color: #fff;
        position:sticky;
        top:0;
        z-index: 11;
        .tab-control-item {
            flex: 1;
            span {
                padding: 5px;
            }
        }

        .active {
            
            color: var(--color-tint);
            span {
                border-bottom: 3px solid var(--color-tint);
            }
        }
    }
</style>