<template>
	<view style="padding-bottom: 50px;" v-if="cartList.length!==0">
		<!-- 组件：收货地址组件 -->
		<add-address></add-address>
		<!-- 购物车标题 -->
		<view class="cart-title">
			<uni-icons class="cart-icon" type="shop" size="30"></uni-icons>
			<text>购物车</text>
		</view>
		<!-- 组件：滑动模块及组件 -->
		<uni-swipe-action>
			<block v-for="(good,index) in cartList" :key="index">
				<!-- 将good参数传递给删除 -->
				<uni-swipe-action-item :right-options="options" @click="delClick(good)">
					<!-- 这里是将每一项的good传递过去 -->
					<cartgoods :good="good" @change="readioChange" @input-change="numchange"></cartgoods>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>
		<!-- 组件：购物车结算 -->
		<!-- 父组件传递仓库数据过去 -->
		<!-- 传递一个自定义事件过去修改全选按钮的状态 -->
		<!-- 传入仓库中计算属性的总价格 -->
		<settlement :cartList="cartList" @change="radiochangeall" :totalPrice="totalPrice" :totalKind="totalKind">
		</settlement>
	</view>
	<view class="empty-item" v-else>
		<image class="empty-img" src="@/static/cart_empty@2x.png" mode=""></image>
		<text>购物车:空空如也</text>
	</view>
</template>

<!-- 这样写，发现只能在当前页面显示微标，解决办法：使用 mixins，进行代码的复用-->
<!-- <script>
	import {
		mapGetters
	} from "vuex"
	export default {
		data() {
			return {

			};
		},
		// 得到购物车数量,在cart仓库中已经做了存储本地数据
		computed: {
			...mapGetters("moduleCart", ["total"])
		},
		// 1.2,调用内置onshow的方法,在页面加载中调用setBadga方法
		onShow() {
			this.setBadge()
		},
		methods: {
			// 1.1为底部导航栏的购物车添加角标信息
			setBadge() {
				// 通过内置api: uni.setTabBarBadge方法，设置角标
				uni.setTabBarBadge({
					index: 2, //购物车所在的索引
					text: this.total + "", //注意：text必须是字符串类型
				})
			}
		}
	}
</script> -->
<script>
	// 使用mixins，显示底部导航栏购物车的角标
	import cartMixins from '@/mixins/cartbadge.js'
	import {
		mapState,
		mapMutations,
		mapGetters
	} from "vuex"
	export default {
		// 使用minins
		mixins: [cartMixins],
		computed: {
			...mapState("moduleCart", ["cartList"]),
			...mapGetters("moduleCart", ["totalPrice", "totalKind"])
		},
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#C30000'
					}
				}]
			}
		},
		methods: {
			...mapMutations("moduleCart", ["updatecartState", "updatecartCount", "removeCart", "updateStateAll"]),
			// 1.父组件进行修改状态
			readioChange(idState) {
				// console.log(idState); //得到点击时的商品id，和选中状态
				// 在这里调用仓库的方法,传递该参数对数据id进行匹配和修改状态
				this.updatecartState(idState)
			},
			// 2.父组件修改数量
			numchange(idCount) {
				this.updatecartCount(idCount)
			},
			// 3.直接点击删除，传入点击的那一项item
			delClick(good) {
				// console.log(good) //点击的这一项商品所有信息
				let idGood = good.goods_id
				this.removeCart(idGood)
			},
			// 4.修改底部结算全选按钮
			radiochangeall(stateall) {
				this.updateStateAll(stateall)
			}
		},
	}
</script>

<style lang="scss">
	.cart-title {
		display: flex;
		align-items: center;
		margin: 10px 0 10px;
		padding-bottom: 5px;
		padding-left: 2px;
		border-bottom: 3px solid #F7F7FA;

		.cart-icon {
			margin-right: 10rpx;
		}

		text {
			font-size: 18px;
		}
	}

	.empty-item {
		height: 80vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.empty-img {
			width: 150px;
			height: 150px;
			margin-bottom: 50px;
		}
	}
</style>