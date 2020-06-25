<template>
	<view class="uni-popup-dialog">
		<view class="uni-dialog-title">
			<text class="uni-dialog-title-text uni-popup__info">{{title}}</text>
		</view>
		<view class="uni-dialog-content">
      <form ref="form">
        <slot></slot>
      </form>
		</view>
    <view class="uni-dialog-button-group" v-if="type === 'add'">
			<view class="uni-dialog-button" @click="onOk">
				<text class="uni-dialog-button-text uni-button-color">确定</text>
			</view>
			<view class="uni-dialog-button uni-border-left" @click="onNext">
				<text class="uni-dialog-button-text uni-button-color">继续</text>
			</view>
		</view>
    <view class="uni-dialog-button-group" v-else>
			<view class="uni-dialog-button" @click="onClose">
				<text class="uni-dialog-button-text uni-button-color">取消</text>
			</view>
			<view class="uni-dialog-button uni-border-left" @click="onOk">
				<text class="uni-dialog-button-text uni-button-color">确定</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "uniPopupForm",
		props: {
			title: {
				type: String,
				default: '提示'
			},
			type: {
				type: String,
				required: true
			}
		},
		inject: ['popup'],		
		created() {
			// 对话框遮罩不可点击
			this.popup.mkclick = false
		},
		methods: {
			
			onClose() {
				this.popup.close()
			},
      onOk() {
				this.$emit('confirm', () => {
					this.popup.close()
				})
      },
      onNext () {
        this.$emit('confirm', null)
      }
		}
	}
</script>

<style lang="scss" scoped>

.uni-popup-dialog {
	width: 300px;
	border-radius: 15px;
	background-color: #fff;
}

.uni-dialog-title {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	justify-content: center;
	padding-top: 15px;
	padding-bottom: 5px;
}

.uni-dialog-title-text {
	font-size: 16px;
	font-weight: 500;
}

.uni-dialog-content {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	justify-content: center;
	align-items: center;
	padding: 5px 15px 15px 15px;
}

.uni-dialog-content-text {
	font-size: 14px;
	color: #6e6e6e;
}

.uni-dialog-button-group {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	border-top-color: #f5f5f5;
	border-top-style: solid;
	border-top-width: 1px;
}

.uni-dialog-button {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */

	flex: 1;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	height: 45px;
}

.uni-border-left {
	border-left-color: #f0f0f0;
	border-left-style: solid;
	border-left-width: 1px;
}

.uni-dialog-button-text {
	font-size: 14px;
}

.uni-button-color {
	color: $uni-color-primary;
}

.uni-dialog-input {
	flex: 1;
	font-size: 14px;
}

.uni-popup__success {
	color: $uni-color-success;
}

.uni-popup__warn {
	color: $uni-color-warning;
}

.uni-popup__error {
	color: $uni-color-error;
}

</style>
