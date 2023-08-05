<template>
	<view>
		<view class="goods-list" v-for="(item,index) in goodsList" :key="index" @click="gotodetail(item)">
			<view>
				<image :src="item.goods_small_logo" :style="{'width':item.goods_weight+'px'}"></image>
			</view>
			<view class="goods_text">
				<text class="bigtext">{{item.goods_name}}</text>
				<text class="redtext">{{item.goods_price|toFixed}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				queryobj: { //请求参数对象
					query: "",
					cid: '', //分类id
					pagenum: 1, //请求页数
					pagesize: 10 //请求条数
				},
				// 商品信息列表
				goodsList: [],
				total: 0, //总数
				// 节流阀
				isLoading: false, //默认请求，不开节流阀
			};
		},
		filters: { //处理价格
			toFixed(num) {
				return '￥' + Number(num).toFixed(2)
			}
		},
		onLoad(options) {
			this.queryobj.query = options.query || ""
			this.queryobj.cid = options.cid || ""
			this.getGoodsDetail()
		},
		methods: {
			// 1.获取商品数据
			async getGoodsDetail(callbackFunction) {
				// 注意:
				// 在请求数据之前,开启节流阀
				this.isLoading = true
				let res = await uni.$http.get("/api/public/v1/goods/search", this.queryobj) //传参传入一个对象
				// 同样对信息访问失败进行全局处理
				if (res.statusCode != 200) return uni.$showMsg()
				// this.goodsList = res.data.message.goods //获取数据
				// 但是每次都要下拉刷新,要合并签名的数据
				this.goodsList = [...this.goodsList, ...res.data.message.goods]
				this.total = res.data.message.total //获取数据总长度
				// 注意:
				// 请求之后，关闭节流阀
				this.isLoading = false
				// 关闭上拉刷新, 就在获取数据后 关闭节流阀这里调用该回调函数, 停止下拉刷新
				callbackFunction && callbackFunction()
			},
			// 4.去商品详情页..//跳转传参goods_id是item.id
			gotodetail(item) {
				console.log(item);
				uni.navigateTo({
					url: "/subpkg/goodsdetail/goodsdetail?goods_id=" + item.goods_id
				})
			}
		},
		// 2.上拉获取数据，onReachBottom这是一个内置事件
		onReachBottom() {
			// 判断数据是否加载完毕,加载完毕直接return
			if (this.queryobj.pagenum * this.queryobj.pagesize >= this.total) return
			// 注意:
			// 如果正在请求数据,不在做反应,直接return
			if (this.isLoading) return
			// 页面上拉触底事件  让页面自增+1
			// （在pages。json中设置onReachBottomDistance 距离底部多少像素时触发）
			this.queryobj.pagenum += 1 //页数+1
			this.getGoodsDetail() //重新获取数据
		},
		// 3.开启下拉刷新效果
		// 逻辑: 当下拉时,去清除所有数据,并向获取数据的方法getGoodsDetail中传入一个停止下拉刷新的回调,在节流阀关闭后得到数据,
		// 查看是否有该回调来清除下来,有就清除下拉刷新效果
		onPullDownRefresh() {
			this.queryobj.pagenum = 1 // 页面回到第一页
			this.total = 0 //数据长度清空
			// 注意:这里要节流阀关闭,然后才能去获取数据
			this.isLoading = false
			// 记得要去清空数据
			this.goodsList = []
			this.getGoodsDetail(() => uni.stopPullDownRefresh()) //重新获取数据，在得到数据那个函数getGoodsDetail传入一个回调函数去关闭下拉刷新的效果
		},
	}
</script>

<style lang="scss">
	.goods-list {
		display: flex;
		padding: 0 5px;
		background-color: #fff;
		border-bottom: 1px solid #F5F5F5;

		image {
			height: 100px;
			// flex-shrink: 0;
		}

		.goods_text {
			display: flex;
			flex-direction: column;
			justify-content: space-around;

			.bigtext {
				font-size: 16px;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
			}

			.redtext {
				font-size: 16px;
				color: red;
			}
		}
	}
</style>