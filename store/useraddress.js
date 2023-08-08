export default {
	namespaced: true, //开启命名空间
	state: () => ({
		// addressList: {}  //读取也是动态读取本地存储
		addressList: JSON.parse(uni.getStorageSync("address") || "{}")
	}),
	mutations: {
		// 1.选择收件地址添加
		addAddress(state, res) {
			state.addressList = res
			// 调用数据可持久化
			this.commit("moduleUserAddress/setAddressStorge")
		},
		// 2.数据可持久化操作
		setAddressStorge(state) {
			uni.setStorageSync("address", JSON.stringify(state.addressList))
		}
	},
	getters: {
		addressStr(state) {
			if (!state.addressList.provinceName) return "" //判断是否存在省的信息
			return state.addressList.provinceName + state.addressList.cityName + state.addressList.countyName + state
				.addressList.detailInfo
		}
	}
}