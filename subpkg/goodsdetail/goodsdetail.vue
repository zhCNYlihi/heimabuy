<template>
	<view class="big-box">
		<!-- 商品轮播图 -->
		<swiper :indicator-dots="true" autoplay :interval="3000" :duration="1000" circular>
			<swiper-item v-for="(item,index) in goodsInfo.pics" :key="index">
				<image :src="item.pics_big" @click="preview(index)"></image>
			</swiper-item>
		</swiper>
		<!-- 渲染商品价格，名称，收藏，运费等信息 -->
		<view class="goodsdetail-box">
			<!-- 价格 -->
			<view class="goods-price">
				{{goodsInfo.goods_price|toFixed}}
			</view>
			<!-- 名称和收藏 -->
			<view class="goodsdetail-flex">
				<view class="goods-text">
					{{goodsInfo.goods_name}}
				</view>
				<view class="goods-collect">
					<uni-icons type="star" size="20" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<!-- 运费 -->
			<view class="goods-yunfei">
				快递：免运费
			</view>
		</view>
		<!-- 富文本内容，直接渲染页面商品信息 -->
		<rich-text :nodes="goodsInfo.goods_introduce"></rich-text>
		<view class="bottom-bar">
			<uni-goods-nav @click="onClick" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goodsInfo: [], //商品详细信息

			};
		},
		// 3.处理价格
		filters: {
			toFixed(num) {
				return '￥' + Number(num).toFixed(2)
			}
		},
		onLoad(options) {
			// console.log(options);  //获取传过来的id，
			// 为了方便也可以使用goods_id来接受该参数,这样下面就可以,以对象包裹该参数一个进行传参
			let goods_id = options.goods_id
			this.getGoodsInfo(goods_id) //传入该id
		},
		methods: {
			// 1.根据id获取商品信息
			async getGoodsInfo(goods_id) {
				let res = await uni.$http.get("/api/public/v1/goods/detail", {
					goods_id
				})
				// 同样对访问不到数据进行处理
				if (res.statusCode != 200) return uni.$showMsg("数据获取失败")
				// 在小程序,会出现富文本转化后的图片存在空隙问题,解决
				// 使用字符串的 replace() 方法，为 img 标签添加行内的 style 样式，从而解决图片底部空白间隙的问题
				// 同时解决webp在ios设备无法支持的解决办法，替换成jpg
				res.data.message.goods_introduce = res.data.message.goods_introduce.replace(/<img /g,
					'<img style="display:block;" ').replace(/webp/g, "jpg")
				this.goodsInfo = res.data.message
				console.log(this.goodsInfo);
			},
			// 2.根据下标获取当前点击大图预览效果
			preview(index) {
				// 这里调用一个图片预览的api: previewImage
				uni.previewImage({
					// 第一个参数,是点击时的下标？为了解决是第几张图片要预览
					current: index, //传入下标
					// 第二个参数这个是图片数据,最多九张图片可以预览,使用map对图片进行加工
					urls: this.goodsInfo.pics.map(item => item.pics_big) //这里提取每一项的图片属性得到一个包含图片Url的数组
				})
			},

		}

	}
</script>

<style lang="scss">
	.big-box {
		padding-bottom: 50px; //根据底部高度，防止富文本被覆盖

		swiper {
			height: 650rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.goodsdetail-box {
			background-color: #fff;
			padding: 10rpx;

			.goods-price {
				color: red;
				font-size: 20px;
				margin-bottom: 10rpx;
			}

			.goodsdetail-flex {
				border-bottom: 1px solid #F5F5F5;
				padding-bottom: 10rpx;
				display: flex;

				.goods-text {
					flex: 0.8;
				}

				.goods-collect {
					flex: 0.2;
					display: flex;
					flex-direction: column;
					align-items: center;
					border-left: 1px solid #F5F5F5;
					color: gray;
				}

				.goods-yunfei {
					color: gray;
				}
			}
		}

		.bottom-bar {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
		}
	}
</style>