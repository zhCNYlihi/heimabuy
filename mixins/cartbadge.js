import {
	mapGetters
} from "vuex"

export default {
	computed: {
		...mapGetters("moduleCart", ["total"])
	},
	// 在页面加载时调用内置onshow方法,加载
	onShow() {
		this.setCartBadge()
	},
	// 注意:
	// 在这里面使用立即监听事件,当数量发生改变.重新调用设置角标方法
	watch: {
		total: {
			handler(newValue) {
				this.setCartBadge()
			},
			immediate: true
		}
	},
	methods: {
		setCartBadge() {
			if (this.total) { //如果有值，就设置角标
				uni.setTabBarBadge({
					index: 2, //底部导航栏购物车所在位置
					text: this.total + "", //text属性必须是字符串类型
				})
			} else { //没有值，就隐藏
				uni.removeTabBarBadge({
					index: 2, //底部导航栏购物车所在位置
				})
			}

		}
	},
}