// #ifndef VUE3
import Vue from 'vue'
import App from './App'

// 导入网络请求的包
import {
	$http
} from "@escook/request-miniprogram"
uni.$http = $http //每个页面都可以使用uni.$http发送网络请求了

// 配置请求根路径
$http.baseUrl = 'https://www.uinav.com'


// 请求拦截器
$http.beforeRequest = function(options) {
	uni.showLoading({
		title: "加载中..."
	})
}

// 响应拦截器
$http.afterRequest = function() {
	uni.hideLoading()
}

// 为了能够方便使用提示信息,这里全局挂载一个提示信息方法,只需要调用既可以使用
uni.$showMsg = function(title = "数据加载失败，请重试", duration = 1500) {
	uni.showToast({
		title,
		duration,
		icon: "fail"
	})
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif