<template>
  <div>
    <div v-transfer-dom>
      <confirm
      v-model="showConfirm"
      title="再次确认"
      @on-cancel="showConfirm = false"
      @on-confirm="doConfirm">
        <p style="text-align:center;">为了您的健康安全着想，我们不建议您取消订单。如果您遇到疑问欢迎您致电020-37574149。</p>
      </confirm>

      <confirm
      v-model="showConfirm2"
      :show-cancel-button="false"
      title="提交成功"
      confirm-text="知道了"
      @on-confirm="successCallback">
        <p style="text-align:center;">{{refundText}}</p>
      </confirm>
    </div>
    <div class="body bodyContent">
      <div>
        <toast v-model="show" type="text" width="5.4rem" :time="1200">{{ errMsg }}</toast>
        <toast v-model="showSuccess" @on-hide="detailDetection()" type="success" width="5.4rem" :time="800"><div style="padding: 0 0.5rem;text-align:center;">{{successMsg}}</div></toast>

        <div class="stepDiv5" style="padding-bottom:12px;">
          <group title="取消原因" class="textleft">
            <radio :options="opts" v-model="refundType"></radio>
          </group>
          <group v-if="refundType == 4" title="其他原因" class="textleft" style="margin-top:-0.3rem;">
            <x-textarea
              :max="200"
              v-model="otherReason"
              placeholder="选填"
              :show-counter="false"
            >
            </x-textarea>
          </group>
        </div>

        <div style="font-size:12px;text-align:left;padding: 0 15px;opacity:0.5;">
          <p><b>说明</b></p>
          <div style="line-height:24px;"><b>退款说明</b></div>
          <p>订单取消成功后无法恢复。如果订单已付款，我们将于3-5个工作日处理，退款将退还至原支付账号中</p>
        </div>

        <div style="margin-top:85px;" class="mb37">
          <box gap="0px 20px">
             <x-button type="primary"  style="background-color:#1890FF!important;" @click.native="handleSubmit">提交</x-button>
          </box>

          <box gap="12px 20px">
             <x-button @click.native="thinkmore()">再想想</x-button>
          </box>
        </div>

      </div>
    </div>
  </div>
</template>

<script>

  // import auth from '../../auth.js'

  import { Radio, TransferDom, Group, Box, XButton, Toast, XTextarea, Confirm} from 'vux'

  import SalesService from '../../services/SalesService'
  const SalesServiceApi = new SalesService()

  export default {
    directives: {
      TransferDom
    },
    components: {
      // InlineLoading,
      Group,
      Confirm,
      Radio,
      Box,
      XButton,
      XTextarea,
      Toast,
    },
    data () {
      return {
        orderID: '',
        itemName: '',
        amount: '',
        refundText: '',
        opts: [
          {
            key: 1,
            value: '不想要了',
          },
          {
            key: 2,
            value: '订单信息填错了',
          },
          {
            key: 3,
            value: '买错产品了'
          },
          {
            key: 4,
            value: '其他原因'
          },
        ],
        refundType: '',
        otherReason: '',
        show: false,
        showConfirm: false,
        showConfirm2: false,
        showSuccess: false,
        successMsg: '',
        errMsg: '',
      }
    },
    methods: {
      handleSubmit() {
        if (!this.refundType || (this.refundType == 4 && !this.otherReason)) {
          this.errMsg = '请选择取消订单原因'
          this.show = true
          return
        }
        this.showConfirm = true
      },
      thinkmore() {
        this.$router.push({path: `/orderList`})
      },
      successCallback() {
        this.showConfirm2 = true
        this.$router.push({path: `/orderList`})
      },
      doConfirm() {
        this.showConfirm = false
        SalesServiceApi.cancelOrder(this.orderID, {refundType: this.refundType, otherReason: this.otherReason}).then(res => {
          if (res.ret == 0) {
            this.showConfirm2 = true
          } else {
            this.errMsg = res.msg
            this.show = true
          }
        })
      }
    },
    mounted: function() {
      this.$nextTick(function() {
        this.orderID = this.$route.params.id
        this.itemName = this.$route.query.itemName
        this.amount = this.$route.query.amount
        this.refundText = `${this.itemName}检测服务，已为您取消.`
        if (this.amount > 0) {
          this.refundText += `退款金额：${this.amount}元，将于3～5个工作日退至原支付账号。`
        }
        if (! this.orderID) {
          this.$router.go(-1)
        }
      })
    },
  }

</script>


<style scoped>

.bodyContent {
  margin-top:-0.3rem;
}

.stepDiv1 {
  padding-bottom: 200px;
}

.stepDiv1Pad {
  padding-bottom:200px;
}

.stepDiv5Pad {
  padding-bottom:200px;
}

.body {
  background-color:#F4F5FA;
  min-height:100vh;
}

.content {
  width:100%;
}

.mt25 {
    margin-top: 25px;
}

.mb37 {
  padding-bottom: 37px;
}

.mb15 {
  margin-bottom: 15px;
}

.textleft {
  text-align: left;
}

.textcenter {
  text-align: center;
}


</style>

<style>

  .vux-x-textarea.weui-cell {
    padding-left:12px;
  }

  .weui-cell__bd  > .weui-input {
    color: #2C3E50;
    padding-right: 0px;
  }


  .weui-cell__ft > .vux-cell-placeholder {
      color: #A9A9A9;
  }

  .weui-cell__ft > .vux-cell-value {
      color: #2C3E50;
  }

  .vux-popup-picker-select > .vux-cell-value {
    color: #2C3E50;
  }

  .vux-popup-dialog > div {
    margin-bottom: 12px;
  }

  .weui-cell__bd > .needsclick {
    height:40px;
  }

  .weui-cells__title {
    margin-top: -1px;
    padding-top: 0.3rem;
  }

  .weui-cell__bd > p {
    margin-bottom: 0px;
    margin-top: 0px;
  }

 .vux-cell-primary > p {
   margin-bottom: 0px;
   margin-top: 0px;
 }
</style>
