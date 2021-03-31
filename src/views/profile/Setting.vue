<template>
    <div>
        <nav-bar>
            <template v-slot:default>
            setting
            </template>
        </nav-bar>
        
    </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
export default {
    name:"Setting",
    components:{
       NavBar,
    },
}
</script>