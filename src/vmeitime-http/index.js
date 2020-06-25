import http from './interface'

/**
 * 将业务所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 * 
 */

// 单独导出(测试接口) import {test} from '@/common/vmeitime-http/'
export const login = (data) => {
	return http.request({
		url: '/logistics/user/login',
		data,
	})
}
export const getOrderList = (data, token) => {
	return http.request({
		url: '/logistics/order/getOrderList',
		token
	})
}
export const getCommodityByOrderId = (data, token) => {
	return http.request({
		url: '/logistics/order/getCommodityByOrderId',
		data,
		token
	})
}
export const getByCode = (data, token) => {
	return http.request({
		url: '/logistics/commodity/getByCode',
		data,
		token
	})
}
export const addCommodity = (data, token) => {
	return http.request({
		url: '/logistics/order/addCommodity',
		data,
		token
	})
}
export const updateCommodity = (data, token) => {
	return http.request({
		url: '/logistics/order/updateCommodity',
		data,
		token
	})
}
export const deleteCommodity = (data, token) => {
	return http.request({
		url: '/logistics/order/deleteCommodity',
		data,
		token
	})
}
export const updateOrderWeight = (data, token) => {
	return http.request({
		url: '/logistics/order/updateOrderWeight',
		data,
		token
	})
}
// 默认全部导出  import api from '@/common/vmeitime-http/'
export default {
	login,
	getOrderList,
	getCommodityByOrderId,
	getByCode,
	addCommodity,
	deleteCommodity,
	updateCommodity,
	updateOrderWeight
}