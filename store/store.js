// // 初始化store仓库实例,在uniapp中,主要使用vuex
// // 1.引入vue和vuex
import Vue from 'vue'
import Vuex from 'vuex'
// (1)导入购物车的vuex模块
import moduleCart from './cart.js'
// (2)导入用户地址的vuex模块
import moduleUserAddress from './useraddress.js'
// // 2.使用Vuex
Vue.use(Vuex)
// // 3.创建实例对象
const store = new Vuex.Store({
	// store仓库的配置项
	modules: {
		// 这样就可以通过store.state.moduleCart、 store.getters['moduleCart/getCartItems'] 等方式访问和使用购物车模块的状态、 getter等。
		moduleCart, //是'moduleCart':moduleCart的简便方法，就可以使用moduleCart来使用该购物车仓库
		moduleUserAddress, //使用moduleUserAddress访问该购物车的仓库
	},
})
// // 4.暴露出去
export default store
// // 5.在main中使用