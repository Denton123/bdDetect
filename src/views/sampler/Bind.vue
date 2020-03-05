<template>
  <div>
    <div v-if="loading">
      <div style="height:10vh;"></div>
      <p style="text-align:center;">
        <inline-loading></inline-loading>
      </p>
    </div>
    <div v-show="!loading" class="body">
      <div>
        <toast v-model="show" type="text" width="5.4rem" :time="1200">{{ errMsg }}</toast>
        <toast
          v-model="showSuccess"
          @on-hide="successCallback"
          type="success"
          width="5.4rem"
          :time="800"
        >
          <div style="padding: 0 0.5rem;text-align:center;">{{successMsg}}</div>
        </toast>
        <group title style="padding-top:0.3rem;margin-top:-0.6rem;">
          <x-input
            text-align="right"
            title="姓名"
            v-model="name"
            placeholder-align="right"
            :readonly="true"
          ></x-input>
          <x-input
            text-align="right"
            title="订单号"
            :show-clear="false"
            v-model="orderID"
            placeholder-align="right"
            :should-toast-error="false"
            :readonly="true"
          ></x-input>
        </group>
        <div style="padding-bottom:24px;">
          <div v-for="(sample, index) in submitSamples" :key="index">
            <group :title="`样本信息${index + 1}`" class="textleft">
              <x-input
                text-align="right"
                title="样本条码"
                :show-clear="false"
                v-model="sample.barcode"
                placeholder-align="right"
                :should-toast-error="false"
                :readonly="activeIndex !== index"
              ></x-input>

              <x-input
                text-align="right"
                title="样本接收"
                :show-clear="false"
                :value="statusText(sample.sampleAccept)"
                placeholder-align="right"
                :should-toast-error="false"
                :readonly="true"
              ></x-input>
              <cell title="操作" v-if="sample.sampleAccept == 0">
                <a href="javascript:void(0)">
                  <span v-if="activeIndex ==index" @click="saveEditSample(sample, index)">保存</span>
                  <span v-else @click="editSample(sample, index)">编辑</span>
                </a>
                <a href="javascript:void(0)" @click="showDelete">删除</a>
              </cell>
            </group>
            <!-- <div v-transfer-dom v-if="showConfirm">
              <confirm
                title="Confirm deleting the item"
                theme="android"
                @on-cancel="onCancel"
                @on-confirm="onConfirm"
                @on-show="onShow"
                @on-hide="onHide"
              >
                <p style="text-align:center;">I miss u sunyi</p>
              </confirm>
            </div>-->
            <div v-transfer-dom>
              <confirm
                v-model="showConfirm"
                confirm-text="确认"
                cancel-text="关闭"
                @on-confirm="deleteSample(sample, index)"
                title="是否删除"
              >
                <p style="text-align:center;">确认删除吗？</p>
              </confirm>
            </div>
          </div>
          <!-- <div v-transfer-dom>
            <confirm
              v-model="showConfirm"
              confirm-text="确认"
              cancel-text="关闭"
              @on-confirm="deleteSample"
              title="是否删除"
            >
              <p style="text-align:center;">确认删除吗？</p>
            </confirm>
          </div>-->

          <div>
            <div v-for="(sample, index) in samples" :key="index">
              <group :title="`样本信息${index + submitSamples.length + 1}`" class="textleft">
                <x-input
                  text-align="right"
                  title="样本条码"
                  placeholder="扫描或填写样本条形码"
                  :max="9"
                  :min="9"
                  :ref="'sample' + index"
                  :show-clear="false"
                  v-model="sample.barcode"
                  placeholder-align="right"
                  :should-toast-error="false"
                  required
                >
                  <template slot="right">
                    <div style="padding-left:8px;display:inline-block;" @click="wxscan(index)">
                      <img style="width:23px;height:23px;" src="../../assets/scan.png" />
                    </div>
                  </template>
                </x-input>
              </group>
            </div>

            <div class="mt25" v-if="validSamples + samples.length < 2">
              <box gap="0px 20px" style="white-space:nowrap;">
                <div>
                  <x-button
                    style="background-color:#FFFFFF!important;"
                    @click.native="appendSample"
                  >
                    <span style="color:black;">添加样本</span>
                  </x-button>
                </div>
              </box>
            </div>
          </div>

          <div class="mt25 mb15">
            <box gap="0px 20px">
              <x-button
                type="primary"
                style="background-color:#1890FF!important;"
                @click.native="handleSubmit"
              >确定</x-button>
            </box>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SamplerService from "../../services/SamplerService";
const SamplerServiceApi = new SamplerService();
import auth from "../../auth.js";

import {
  InlineLoading,
  TransferDom,
  Group,
  Box,
  XButton,
  XInput,
  Toast,
  Cell,
  Confirm
} from "vux";

