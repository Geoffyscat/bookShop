<template>
  <div>
    <nav-bar>
      <template v-slot:default> 登录 </template>
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
            v-model="email"
            name="邮箱"
            label="邮箱"
            placeholder="邮箱"
            :rules="[{ required: true, message: '请填写邮箱' }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
          <div class="tologin" @click="$router.push({ path: '/register' })">
            立即注册
          </div>
          <div style="margin: 16px">
            <van-button round block type="primary" native-type="submit"
              >登录</van-button
            >
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>


<script>
import NavBar from "components/common/navbar/NavBar";
import { toRefs, reactive } from "vue";
import { login } from "network/user";
import { Toast } from "vant";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default {
  name: "Login",
  components: {
    NavBar,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const userinfo = reactive({
      email: "",
      password: "",
    });
    const onSubmit = () => {
      login(userinfo).then((res) => {
        //保存token
        window.localStorage.setItem("token", res.data.access_token);
        //在 vuex islogin 设置为真
        store.commit("setIsLogin", true);

        Toast.success("登录成功");
        userinfo.email = "";
        userinfo.password = "";
        store.dispatch("updataCart")
        setTimeout(() => {
          router.go(-1);
        }, 500);
      }).catch(err =>{
        
      });
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
.tologin {
  color: var(--color-tint);
  line-height: 20px;
  float: left;
  padding: 2ch;
}
</style>