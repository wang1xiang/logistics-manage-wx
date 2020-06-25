<template>
	<view class="s-page-wrapper is-100vh">
		<hx-navbar 
			title="昊宇通工具系统" 
			:back="false"
			:fixed="true"
			color="#ffffff"
			:background-color="[[28, 187, 180],[141, 198, 63]]">
		</hx-navbar>
		<view class="is-20vh has-mgt-20">
			<view class="is-flex is-column is-justify-center  is-align-center is-height-130">
				<image src="../../static/img/common/logo.png" mode="aspectFit" class="logoimg"></image>
			</view>
		</view>
		<view class="content">
			<view class="has-mglr-10 ">
				<view class=" has-mgtb-10 ">
					<input v-model="login.username" placeholder="请输入用户名" class="is-input1 "/>
				</view>
				<view class=" has-radius has-mgtb-10">
					<input v-model="login.password" type="password" placeholder="请输入登录密码" class="is-input1"/>
				</view>

				<view class=" loginbtn has-radius has-mgtb-20">
					<button :loading="loading" @tap="defaultHandlerLogin"> {{ loading ? "登录中...":"登 录"}} </button>
					<text style="font-size: 24rpx">此小程序仅为昊宇通内部用户使用，请凭用户账号和密码登录</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				login: {
					username:"",
					password:""
				},

			};
		},
		onLoad () {
			try {
				const token = uni.getStorageSync('token')
				if (token) {
					wx.redirectTo({
						url: '../repertory/index',
					})
				}
			} catch (e) {
				console.log('oops' + e)
			}
		},

		methods:{
			defaultHandlerLogin () {
				this.loading = true
				const param = { ...this.login }
				this.$api.login(param).then((res)=>{
					if (res.data.errorCode === 0) {
						const data = res.data.responseBody || {}
						try {
							uni.setStorageSync('token', data.token)
						} catch(e) {
							console.log('setStorage oops' + e)
						}
						try {
							uni.setStorageSync('adminFlag', data.admin)
						} catch(e) {
							console.log('setStorage oops' + e)
						}
						wx.redirectTo({
							url: '../repertory/index',
						})
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
					}
				}).finally(() => {
					this.loading = false
				})
			}
		}
	}
</script>

<style>
	page {
		min-height: 100%;
		background-color: #FFFFFF;
	}

	.content {
		width: 85%;
		margin: 0 auto;
	}

	.loginbtn button {
		margin-top: 20rpx;
		height: 88rpx;
		width: 100%;
		line-height: 88rpx;
		color: #ffffff;
		font-size: 32rpx;
		border-radius: 44rpx;
		outline: 0;
		display: block;
		margin: 0;
		font-family: inherit;
		background: #f35;
		opacity: 0.8;
	}

	button:after {
		border: 2rpx solid #f2f2f2;
	}

	.logoimg {
		width: 260rpx;
		height: 260rpx;
		border-radius: 50%;
	}

	.is-input1 {
		height: 88rpx;
		width: 100%;
		line-height: 88rpx;
		padding: 12rpx;
		color: #353535;
		font-size: 32rpx;
		box-sizing: border-box;
		appearance: none;
		border: 2rpx solid #e5e5e5;
		box-shadow: none;
		border-radius: 44rpx;
		outline: 0;
		display: block;
		padding-left: 30rpx;
		margin: 0;
		font-family: inherit;
		background: #fff;
		resize: none;
	}
</style>
