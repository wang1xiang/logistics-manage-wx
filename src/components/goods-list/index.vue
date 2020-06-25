<template>
	<view>
    <view class="bg-white shadow radius text-content" v-for="(item, index) in value"
      :key="index" style="margin-bottom: 15rpx">
      <view class="flex padding-top-sm solids-top">
        <view class="flex text-content padding-left justify-between" style="flex-grow: 1;">
          <view>
            <view>编码：{{ item.code }}</view>
            <view>名称：{{ item.cName }}</view>
          </view>
          <view style="flex-shrink: 0;">
            <view style="font-size: 18px;" class="text-grey text-center">×{{item.quantity}}</view>
          </view>
        </view>
      </view>
      <view class="flex justify-end" style="font-size: 24upx;">
        <view class="round cu-btn lines-grey mid shadow margin-right-sm" @click.stop="$emit('edit', item)">修改</view>
        <view class=" round cu-btn lines-orange mid shadow" @click.stop="deleteGoods(item.uuid)">删除</view>
      </view>
    </view>
  </view>
</template>

<script>
	export default {
    props: {
      value: {
        type: Array,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    },
    methods: {
      deleteGoods (uuid) {
        const { token, value } = this
        const ids = uuid.split(' ')
        this.$api.deleteCommodity({ ids }, token).then((res)=>{
          if (res.data.errorCode === 0) {
            uni.showToast({
              title: '删除成功'
            })
            const data = value.filter(item => item.uuid !== uuid)
            this.$emit('input', data)
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
        })
      }
    }
	}
</script>

<style>
	.cover {
		width: 150upx;
		height: 150upx;
	}

</style>
