<template>
	<view>
		<view class="goods-item">
			<radio color="#F43530" :checked="good.goods_state" @click="changeChecked" />
			<view class="left-item">
				<image class="goods-image" :src="good.goods_small_logo" mode=""></image>
				<view class="bigText">
					<text>{{good.goods_name}}</text>
					<view class="foot-item">
						<text style="color: red; font-size: 16px;">{{good.goods_price|toFixed}}</text>
						<!-- 注意：uni-number-box，只能输入大于0的整数，可以设置区间 -->
						<uni-number-box class="number-bar" :min="1" :max="99" :value="good.goods_count"
							@change="changeNum" />
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 购物车商品列表
	export default {
		name: "cartgoods",
		props: {
			good: {
				type: Object,
				default: {}
			},
		},
		// 使用过滤器,对价格进行修改
		filters: {
			// 对于价格样式的修改
			toFixed(num) {
				return "￥" + Number(num).toFixed(2)
			}
		},
		data() {
			return {

			};
		},
		watch: {

		},
		methods: {
			// 1.点击修改单选框选中状态
			changeChecked() {
				// 触发自定义事件中的change事件，将点击的商品id以及状态传到父组件方法中进行修改
				this.$emit("change", {
					// //通过props中的数据获取
					goods_id: this.good.goods_id,
					// 当然,点击之后要对状态做取反处理，所以传递过去的参数取反
					goods_state: !this.good.goods_state
				})
			},
			// 2.修改商品数量
			changeNum(value) {
				// console.log(value); //输入框的value值
				// 触发自定义事件,将value和商品id传参给父组件
				this.$emit("input-change", {
					goods_id: this.good.goods_id,
					goods_count: +value, //为了防止出现是中文或者NaN
				})
			},
		}
	}
</script>

<style lang="scss">
	.goods-item {

		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-left: 5px;
		margin-bottom: 10px;
		border-bottom: 3px solid #F7F7FA;


		.left-item {
			display: flex;

			.goods-image {
				margin-left: 5px;
				width: 100px;
				height: 100px;
				display: block;
			}

			.bigText {
				width: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				text {
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
				}

				.foot-item {
					display: flex;
					justify-content: space-between;

					.number-bar {
						padding-right: 10px;
					}
				}
			}


		}
	}
</style>