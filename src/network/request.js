import axios from 'axios';
import router from '../router'
import { Notify,Toast } from "vant";
export function request (config) {
    const instance = axios.create({
        baseURL:'https://api.shop.eduwork.cn',
        timeout:4000
    })

    //请求次数 超时时间
    instance.defaults.retry = 4;
    instance.defaults.retryDelay = 1000;
    //请求拦截
    instance.interceptors.request.use(config=>{
        //如果有一个接口需要认证才可以访问，就在这统一设置 token
        const token = window.localStorage.getItem("token")
        if(token){
            config.headers.Authorization = 'Bearer'+token;
        }
        //直接放行
        return config;
    },err=>{

    })

    //响应拦截

    instance.interceptors.response.use(res=>{
        // res.data?res.data:res
        return res ;
    }, err=>{
        //验证登录
       if(err.response.status == '401'){
        Toast.fail('你还没有登录')
        setTimeout(() => {
            router.push({path:'/login'})
        }, 500);
       }
       Notify(err.response.data.errors[Object.keys(err.response.data.errors)][0]);      
    })

    return instance(config);
}