import {getCart} from 'network/cart'
const actions = {
    updataCart({commit}) {
        getCart().then(res=>{
            commit('addCart',{count:res.data.data.length || 0})
        })
    }
};


export default actions