<template>
	<view class="">
		<!-- 高效使用组件：外父传子属性 -->
		<goodssearch bgColor="#FA764F" :radius="5" @gotosearch="gotosearch"></goodssearch>
		<!-- 默认属性 -->
		<!-- <goodssearch></goodssearch> -->
		<view class="flexview">
			<scroll-view scroll-y="true" class="leftview" :style="{height:wh+'px'}">
				<block v-for="(item,index) in cateList" :key="index">
					<view :class="['leftitem', index===activeId?'active':'']" @click="activeIdchange(index)">
						{{item.cat_name}}
					</view>
				</block>
			</scroll-view>
			<scroll-view scroll-y="true" class="rightview" :style="{height:wh+'px'}" :scroll-top="scrolltop">
				<block v-for="(item2,index2) in catelevel2" :key="index2">
					<view class="item2-title">
						｜{{item2.cat_name}}｜
					</view>
					<!-- 三级分类 -->
					<view class="item3">
						<view class="item3-text" v-for="(item3,index3) in item2.children" :key="index3"
							@click="gotofloordetail(item3)">
							<image :src="item3.cat_icon"></image>
							<view> {{item3.cat_name}}</view>
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	// 使用mixins，显示底部导航栏购物车的角标
	import cartMixins from '@/mixins/cartbadge.js'
	export default {
		// 使用minins
		mixins: [cartMixins],
		data() {
			return {
				wh: 0, //windowheight 设备可以使用的内容高度
				cateList: [], //获取分类信息
				catelevel2: [], //获取二级分类信息
				activeId: 0, //是否选中的样式
				// 这里面有一个bug,就是切换页面时,还是会定位到当前访问位置,不会返回到顶部
				scrolltop: 0 //定义一个距离顶部的值
			};
		},
		onLoad() {
			// 这里有一个方法,可以获得机型信息,可以拿到可使用内容高度(去除头部底部bar)
			let phoneinfo = uni.getSystemInfoSync()
			// console.log(phoneinfo);  、、此时就可以拿到设备信息
			this.wh = phoneinfo.windowHeight - 64 //减去搜索高度64
			this.getCatelist()
		},
		methods: {
			// 1.获取商品分类信息
			async getCatelist() {
				let res = await uni.$http.get("/api/public/v1/categories")
				// 同样的对商品获取不到信息进行处理
				if (res.statusCode != 200) return uni.$showMsg()
				this.cateList = res.data.message
				this.catelevel2 = this.cateList[0].children //默认先给第一个分类数据
				console.log("分类数据", this.cateList);
				console.log("二级分类", this.catelevel2);
			},
			// 2.点击目录,修改当前选中项id
			activeIdchange(index) {
				this.activeId = index
				// 同样的,点击也要切换数据
				this.catelevel2 = this.cateList[index].children
				// 还有一个问题,每次赋值给相同的值是不生效的,所以可以使用1和0进行切换,微小的偏差是不会被发现的
				this.scrolltop = this.scrolltop == 0 ? 1 : 0
			},
			// 3.点击跳转到楼层商品详情页
			gotofloordetail(item3) {
				uni.navigateTo({
					url: "/subpkg/floordetail/floordetail?cid=" + item3.cat_id //根据接口需要传cid（分类id）
				})
			},
			// 4.使用自定义事件父传子,导航去search页面
			gotosearch() {
				uni.navigateTo({
					url: "/subpkg/search/search"
				})
			},
		},
	}
</script>

<style lang="scss">
	.flexview {
		display: flex;

		.leftview {
			background-color: #F7F7FA;
			width: 150px;

			.leftitem {
				height: 50px;
				text-align: center;
				line-height: 50px;

				// 这个&表示同时带有这个样式名，激活这个样式
				&.active {
					background-color: #FFFFFF;
					position: relative;

					&::before {
						content: "";
						display: block;
						width: 3px;
						height: 50px;
						background-color: red;
						position: absolute;
						left: 0;
						top: 0;
						transform: translateY(0);
					}
				}
			}
		}

		.rightview {
			background-color: #FEFEFE;
		}

		.item2-title {
			text-align: center;
			padding: 15px 0;
			font-size: 15px;
			font-weight: bold;
		}

		.item3 {
			display: flex;
			flex-wrap: wrap;

			.item3-text {
				width: 33.33%;
				margin-bottom: 10px;
				display: flex;
				flex-direction: column;
				align-items: center;

				image {
					width: 60px;
					height: 60px;
				}
			}
		}
	}
</style>