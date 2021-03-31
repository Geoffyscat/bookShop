<template>
  <div>
    <nav-bar>
      <template v-slot:default> 用户注册 </template>
    </nav-bar>

    <div class="content">
      <div class="userimg">
        <van-image
          width="100"
          height="100"
          src="https://user-images.githubusercontent.com/499550/93624428-53932780-f9ae-11ea-8d16-af949e16a09f.png"
        />
      </div>
      <h1>welcome-onepice</h1>
      <div class="from">
        <van-form @submit="onSubmit">
          <van-field
            v-model="name"
            name="用户名"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
          <van-field
            v-model="password_confirmation"
            type="password"
            name="确认密码"
            label="确认密码"
            placeholder="请再次输入密码"
            :rules="[{ required: true, message: '密码不一致' }]"
          />
          <van-field
            v-model="email"
            name="电子邮箱"
            label="电子邮箱"
            placeholder="请输入邮箱地址"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <div class="tologin" @click="$router.push({path:'/login'})">已有账号，点我登陆</div>
          <div style="margin: 16px">
            <van-button round block type="primary" native-type="submit"
              >注册</van-button
            >
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>


<script>
import NavBar from "components/common/navbar/NavBar";
import { ref, toRefs, reactive } from "vue";
import { register } from "network/user";
import { Notify,Toast } from "vant";
import {useRouter} from 'vue-router'
export default {
  components: { NavBar },
  name: "Reglister",
  components: {
    NavBar,
  },
  setup() {
      let router = useRouter()
    const userinfo = reactive({
      name: "",
      password: "",
      password_confirmation: "",
      email: "",
    });

    const onSubmit = () => {
      //先验证
      if (userinfo.password != userinfo.password_confirmation) {
        Notify({ type: "danger", message: "密码不一致" });
      } else {
        register(userinfo).then(res=>{
            console.log(res);
            if(res.status ==201 ){
                Toast.success("注册成功")

                setTimeout(() => {
                    router.push({path:'/login'})
                }, 1500);
                
                userinfo.password = ''
                userinfo.password_confirmation = ''
            }
        })
        //提交给服务器
      }

    };
    return {
      ...toRefs(userinfo),
      onSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
.userimg {
  margin-top: 20%;
  width: auto;
  height: auto;
  max-width: 100%1;
  max-width: 100%;
}
.tologin{
    color: var(--color-tint);
    line-height: 20px;
    float: left;
    padding: 2ch ;
}
</style>