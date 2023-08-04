<template>
	<view>
		<!-- 为搜索栏提供吸顶效果 -->
		<view class="search-box">
			<goodssearch @gotosearch="gotosearch"></goodssearch>
		</view>
		<!-- 轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular
			indicator-active-color='#C10001'>
			<swiper-item v-for="(item,index) in swiperList" :key="index">
				<navigator class="swiper-item" :url="'/subpkg/goodsdetail/goodsdetail?goods_id='+item.goods_id">
					<image :src="item.image_src" mode=""></image>
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 分类导航 -->
		<view class="nav">
			<view class="navitem" v-for="(item,index) in navList" :key="index" @click="navgoto(item)">
				<image :src="item.image_src" mode=""></image>
			</view>
		</view>
		<!-- 楼层商品信息 -->
		<view class="">
			<view class="flooritem" v-for="(item,index) in floorList" :key="index">
				<image class="floortitle" :src="item.floor_title.image_src" mode=""></image>
				<view class="fleximage">
					<!-- 左侧图片 -->
					<navigator class="leftimage" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src"
							:style="{width:item.product_list[0].image_width+'rpx'}" mode="widthFix"></image>
					</navigator>
					<!-- 右侧图片 -->
					<view class="rightimage">
						<navigator :url="item2.url" class="flexright" v-for="(item2,index2) in item.product_list"
							v-if="index2 !==0">
							<!-- 这里巧妙使用v-for与v-if对第一张图片进行过滤 -->
							<image :src="item2.image_src" :style="{width:item2.image_width+'rpx'}" mode="widthFix">
							</image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiperList: [],
				navList: [],
				floorList: [],
			};
		},
		// 数据加载完成
		onLoad() {
			this.getSwiperList()
			this.getNavList()
			this.getFloorList()
		},
		methods: {
			// 1.获取轮播图数据
			async getSwiperList() {
				let res = await uni.$http.get("/api/public/v1/home/swiperdata")
				if (res.statusCode != 200) { //说明请求失败
					// return uni.showToast({
					// 	title: "请求失败，刷新页面",
					// 	duration: 1500,
					// 	icon: "fail"
					// })
					// 封装全局提示信息方法
					return uni.$showMsg()
				}
				this.swiperList = res.data.message
				console.log("轮播图数据", this.swiperList);
			},
			// 2.获取分类导航数据
			async getNavList() {
				let res = await uni.$http.get("/api/public/v1/home/catitems")
				if (res.statusCode != 200) return uni.$showMsg()
				this.navList = res.data.message
				console.log("分类导航数据", this.navList);
			},
			// 3.点击分类进入分类bar
			navgoto(item) { //每一项中包含点击处的name属性（根据name跳转到不同的页面）
				// console.log(item);
				if (item.name == "分类") {
					uni.switchTab({
						url: "/pages/cate/cate"
					})
				}
			},
			// 4.获取楼层数据
			async getFloorList() {
				let res = await uni.$http.get("/api/public/v1/home/floordata")
				// 同样的,对访问失败进行处理
				if (res.statusCode != 200) return uni.$showMsg()
				// 成功就给到data数据

				// 这里需要处理一下接口, "navigator_url": "/pages/goods_list/index?query=登山包"
				// 我们的本地路径这里是subpkg / floordetail,所以对该路径进行修改
				res.data.message.forEach(item => {
					item.product_list.forEach(item2 => {
						// 自己手动添加url,点击图片进行跳转
						item2.url = "/subpkg/floordetail/floordetail?" + item2.navigator_url.split(
							"?")[1]
					})
				})
				this.floorList = res.data.message
				console.log("楼层商品数据", this.floorList);
			},
			// 5.使用自定义事件父传子,导航去search页面
			gotosearch() {
				uni.navigateTo({
					url: "/subpkg/search/search"
				})
			},
		}

	}
</script>

<style lang="scss">
	.swiper-item {
		height: 150px;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.nav {
		display: flex;
		justify-content: space-around;
		margin: 15px 0;

		.navitem image {
			width: 80px;
			height: 90px;
		}
	}

	.floortitle {
		height: 30px;
	}

	.fleximage {
		display: flex;
		padding-left: 20rpx;

		.rightimage {
			display: flex;
			flex-wrap: wrap;
		}
	}

	// 搜搜栏吸顶效果
	.search-box {
		z-index: 999; //防止覆盖
		position: sticky; //设置定位为吸顶
		top: 0; //距离顶部的位置
	}
</style>