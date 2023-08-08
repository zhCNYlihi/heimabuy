export default {
	// 开启具名空间,这样使用该仓库的数据和方法就需要使用该名称
	namespaced: true,
	// 这样就可以通过store.state.moduleCart、store.getters['moduleCart/getCartItems']等方式访问和使用购物车模块的状态、getter等。
	state: () => ({
		// 3.3对于数据读取也要修改，通过提供的api进行读取
		// cartList: [], //用来存放购物车的数据
		// 修改为:（没有数据可以写成空数组）
		cartList: JSON.parse(uni.getStorageSync("cart") || "[]")
	}),
	// 在state中的数据,只能通过muitations方法来进行修改，作用：修改state数据，进行响应式更新
	mutations: {
		// 1.添加购物车
		// 这里传入两个数据,一个是state仓库,一个是传入的商品信息
		addcart(state, goodsinfo) {
			// 2.使用find方法查找state的cartList数组中是否和该商品id匹配,根据返回值进行不同操作
			let findResult = state.cartList.find(item => item.goods_id == goodsinfo.goods_id)
			// 3.判断findResult,如果是ture,存在购物车中就增加数量,如果没有undefind就push到购物车
			if (findResult) { //ture
				// 存在商品,数量+1
				findResult.goods_count += 1
			} else {
				// 不存在商品,添加商品
				state.cartList.push(goodsinfo)
			}
			// 3.2每次添加完之后通过commit方法，调用moduleCart空间下的saveToStorage方法
			this.commit("moduleCart/saveToStorage")
		},
		// 3.1数据持久化（通过提供的api：setStorageSync方法，存储到本地）
		saveToStorage(state) {
			uni.setStorageSync("cart", JSON.stringify(state.cartList))
		},
		// 4.修改用户的选中状态
		updatecartState(state, idState) { //一个参数是当前数据，一个是传递过来的数据
			// 继续使用find方法查找与点击商品id匹配的商品
			let findResult = state.cartList.find(item => item.goods_id == idState.goods_id)
			if (findResult) { //如果存在该商品id
				findResult.goods_state = idState.goods_state
			}
			// 然后重新调用数据持化方法
			this.commit("moduleCart/saveToStorage")
		},
		// 5.修改商品数量
		updatecartCount(state, idCount) {
			let findResult = state.cartList.find(item => item.goods_id == idCount.goods_id)
			if (findResult) {
				findResult.goods_count = idCount.goods_count
			}
			this.commit("moduleCart/saveToStorage")
			// 发现并没有修改购物车角标的数量，去mixins文件中查看：使用了监听
		},
		// 6.1删除商品
		removeCart(state, idGood) {
			// 使用filter过滤出不是当前商品的id,并重新赋值给state的cartList
			state.cartList = state.cartList.filter(item => item.goods_id != idGood)
			this.commit("moduleCart/saveToStorage") //重新调用数据持久化,
			// 发现并没有修改购物车角标的数量，去mixins文件中查看：使用了监听
		},
		// 7.修改全选按钮
		updateStateAll(state, stateall) {
			state.cartList.forEach(item => item.goods_state = stateall.goods_state)
		},
	},
	// 计算属性
	getters: {
		// 1.通过计算得到仓库数据中的count值,来渲染购物车右上角的角标
		total(state) {
			let num = 0
			state.cartList.forEach(item => num += item.goods_count)
			return num
		},
		// 2.计算选中商品金额
		totalPrice(state) {
			let allPrice = 0
			// 过滤出已经选中的商品，使用过滤方法
			let priceArr = state.cartList.filter(item => item.goods_state === true)
			priceArr.forEach(item => allPrice += item.goods_price)
			return allPrice
		},
		// 3.获取结算的种类数量
		totalKind(state) {
			// 这里使用reduce累加方法
			let allKind = 0
			let kindArr = state.cartList.filter(item => item.goods_state)
			// return kindArr.reduce((allKind, item) => allKind += item.goods_count, 0)  第一种返回所有商品数量
			return kindArr.length //返回选中的商品种类数量
		}

	},
}