export default {
  directives: {
    TransferDom
  },
  components: {
    InlineLoading,
    Group,
    XButton,
    Box,
    XInput,
    Toast,
    Cell,
    Confirm
    // Masker
  },
  data() {
    return {
      action: "",
      loading: true,
      doScan: false,
      validSamples: 0,
      orderID: "",
      name: "",
      submitSamples: [],
      samples: [],
      show: false,
      showSuccess: false,
      successMsg: "",
      errMsg: "",
      activeIndex: -1,
      showConfirm: false
    };
  },
  methods: {
    // 编辑样本
    editSample(item, index) {
      this.activeIndex = index;
    },
    saveEditSample(item, index) {
      let params = { id: item.id, code: item.barcode };
      SamplerServiceApi.editSample(item.id, params).then(res => {
        if (res.ret == 0) {
          this.successMsg = "编辑成功";
          this.showSuccess = true;
          this.activeIndex = -1;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 显示删除弹窗
    showDelete() {
      this.showConfirm = true;
    },
    // 删除样本
    deleteSample(item, index) {
      SamplerServiceApi.deleteSample(item.id).then(res => {
        if (res.ret == 0) {
          this.successMsg = "删除成功";
          this.showSuccess = true;
          this.getSampleBindList(this.orderID);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    statusText(status) {
      let text = "";
      switch (status) {
        case 0:
          text = "待接收";
          break;
        case 1:
          text = "已接收";
          break;
        case 2:
          text = "已拒绝";
          break;
      }
      return text;
    },
    appendSample() {
      if (this.validSamples + this.samples.length >= 2) {
        this.errMsg = "最多只能存在2个有效样本";
        this.show = true;
      } else {
        const samples = [...this.samples];
        samples.push({
          barcode: ""
        });
        this.samples = samples;
      }
    },
    successCallback() {
      // this.goto("/sampler");
    },
    handleSubmit() {
      if (this.samples.length > 0) {
        // console.log(this.samples.length, this.samples, this.submitSamples);
        if (this.submitSamples.length == 0) {
          for (let i = 0; i < this.samples.length; i++) {
            let ele = this.$refs[`sample${i}`][0] || null;
            if (ele.hasOwnProperty("valid") && !ele.valid) {
              ele.onBlur();
              // console.log(ele)
              this.errMsg = "请输入正确的样本条码";
              this.show = true;
              return;
            }
          }
        }

        SamplerServiceApi.addSample(this.orderID, this.samples).then(res => {
          if (res.ret == 0) {
            this.successMsg = "样本添加成功";
            this.showSuccess = true;
            this.$router.go(-1);
          } else {
            this.errMsg = res.msg;
            this.show = true;
          }
        });
      } else {
        this.$router.go(-1);
      }
    },
    goto(path) {
      this.$router.push({ path: path });
    },
    wxConfig() {
      const url = window.location.href;
      // alert(url)
      SamplerServiceApi.getSign(url).then(res => {
        // alert(JSON.stringify(res))
        if (res.ret == 0) {
          this.$wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.appId, // 必填，公众号的唯一标识
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.noncestr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名
            jsApiList: ["scanQRCode"] // 必填，需要使用的JS接口列表
          });
        }
      });
      this.$wx.ready(function() {});

      this.$wx.error(function(res) {
        // console.log(res);
        // location.reload(true)
      });
    },
    wxscan(key) {
      this.$wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["barCode"], // 可以指定扫二维码还是一维码，默认二者都有 qrCode
        success: res => {
          // alert(res.resultStr)
          this.samples[key]["barcode"] = res.resultStr;
        }
      });
    },
    // 判断是否是登录成功之后进入系统的
    hasLogin() {
      let loginUrl = "";
      loginUrl =
        window.location.href.indexOf("dev") !== -1
          ? "http://dev.work.bdlifescience.com"
          : window.location.href.indexOf("test") !== -1
          ? "http://test.work.bdlifescience.com"
          : "http://work.bdlifescience.com";
      let prevLink = document.referrer;
      if (prevLink.indexOf(loginUrl) !== -1 && prevLink !== "") {
        return;
      } else {
        if (!auth.isLogin()) {
          window.location.href = `${loginUrl}/login`;
        }
      }
    },
    getSampleBindList(orderID) {
      SamplerServiceApi.getSampleBindList(orderID).then(res => {
        if (res.ret == 0) {
          this.loading = false;
          this.submitSamples = res.data;
          this.validSamples = this.submitSamples.filter(
            sample => sample.sampleAccept == 0 || sample.sampleAccept == 1
          ).length;
        } else {
          this.loading = false;
          this.errMsg = "服务端异常、稍后重试";
          this.show = true;
        }
      });
    }
  },
  mounted() {
    this.hasLogin();
  },
  created: function() {
    this.orderID = this.$route.params.id;
    this.name = this.$route.query.name;
    if (!this.orderID) {
      this.goto("/orderList");
      return;
    }
    this.wxConfig();
    this.getSampleBindList(this.orderID);
  }
};
</script>


<style scoped>
.arrow-right::after {
  content: " ";
  display: inline-block;
  height: 6px;
  width: 6px;
  border-width: 2px 2px 0 0;
  border-color: #c8c8cd;
  border-style: solid;
  -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
  position: relative;
  top: -2px;
  position: absolute;
  top: 53%;
  margin-top: -4px;
}

.body {
  background-color: #f4f5fa;
  min-height: 103vh;
}

.content {
  width: 100%;
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
::placeholder {
  color: #a9a9a9;
}

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

.vux-popup-picker-select > .vux-popup-picker-placeholder {
  color: #a9a9a9;
}

.weui-search-bar .weui-search-bar__box > .weui-search-bar__input {
  font-size: 16px;
}

.weui-search-bar .weui-search-bar__label > span {
  font-size: 16px;
}

.weui-search-bar.weui-search-bar_focusing .weui-search-bar__input {
  font-size: 16px;
}

.weui-search-bar.weui-search-bar_focusing > .weui-search-bar__cancel-btn {
  font-size: 16px;
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

.vux-tab-container {
  top: 0px;
}

.weui-cell__bd > p {
  margin-bottom: 0px;
  margin-top: 0px;
}

.vux-datetime > div > p {
  margin-bottom: 0px;
  margin-top: 0px;
  color: #2c3e50;
}

.vux-cell-primary > p {
  margin-bottom: 0px;
  margin-top: 0px;
}
</style>
