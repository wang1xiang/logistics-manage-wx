<template>
  <view>
    <hx-navbar 
			title="详情" 
			:fixed="true"
			color="#ffffff"
			:background-color="[[28, 187, 180],[141, 198, 63]]">
		</hx-navbar>
    <view>
      <uni-card 
        :title="`箱号：${box}`" 
        is-full
        mode="title"
        thumbnail="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592302419380&di=24b2d654dfbfe713c778d54a0271b167&imgtype=0&src=http%3A%2F%2Ftaskupload41.huitu.com%2FUpload4Task%2F20190606%2F1293275_20190606225104684411_1.jpg" 
        :extra="extraList" 
      >
        <goods-list :token="token" v-model="tableList" @edit="edit"></goods-list>
      </uni-card>
      <view class="scan-button">
        <button size="mini" @click="changeBox">修改</button>
        <button type="primary" style="background: #5EC270" size="mini" @click="tapScanButton">扫码</button>
      </view>
      <uni-popup
        ref="box"
        type="form"
      >
        <uni-popup-form title="修改毛重" @confirm="changeBoxOk" :type="type">
          <template>
            <view class="uni-form-item uni-column">
              <view class="title">毛重</view>
              <input class="uni-input" v-model="weight" type="digit" placeholder="请输入毛重" />
            </view>
          </template>
        </uni-popup-form>
      </uni-popup>
      <uni-popup
        ref="count"
        type="form"
      >
        <uni-popup-form title="修改数量" @confirm="changeFormOk" :type="'update'">
          <template>
            <view class="uni-form-item uni-column">
              <view class="title">数量</view>
              <input class="uni-input" v-model="quantity" type="digit" placeholder="请输入数量" />
            </view>
          </template>
        </uni-popup-form>
      </uni-popup>
    </view>
  </view>
</template>

<script>
import uniCard from '@/components/uni-card/uni-card.vue'
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import uniPopupForm from '@/components/uni-popup/uni-popup-form.vue'
import GoodsList from '@/components/goods-list'

export default {
  name: 'detail',
  components: {
    uniCard,
    uniPopup,
    uniPopupForm,
    GoodsList
  },
  data () {
    return {
      box: '',
      name: '',
      orderId: '',
      postNum: '',
      address: '',
      phone: '',
      quantity: 0,
      uuid: '',
      type: 'add',
      weight: 0,
      tableList: [],

      token: '',
      refreshFlag: false
    }
  },

  computed: {
    extraList () {
      const data = [
        `姓名：${this.name}`,
        `电话：${this.phone}`,
        `地址：${this.address}`,
        `毛重：${this.weight}`,
        `邮件单号：${this.postNum}`
      ]
      return data
    }
  },

  onLoad ({ box, name, orderId, weight, postNum, phone, address }) {
    this.box = box
    this.name = name
    this.orderId = orderId
    this.weight = weight
    this.postNum = postNum
    this.address = address
    this.phone = phone
    try {
      this.token = uni.getStorageSync('token')
    } catch (e) {
      console.log('oops' + e)
    }
    this.getTableList()
  },
  onShow() {
    if (this.refreshFlag) {
      this.getTableList()
    }
  },
  methods: {
    getTableList () {
      const { token, orderId } = this
      this.$api.getCommodityByOrderId({orderId}, token).then((res)=>{
        if (res.data.errorCode === 0) {
          const data = res.data.responseBody || []
          this.tableList = data.details || []
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
    changeBox () {
      this.type = 'update'
      this.$refs.box.open()
    },
    changeBoxOk (done) {
      const { token, orderId, weight } = this
      const data = {
        weight,
        uuid: orderId
      }
      this.$api.updateOrderWeight(data, token).then((res)=>{
        if (res.data.errorCode === 0) {
          uni.showToast({
            title: '修改毛重成功'
          });
          this.getTableList()
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
        done()
      })
    },

    changeFormOk (done) {
      const { token, uuid, quantity } = this
      const data = {
        uuid,
        quantity
      }
      this.$api.updateCommodity(data, token).then((res)=>{
        if (res.data.errorCode === 0) {
          uni.showToast({
            title: '修改成功'
          });
          this.getTableList()
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
        done()
      })
    },
    edit (item) {
      this.type = 'update'
      const { quantity, uuid } = item
      this.uuid = uuid
      this.quantity = quantity
      this.$refs.count.open()
    },
    // 扫码
    tapScanButton () {
      this.refreshFlag = false
      this.type = 'add'
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
              this.refreshFlag = true
              uni.navigateTo({
                url: `../form/index?code=${code}&quantity=${quantity || ''}&brand=${brand || ''}&nature=${nature || ''}&cName=${cName || ''}&jName=${jName || ''}&jPrice=${jPrice || ''}&weight=${weight || ''}&unit=${unit || ''}&orderId=${that.orderId}`
              })
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
<style lang="scss" scoped>
.scan-button {
  position: absolute;
  right: 25rpx;
  top: 170rpx;
  button {
    border-radius: 25px;
    margin-left: 5rpx;
  }
}
.uni-form-item {
  display: flex;
  width: 100%;
  align-items: center;
  padding: 5px 0;
}
.title {
  padding: 11px 0;
  font-size: 15px;
  line-height: 1.8;
}
.uni-input {
  height: 28px;
  padding: 0 14px;
  line-height: 28px;
  font-size: 15px;
  background: #fff;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
}
</style>