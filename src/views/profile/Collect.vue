<template>
    <div>
        <nav-bar>
            <template v-slot:default>
            collect
            </template>
        </nav-bar>
        
    </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
export default {
    name:"Collect",
    components:{
       NavBar,
    },
}
</script>