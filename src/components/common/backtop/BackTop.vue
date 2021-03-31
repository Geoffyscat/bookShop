<template>
    <div id="top" @click="backtop"></div>    
</template>

<script>
export default {
    name:   "BackTop",
    setup(props,{emit}){
        let backtop = ()=>{
            
            // emit("btop");
        }
        return{
            backtop
        }
    }
}
</script>


<style lang="scss"  scoped>
    #top {
        width: 40px;
        height: 40px;
        position: fixed;
        bottom: 80px;
        right: 30px;
        z-index: 20;
        border-radius: 50%;
        transform: scale(0.8);
        box-shadow: 5px 5px 8px #555;
        background: var(--color-tint) url("~assets/images/up.png") no-repeat center center;
    }
</style>