<template>
	<view style="height: 100%">
		<hx-navbar 
			title="新增商品" 
			:fixed="true"
			color="#ffffff"
			:background-color="[[28, 187, 180],[141, 198, 63]]">
		</hx-navbar>
		<view class="evan-form-show">
			<evan-form :hide-required-asterisk="false" ref="form" :model="info">
				<evan-form-item style="font-size: 32rpx;font-weight: 700;" label="商品编号：" :prop="!!adminFlag ? '' : 'code'">
					<input class="form-input" placeholder-class="form-input-placeholder" v-model="info.code" placeholder="请输入商品编号" />
				</evan-form-item>
				<evan-form-item style="font-size: 32rpx;font-weight: 700;" label="数量：" :prop="!!adminFlag ? '' : 'quantity'">
					<input type="number" class="form-input" placeholder-class="form-input-placeholder" v-model="info.quantity" placeholder="请输入数量" />
				</evan-form-item>
				<evan-form-item label="品牌" :prop="!!adminFlag ? '' : 'brand'">
					<input class="form-input" placeholder-class="form-input-placeholder" v-model="info.brand" placeholder="请输入品牌" />
				</evan-form-item>
				<evan-form-item label="品性：" :prop="!!adminFlag ? '' : 'nature'">
					<input class="form-input" placeholder-class="form-input-placeholder" v-model="info.nature" placeholder="请输入品性" />
				</evan-form-item>
				<evan-form-item label="中文名：" :prop="!!adminFlag ? '' : 'cName'">
					<input class="form-input" placeholder-class="form-input-placeholder" v-model="info.cName" placeholder="请输入中文名" />
				</evan-form-item>
				<evan-form-item label="日文名：" :prop="!!adminFlag ? '' : 'jName'">
					<input class="form-input" placeholder-class="form-input-placeholder" v-model="info.jName" placeholder="请输入日文名" />
				</evan-form-item>
				<evan-form-item label="日元：" :prop="!!adminFlag ? '' : 'jPrice'">
					<input type="digit" class="form-input" placeholder-class="form-input-placeholder" v-model="info.jPrice" placeholder="请输入日元" />
				</evan-form-item>
				<evan-form-item label="净重：" :prop="!!adminFlag ? '' : 'weight'">
					<input type="digit" class="form-input" placeholder-class="form-input-placeholder" v-model="info.weight" placeholder="请输入净重" />
				</evan-form-item>
				<evan-form-item label="单位：" :prop="!!adminFlag ? '' : 'unit'">
					<input class="form-input" placeholder-class="form-input-placeholder" v-model="info.unit" placeholder="请输入单位" />
				</evan-form-item>
			</evan-form>
			<view class="footer-button">
				<button @click="promiseSave(true)" size="mini" type="primary">保存</button>
				<button @click="promiseSave(false)" size="mini" type="primary">继续</button>
			</view>
		</view>
	</view>
</template>

<script>
  import utils from './utils.js'
  import evanForm from './evan-form'
  import evanFormItem from './evan-form-item'
	export default {
    components: {
      evanForm,
      evanFormItem
		},
		data() {
			return {
				adminFlag: 1,
				// 表单的内容必须初始化
				info: {
					code: '',
					quantity: '',
					brand: '',
					nature: '',
					cName: '',
					jName: '',
					jPrice: '',
					weight: '',
					unit: ''
				},
				token: '',
				orderId: '',
				rules: {
					code: {
						required: true,
						message: '请输入姓名'
          },
          quantity: {
						required: true,
						message: '请输入数量'
					},
          brand: {
						required: true,
						message: '请输入品牌'
					},
          nature: {
						required: true,
						message: '请输入品性'
					},
          cName: {
						required: true,
						message: '请输入中文名'
					},
          jName: {
						required: true,
						message: '请输入日文名'
					},
          jPrice: {
						required: true,
						message: '请输入日元'
					},
          weight: {
						required: true,
						message: '请输入净重'
					},
          unit: {
						required: true,
						message: '请输入单位'
					}
				}
			}
		},
		onLoad ({ code, quantity, brand, nature, cName, jName, jPrice, weight, unit, orderId }) {
			// 这里必须放在mounted中，不然h5，支付宝小程序等会找不到this.$refs.form
			this.$refs.form.setRules(this.rules)
			this.orderId = orderId
			try {
				this.token = uni.getStorageSync('token')
			} catch (e) {
				console.log('oops' + e)
			}
			
			this.info = {
				code, quantity, brand, nature, cName, jName, jPrice, weight, unit
			}
			try {
				this.adminFlag = uni.getStorageSync('adminFlag')
			} catch (e) {
				console.log('oops' + e)
			}
		},
		methods: {
			promiseSave(done){
				if (!!this.adminFlag) {
					const param = {
						done,
						info: this.info
					}
					this.confirm(param)
				} else {
					this.$refs.form.validate().then((res)=>{
						const param = {
							done,
							info: this.info
						}
						this.confirm(param)
					})
				}
			},
			
			confirm(param){
				const { token, orderId } = this
				const { info, done } = param
				info.orderId = orderId
				
				this.$api.addCommodity(info, token).then((res)=>{
					if (res.data.errorCode === 0) {
						uni.showToast({
							title: '新增成功'
						});
					} else {
						if (res.data.message === '请登录') {
							uni.clearStorage();
							uni.redirectTo({
								url: '../login/login'
							})
						} else {
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							})
						}
					}
				}).finally(() => {
					if (param.done) {
						uni.navigateBack()
					} else {
						this.tapScanButton()
					}
				})
			},
			tapScanButton () {

				const that = this
				uni.scanCode({
					success: (sacn) => {
						const { token } = that
						const code = sacn.result
						console.log(code);
						that.$api.getByCode({code}, token).then((res)=>{
							if (res.data.errorCode === 0) {
								const data = res.data.responseBody || {}
								const { quantity, brand, nature, cName, jName, jPrice, weight, unit } = data

								this.info = {
									code, quantity, brand, nature, cName, jName, jPrice, weight, unit
								}
							} else {
								uni.showToast({
									title: res.data.message,
									icon: 'none'
								})
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}
	.footer-button {
		display: flex;
		justify-content: space-evenly;
		button {
			font-size: 24rpx;
			width: 30%;
			margin-top: 60rpx;
			background: #69C264;
			border-radius: 30rpx;
		}
	}
	.evan-form-show {
		padding: 0 30rpx;
		background-color: #fff;
    height: 100%;
		.form-input {
			font-size: 28rpx;
			color: #333;
			text-align: right;
			width: 100%;
			box-sizing: border-box;
			height: 60rpx;
			&.textarea{
				height: 240rpx;
				padding: 24rpx 0;
				text-align: left;
			}
		}

		.form-input-placeholder {
			font-size: 28rpx;
			color: #999;
		}

		&__button {
			width: 100%;
			height: 88rpx;
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0;
			font-size: 36rpx;
			color: #fff;
			margin-top: 20rpx;
			background-color: #2D87D5;

			&::before,
			&::after {
				border: none;
			}
		}

		.customize-form-item {
			&__label {
				font-size: 28rpx;
				color: #333;
				margin-bottom: 16rpx;
			}

			&__radio {
				display: flex;
				align-items: center;
				margin-bottom: 16rpx;

				&__text {
					font-size: 28rpx;
					color: #333;
				}
			}
		}
	}
</style>
