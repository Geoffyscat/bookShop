import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 样式导入
import 'vant/lib/index.css';
//vant组件引入
import { Swipe,SwipeItem,Lazyload,Badge,Sidebar,SidebarItem,Collapse,CollapseItem,Tab,Tabs,Card,Image as VanImage,Tag,Button,Form,Field,CheckboxGroup,Checkbox,SubmitBar,Stepper,SwipeCell,Icon,AddressList,AddressEdit,Area,ContactCard,Popup,Grid, GridItem,List,PullRefresh} from 'vant';



createApp(App)
    .use(store)
    .use(router)
    .use(Swipe)
    .use(SwipeItem)
    .use(Lazyload,{
        loading:require('./assets/images/lazy.png')
    })
    .use(Sidebar)
    .use(SidebarItem)
    .use(Badge)
    .use(Collapse)
    .use(CollapseItem)
    .use(Tab)
    .use(Tabs)
    .use(Card)
    .use(VanImage)
    .use(Tag)
    .use(Button)
    .use(Form)
    .use(Field)
    .use(CheckboxGroup)
    .use(Checkbox)
    .use(SubmitBar)
    .use(Stepper)
    .use(SwipeCell)
    .use(Icon)
    .use(AddressList)
    .use(AddressEdit)
    .use(Area)
    .use(ContactCard)
    .use(Popup)
    .use(Grid)
    .use(GridItem)
    .use(List)
    .use(PullRefresh)
    .mount('#app')

