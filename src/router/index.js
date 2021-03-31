import { createRouter, createWebHistory } from 'vue-router'
import {Notify,Toast} from 'vant'
import store from "../store";

const Home = ()=> import("../views/home/Home");
const Categroy = ()=> import("../views/category/category");
const Detail = ()=> import("../views/detail/detail");
const Profile = ()=> import("../views/profile/profile");
const ShopCart = ()=> import("../views/shopcart/shopcart");
const Reglister = ()=>import('../views/profile/Reglister')

const Login = ()=> import("../views/profile/Login")
const Address = ()=> import("../views/profile/Address");
const AddressEdit = ()=> import("../views/profile/AddressEdit");
const About = ()=> import("../views/profile/About");
const Collect = ()=> import("../views/profile/Collect");
const Order = ()=> import("../views/profile/Order");
const OrderDetail = ()=> import("../views/profile/OrderDetail");
const Setting = ()=> import("../views/profile/Setting");


const CreateOrder = ()=> import('../views/profile/CreateOrder');
const routes = [
  {
    path: '',
    name: 'DefaultHome',
    component: Home,
    // redirect:"/category",
    meta:{
      title:"首页"
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta:{
      title:"首页"
    }
  },
  {
    path: '/category',
    name: 'Category',
    component:Categroy,
    meta:{
      title:"首页-分类"
    }
  },
  {
    path: '/detail',
    name: 'Detail',
    component:Detail,
    meta:{
      title:"首页-详情"
    } 
  },
  {
    path: '/profile',
    name: 'Profile',
    component:Profile,
    meta:{
      title:"首页-个人中心",
      isAuthRequired:true
    }
  },
  {
    path:'/address',
    name:'Address',
    component:Address,
    meta:{
      title:'个人-地址管理'
    }
  },
  {
    path:'/addressedit',
    name:'AddressEdit',
    component:AddressEdit,
    meta:{
      title:'个人-地址编辑'
    }
  },
  {
    path:'/about',
    name:'About',
    component:About,
    meta:{
      title:'个人-关于'
    }
  },
  {
    path:'/collect',
    name:'Collect',
    component:Collect,
    meta:{
      title:'个人-收藏'
    }
  },
  {
    path:'/order',
    name:'Order',
    component:Order,
    meta:{
      title:'个人-订单'
    }
  },
  {
    path:'/createorder',
    name:'CreateOrder',
    component:CreateOrder,
    meta:{
      title:'个人-订单预览'
    }
  },
  {
    path:'/orderdetail',
    name:'OrderDetail',
    component:OrderDetail,
    meta:{
      title:'个人-订单详情'
    }
  },
  {
    path:'/setting',
    name:'Setting',
    component:Setting,
    meta:{
      title:'个人-设置'
    }
  },
  {
    path: '/shopcart',
    name: 'ShopCart',
    component:ShopCart,
    meta:{
      title:"首页-购物车",
      isAuthRequired:true
    }
  },
  {
    path: '/register',
    name: 'register',
    component:Reglister,
    meta:{
      title:"注册"
    }
  },
  {
    path: '/login',
    name: 'login',
    component:Login,
    meta:{
      title:"登录"
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes

})

//路由前置钩子
router.beforeEach((to,from,next)=>{
//如果没登录再次跳转到login
  if(to.meta.isAuthRequired && store.state.user.isLogin == false){
    // Notify({message:'你还没登录，请先登录',duration: 1000});
    Toast.fail("你还没有登录")
    return next('/login')
  }else {
    next();
  }
  //设置页面标题
  document.title = to.meta.title
})


export default router
