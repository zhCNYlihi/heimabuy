<template>
	<view>
		<!-- 添加地址 -->
		<view class="btn-address1" v-if="JSON.stringify(addressList)==='{}'">
			<button type="primary" size="mini" @click="chooseAddress">请选择收获地址+</button>
		</view>
		<!-- 显示默认地址信息 点击去选择地址-->
		<view class="btn-address2" v-else @click="chooseAddress">
			<view class="row1">
				<text>收货人：{{addressList.userName}}</text>
				<view class="row1-right">
					<text>电话：{{addressList.telNumber}}</text>
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view>
			<view class="row2">
				<text class="addressinfo">收货地址：{{addressStr}}</text>
				<text class="addressdetail"></text>
			</view>
		</view>
		<!-- 分割条 -->
		<view class="" style="">
			<image class="address-img" src="../../static/cart_border@2x.png"></image>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapGetters
	} from "vuex"
	export default {
		name: "add-address",
		data() {
			return {
				// addressList: {}, //地址信息，同时控制是否添加地址的显示和隐藏
			};
		},
		// 计算属性
		computed: {
			// (1)仓库地址数据
			...mapState("moduleUserAddress", ["addressList"]), //为了代码高效使用，其他地方可能也会用到地址，使用getter中的计算属性
			// 对地址进行拼接处理
			// (3)对地址拼接在仓库getter处理
			// addressStr() {
			// 	if (!this.addressList.provinceName) return "" //判断是否存在省的信息
			// 	return this.addressList.provinceName + this.addressList.cityName + this.addressList.countyName + this
			// 		.addressList.detailInfo
			// }
			...mapGetters("moduleUserAddress", ["addressStr"])
		},
		methods: {
			// (2.1)仓库添加地址数据
			...mapMutations("moduleUserAddress", ["addAddress"]),
			// 1.选择地址
			async chooseAddress() {
				// 使用内置uni.chooseAddress方法获取地址信息，他返回的是一个promise对象，所以需要使用async 和await等待成功得到回调，并使用catch捕获异常
				// 这个需要再手机端测试，在选中地址后，可以查看打印结果
				// 对结果,进行结构
				let [err, res] = await uni.chooseAddress().catch(err => "访问结果(失败err还是成功null)：", err) //返回失败
				// console.log(res)  //不使用async await 打印结果是一个等待态的promise对象，使用后打印，第一个是null，表示发生任何错误，第二个是结果，包含地址信息
				// 根据打印结果判断
				if (err === null && res.errMsg === "chooseAddress:ok") {
					console.log(res);
					// this.addAddress = res
					// (2.2)
					// 添加数据到仓库
					this.addAddress(res)
				}
				console.log(err);
				uni.authorize({
					scope: 'scope.userLocation',
					success() {
						// 用户授权成功
						// 进行相应的操作
					},
					fail() {
						// 用户拒绝授权或授权失败
						// 可以给出相应的提示或处理
					}
				});
			},
		}

	}
</script>

<style lang="scss">
	.btn-address1 {
		height: 90px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.btn-address2 {
		height: 90px;
		padding: 10px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.row1 {
			display: flex;
			justify-content: space-between;
		}

		.row2 {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.addressinfo {}

			.addressdetail {
				flex: 1;
				font-size: 14px;
			}
		}
	}

	.address-img {
		display: block;
		width: 100%;
		height: 10rpx;
	}
</style>