<template>
	<view>

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

			};
		}
	}
</script>

<style lang="scss">

</style>