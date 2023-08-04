<template>
	<view class="bigbox">
		<!-- 背景颜色直接在searchbar中源文件进行修改 -->
		<view class="search-box">
			<!-- 一般不建议修改源码，可以根据带有的focus属性进行设置自动获取焦点 测试发现也是可以的-->
			<uni-search-bar class="search-bar" :focus="true" @confirm="search" radius="50" @input="input"
				cancelButton="none" placeholder="搜索">
				<template v-slot:searchIcon>
					<uni-icons color="#000" size="17" type="search" />
				</template>
				<template v-slot:clearIcon>
					<view style="color: #000;border: 1px solid #000; border-radius: 10px;padding: 0 5px;">X</view>
				</template>
			</uni-search-bar>
			<!-- <text>搜索</text> -->
		</view>
		<!-- 搜索建议列表 -->
		<!-- 这里我通过使用是否存在关键词进行搜索来分开展示搜索和历史记录 -->
		<view class="" v-if="keyword">
			<view class="search-item" v-for="(item,index) in searchList" :key="index" @click="gotodetail(item)">
				<view class="goods_name">
					{{item.goods_name}}
				</view>
				<uni-icons type="right" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史列表 -->
		<view class="" v-else>
			<view class="history-list">
				<text>历史记录</text>
				<uni-icons type="trash" size="18" @click="delHistory"></uni-icons>
			</view>
			<view class="historytags">
				<view class="tags-item" v-for="(item,index) in historyList2" :key="index">
					<uni-tag :text="item" inverted @click="gotogoodsdetail(item)"></uni-tag>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		// 为了能够自动获取焦点,和修改背景颜色同样的去源代码searchbar中进行修改,
		// data() {
		// 	return {
		// 		show: false,    //修改为true
		// 		showSync: false,  //修改为true
		// 		searchVal: ''
		// 	}
		// },
		//进过测试，是可以自动获取焦点的
		data() {
			return {
				timer: null, //定义一个延时器
				keyword: "", //定义关键词
				searchList: [], //数据访问列表
				historyList: [], //历史搜索记录假数据
			};
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync("historylist") || "[]")
		},
		computed: { //计算属性
			historyList2() {
				return [...this.historyList].reverse() //数组翻转，将历史记录翻转最新，由于reverse会改变原数组，所以使用这个...
			}
		},
		methods: {
			// 1.进行防抖处理,
			input(e) {
				// console.log(e) //此时e=value值，可以直接打印出来vlaue值
				// 如果0.5秒内还输入,则清除延时器效果
				clearTimeout(this.timer)
				// 如果不输入，则0.5秒后触发延时器
				this.timer = setTimeout(() => {
					this.keyword = e
					// console.log(this.keyword);
					this.getSearchList() //调用搜索列表
				}, 500) //定义0.5秒，
			},
			// 2.根据关键词 keyword 进行搜索
			async getSearchList() {
				// 首先要判断输入框不为空的判断
				if (!this.keyword) return
				let res = await uni.$http.get("/api/public/v1/goods/qsearch", {
					query: this.keyword //这里使用query传参
				})
				// 数据访问错误处理
				if (res.statusCode != 200) return uni.$showMsg()
				this.searchList = res.data.message
				console.log(this.searchList);
				this.savehistoryList() //保存搜索记录
			},
			// 3.去商品详情页
			gotodetail(item) {
				let goods_id = item.goods_id
				uni.navigateTo({
					url: "/subpkg/goodsdetail/goodsdetail?goods_id=" + goods_id
				})
			},
			// 4.获取搜索历史记录
			savehistoryList() {
				// 对数据进行去重处理，使用set方法
				// 4.1将数组改成set数据类型
				let set = new Set(this.historyList)
				set.delete(this.keyword)
				set.add(this.keyword)
				console.log(
					set
				) //逻辑看不懂一步步注释打印观察：let set可以发现已经变成set数据类型 使用set.delete会将输入的搜索记录删除，set.add可以将删除的这个再添加进去，包装set数据里面没有重复的代码
				// 直接将该历史记录push到historyList数组中
				// 重新转化为数组
				this.historyList = Array.from(set)
				// 在计算属性那里使用计算属性,将最新的数据进行翻转
				// 最后,可以将搜索历史持久化存入本地、
				// 在onlaod生命周期,可以一上来就加载到
				uni.setStorageSync("historylist", JSON.stringify(this.historyList))
			},
			// 5.清空搜索记录
			delHistory() {
				// 5.1首先将搜索的历史记录数组为空
				this.historyList = []
				// 5.2移除本地存储数据
				uni.removeStorageSync("historylist")
			},
			// 6.点击历史记录去详情页
			gotogoodsdetail(item) {
				// 根据电商app,一般都是点击历史去商品详情页
				uni.navigateTo({
					url: "/subpkg/goodsdetail/goodsdetail?query=" + item
				})
			},
		}
	}
</script>

<style lang="scss">
	.search-box {
		background-color: #C30000;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: sticky;
		top: 0;
		z-index: 999; //防止覆盖

		.search-bar {
			flex: 1;
		}

		// text {
		// 	padding-right: 10px;
		// 	font-size: 16px;
		// 	color: #fff;
		// }
	}

	.search-item {
		padding: 0 5px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;

		.goods_name {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			padding: 12rpx 0;
			border-bottom: 1px solid #F5F5F5;
		}
	}

	.history-list {
		padding: 5px 5px;
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid #CACDD1;


	}

	.historytags {
		display: flex;
		flex-wrap: wrap;

		.tags-item {
			margin: 10rpx 5rpx;
		}
	}
</style>