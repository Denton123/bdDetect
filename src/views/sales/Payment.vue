<template>
  <div>
    <div v-if="loading">
      <div style="height:10vh;"></div>
      <p style="text-align:center;">
        <inline-loading></inline-loading>
      </p>
    </div>
    <div v-if="!loading">
      <div v-if="showPay">
        <masker :fullscreen="true">
          <div
            style="position:fixed;height:100vh;width:100%;z-index:99999;display:flex;align-items:center;justify-content: center;"
          >
            <div
              style="border:1px solid #DDDDDD;border-radius:3px;background-color:#fff;width:82%;"
            >
              <div
                style="background-color:rgba(247, 247, 247, 100);text-align:left;padding:16px 0 16px 15px"
              >
                <span style="font-size:18px;color:#108EE9;"
                  ><b>二维码扫码收费</b></span
                >
              </div>
              <div
                style="text-align:center;padding: 50px 0 65px 0px;border-bottom: 1px solid #DDDDDD;"
              >
                <qrcode :value="paymentURL" type="img"></qrcode>
              </div>
              <div style="padding: 16px 0;">
                <span style="font-size:18px;" @click="delayPayment"
                  ><b>暂不支付</b></span
                >
              </div>
            </div>
          </div>
        </masker>
      </div>
      <div v-if="showConfirm">
        <div v-transfer-dom>
          <confirm
            v-model="showConfirm"
            confirm-text="知道了"
            @on-confirm="doPay"
            :show-cancel-button="false"
            title="支付成功"
          >
            <p style="text-align:center;">支付成功，已到账</p>
          </confirm>
        </div>
      </div>
      <div class="body bodyContent">
        <div>
          <toast
            @on-hide="onToastHide"
            v-model="show"
            type="text"
            width="5.4rem"
            :time="1200"
            >{{ errMsg }}</toast
          >
          <toast v-model="showSuccess" type="success" width="5.4rem" :time="800"
            ><div style="padding: 0 0.5rem;text-align:center;">
              {{ successMsg }}
            </div></toast
          >

          <div class="stepDiv5" style="padding-bottom:12px;">
            <group title="支付方式" class="textleft">
              <radio
                :options="payOpts"
                v-model="payType"
                @on-change="choicePay"
                @click.native="clickPay"
              ></radio>
              <template v-if="payType == 3">
                <popup-radio
                  class="textleft"
                  title="授信人"
                  ref="creditor"
                  :options="creditorOpts"
                  v-model="creditor"
                  placeholder="请选择授信人"
                >
                </popup-radio>
              </template>
            </group>

            <div class="mt25" >
              <box gap="0px 20px">
                <x-button
                  type="primary"
                  style="background-color:#1890FF!important;"
                  @click.native="handleSubmit"
                  >提交</x-button
                >
              </box>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import auth from '../../auth.js'

import {
  InlineLoading,
  Qrcode,
  Radio,
  Masker,
  TransferDom,
  PopupRadio,
  Group,
  Box,
  XButton,
  Toast,
  Confirm
} from "vux";

import SalesService from "../../services/SalesService";
const SalesServiceApi = new SalesService();

