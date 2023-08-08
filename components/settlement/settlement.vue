<template>
	<view class="settlement-item">
		<view class="item-allSelect">
			<radio :checked="allState" color="red" @click="changeState" />
			<text>全选</text>
		</view>
		<view class="item-total">
			合计:<text style="color: red;">{{totalPrice|toFixed}}</text>
		</view>
		<view class="item-res">
			<text>结算({{totalKind}})</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "settlement",
		props: {
			cartList: {
				type: Array,
				default: []
			},
			totalPrice: {
				type: Number,
				default: 0
			},
			totalKind: {
				type: Number,
				default: 0
			}
		},
		computed: {
			// 1.计算出cartList数据中的state状态
			allState() {
				// 这里使用every组件,有一项不符合,就返回false
				return this.cartList.every(item => item.goods_state === true)
			},
		},
		filters: {
			// 2.对传过来的数字金额进行处理
			toFixed(num) {
				return "￥" + Number(num).toFixed(2)
			},
		},
		data() {
			return {

			};
		},
		methods: {
			changeState() {
				this.$emit("change", {
					goods_state: !this.allState, //传入和当前计算属性的状态相反的值过去
				})
			}
		}
	}
</script>

<style lang="scss">
	.settlement-item {
		padding-left: 5px;
		width: 100%;
		height: 50px;
		position: fixed;
		// 这里已经获取了可使用的视口高度,所以在小程序中正常展示,但是h5中有些问题
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 18px;
		box-sizing: border-box;
		background-color: white;

		.item-res {
			width: 26%;
			height: 100%;
			background-color: #AE0003;
			text-align: center;
			line-height: 50px;
			color: white;
		}
	}
</style>