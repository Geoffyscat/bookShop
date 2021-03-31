<template>
    <div>
        <nav-bar>
            <template v-slot:default>
            about
            </template>
        </nav-bar>
        
    </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
export default {
    name:"About",
    components:{
       NavBar,
    },
}
</script>