export default {
  directives: {
    TransferDom
  },
  components: {
    InlineLoading,
    Group,
    Radio,
    Box,
    XButton,
    PopupRadio,
    Toast,
    Masker,
    Confirm,
    Qrcode
  },
  data() {
    return {
      loading: true,
      showConfirm: false,
      selectable: true,
      paymentURL: "",
      intervalID: "",
      showPay: false,
      payType: "",
      payStatus: "",
      creditor: "",
      orderID: "",
      payOpts: [
        {
          key: 1,
          value: "微信支付"
        },
        {
          key: 2,
          value: "支付宝"
        },
        {
          key: 9,
          value: "线下支付"
        },
        {
          key: 3,
          value: "授信"
        }
      ],
      creditorOpts: [],
      show: false,
      showSuccess: false,
      successMsg: "",
      errMsg: ""
    };
  },
  methods: {
    clickPay(value) {
      if (value.target.value == 9) {
        this.$router.push(`/payType/${this.orderID}`);
      }
    },
    // 线下支付
    choicePay(value) {
      if (value == 9) {
        this.$router.push(`/payType/${this.orderID}`);
      }
    },
    creditorName() {
      const opts = [...this.creditorOpts];
      const target = opts.filter(item => item.key == this.addr.creditor)[0];
      if (target) {
        return target.value;
      }
      return "";
    },
    onToastHide() {
      this.$router.go(-1);
    },
    doPay() {
      this.$router.go(-1);
    },
    triggerPayment() {
      if (this.payStatus == 1 && (this.payType == 1 || this.payType == 2)) {
        this.showPay = true;
        this.intervalID = setInterval(() => {
          this.intervalCheckPayment();
        }, 1000 * 3);
      }
    },
    intervalCheckPayment() {
      // console.log(this.order, 'order')
      SalesServiceApi.getPaymentInfo(this.orderID).then(res => {
        if (res.ret == 0) {
          if (
            res.data.paymentType == this.payType &&
            res.data.paymentStatus == 2
          ) {
            //支付完成
            this.showPay = false;
            this.clearInterval();
            this.showConfirm = true;
          }
        }
      });
    },
    clearInterval() {
      clearInterval(this.intervalID);
    },
    submitPayType(params) {
      SalesServiceApi.submitPayType(this.orderID, params).then(res => {
        if (res.ret == 0) {
          this.paymentURL = res.data.paymentURL;
          this.successMsg = "提交成功";
          this.showSuccess = true;
          if (this.payStatus == 1 && (this.payType == 1 || this.payType == 2)) {
            this.triggerPayment();
          } else {
            this.$router.go(-1);
          }
        } else {
          this.errMsg = res.msg;
          this.show = true;
        }
      });
    },
    getPaymentInfo() {
      SalesServiceApi.getPaymentInfo(this.orderID).then(res => {
        if (res.ret == 0) {
          this.payStatus = res.data.paymentStatus;
          this.payType = res.data.paymentType;
          if (this.payType == 4) {
            this.creditor = res.data.creditor;
          }
          if (
            this.payStatus != 1 ||
            (this.payType == 4 && res.data.creditStatus != 3)
          ) {
            // this.selectable = false;
          }
          this.loading = false;
        } else {
          this.$router.go(-1);
        }
      });
    },
    handleSubmit() {
      if (!this.payType) {
        this.errMsg = "请选择付款方式";
        this.show = true;
        return;
      }
      if (this.payType == 3 && !this.creditor) {
        this.errMsg = "请选择授信人";
        this.show = true;
        return;
      }

      let params = {
        payType: this.payType
      };
      if (this.payType == 3) {
        params["creditorID"] = this.creditor;
      }
      this.submitPayType(params);
    },
    delayPayment() {
      this.showPay = false;
      this.clearInterval();
      this.$router.go(-1);
    },
    getCreditorOpts() {
      SalesServiceApi.getCreditorOpts().then(res => {
        if (res.ret == 0) {
          this.creditorOpts = res.data;
        } else {
          this.$router.go(-1);
        }
      });
    }
  },
  beforeDestroy: function() {
    this.clearInterval();
  },
  mounted: function() {
    this.$nextTick(function() {
      this.orderID = this.$route.params.id;
      if (!this.orderID) {
        this.$router.go(-1);
      }
      this.getCreditorOpts();
      this.getPaymentInfo();
    });
  }
};
</script>

<style scoped>
.stepDiv1 {
  padding-bottom: 200px;
}

.stepDiv1Pad {
  padding-bottom: 200px;
}

.stepDiv5Pad {
  padding-bottom: 200px;
}

.body {
  background-color: #f4f5fa;
  min-height: 100vh;
}

.content {
  width: 100%;
}

.bodyContent {
  margin-top: -0.4rem;
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
  padding-left: 10px;
}

.weui-cell__bd > .weui-input {
  color: #2c3e50;
  padding-right: 0px;
}

.weui-cell__ft > .vux-cell-placeholder {
  color: #a9a9a9;
}

.weui-cell__ft > .vux-cell-value {
  color: #2c3e50;
}

.vux-popup-picker-select > .vux-cell-value {
  color: #2c3e50;
}

.vux-popup-dialog > div {
  margin-bottom: 12px;
}

.weui-cell__bd > .needsclick {
  height: 40px;
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
