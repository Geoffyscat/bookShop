import {request} from './request'

//添加地址
export function addAddress(data) {
    return request({
        url:'/api/address',
        method:"post",
        data
    })
}

//编辑地址
export function EditAddress(id,data) {
    return request({
        url:`/api/address/${id}`,
        method:"put",
        data
    })
}


//删除地址
export function DeleteAddress(id) {
    return request({
        url:`/api/address/${id}`,
        method:"delete",
    })
}

//地址列表
export function getAddressList() {
    return request({
        url:'/api/address',
    })
}
//地址详情  
export function getAddressDetail(id) {
    return request({
        url:`/api/address/${id}`,
    })
}