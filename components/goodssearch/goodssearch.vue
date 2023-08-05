<template>
	<view class="searchtitle" :style="{'background-color':bgColor}">
		<view class="searchtitle-text" :style="{'border-radius':radius+'px'}" @click="onSearch">
			<uni-icons type="search" size="17"></uni-icons>
			<text>搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "goodssearch",
		// 为了增强该组件的使用,可以使用父传子属性的方法进行自定义背景和圆角尺寸(默认px)
		// 使用键值对方式
		props: {
			bgColor: {
				type: String,
				default: "#C30000"
			},
			radius: {
				type: Number,
				default: 18 //单位默认px
			}
		},
		data() {
			return {

			};
		},
		methods: {
			// 通过自定义事件来触发父传过来的事件
			onSearch() {
				this.$emit("gotosearch")
			}
		}
	}
</script>

<style lang="scss">
	.searchtitle {
		height: 50px;
		// background-color: #C30000;
		padding: 0 10px;
		padding-top: 14px;

		.searchtitle-text {
			height: 36px;
			// border-radius: 18px;
			background-color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 15px;

			text {
				font-size: 15px;
			}
		}
	}
</style>