<template>
  <view>
    <hx-navbar 
			:title="batchName" 
			:fixed="true"
      :back="false"
			color="#ffffff"
			:background-color="[[28, 187, 180],[141, 198, 63]]">
		</hx-navbar>
    <uni-search-bar ref="search" :radius="100" @confirm="search" @cancel="cancel" @scan="scan"></uni-search-bar>
    <!-- 带描述信息 -->
    <uni-list>
      <uni-list-item
        v-for="item in dataList"
        :key="item.box"
        :show-extra-icon="true"
        :extra-icon="{color: '#4cd964',size: '22',type: 'cart-filled'}"
        :title="`箱号：${item.box}`"
        thumb="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592302419380&di=24b2d654dfbfe713c778d54a0271b167&imgtype=0&src=http%3A%2F%2Ftaskupload41.huitu.com%2FUpload4Task%2F20190606%2F1293275_20190606225104684411_1.jpg"
        @click="gotoDetail(item)"
        :note="`姓名：${item.name}`"
        :weight="`毛重：${item.weight}`"
        :postNum="`邮件单号：${item.postNum}`"
        :address="`地址：${item.address}`"
        :phone="`电话：${item.phone}`"
        ></uni-list-item>
    </uni-list>
  </view>
</template>

<script>
import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
import uniList from '@/components/uni-list/uni-list.vue'
import uniListItem from '@/components/uni-list-item/uni-list-item.vue'

export default {
  components: {
    uniSearchBar,
    uniList,
    uniListItem
  },
  data () {
    return {
      batchName: '',
      dataList: [],
      bakList: []
    }
  },

  created () {
    let token = ''
    try {
      token = uni.getStorageSync('token')
    } catch (e) {
      console.log('oops' + e)
    }
    this.$api.getOrderList({}, token).then((res)=>{
      if (res.data.errorCode === 0) {
        const data = res.data.responseBody || []
        this.batchName = data.batchName
        this.dataList = data.orders
        this.bakList = JSON.parse(JSON.stringify(this.dataList))
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
      this.loading = false
    })
  },
  methods: {
    search (e) {
      const value = typeof e === 'string' ? e : e.value
      this.dataList = this.bakList.filter(item => {
        if (item.name.toLowerCase().includes(value.trim().toLowerCase()) || item.weight.toString().toLowerCase().includes(value.trim().toLowerCase())
        || item.uuid.toLowerCase().includes(value.trim().toLowerCase()) || item.postNum.toLowerCase().includes(value.trim().toLowerCase())) {
          return item
        }
      })
    },
    cancel () {
      this.dataList = [...this.bakList]
    },
    gotoDetail ({ box, name, uuid, weight, postNum, address, phone }) {
      wx.navigateTo({
        url: `../detail/index?box=${box}&name=${name}&orderId=${uuid}&weight=${weight}&postNum=${postNum}&address=${address}&phone=${phone}`,
      })
    },
    scan () {
      const that = this
      uni.scanCode({
        success: (sacn) => {
          this.$refs.search.searchVal = sacn.result
          this.search(sacn.result)
        }
      })
    }
  }
}

</script>
<style>
</style>