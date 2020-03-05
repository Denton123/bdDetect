<template>
  <div>
    <x-header
      style="background-color:#fff;"
      :left-options="{ backText: '' }"
    ></x-header>
    <group class="textleft">
      <group-title slot="title">支付方式<b class="required">*</b></group-title>
      <popup-radio
        title="付款工具"
        :options="offlineTypeOpts"
        id="payId"
        v-model="payExtra.payType"
      >
      </popup-radio>
      <x-input
        text-align="right"
        type="number"
        placeholder="请输入实付金额"
        required
        @on-change="hanldeMoney"
        :value="payExtra.pAmount"
      >
        <span slot="label">实付金额<b class="required">*</b>：</span></x-input
      >
    </group>
    <div style="background:white;height:73vh;">
      <group class="textleft">
        <group-title slot="title"
          >支付凭证<b class="required">*</b></group-title
        >
        <!-- <vux-upload
          :url="`/reception/api/sales/upload/6`"
          :headers="payUpload.headers"
          :data="payUpload.data"
          :images="payUpload.images"
          :readonly="false"
          :max="12"
          :withCredentials="true"
          :span="4"
          :preview="true"
          @success="onPaySuccess"
          @error="onPayError"
          @remove="onPayRemove"
        ></vux-upload> -->
        <div class="clearfix" style="margin-left: 10px;margin-top:10px;">
          <a-upload
            listType="picture-card"
            :fileList="payUpload.images"
            @preview="handlePreview"
            :remove="handleRemove"
            :showUploadList="{
              showPreviewIcon: false,
              showRemoveIcon: true
            }"
          ></a-upload>
          <a-upload
            :action="`/reception/api/sales/upload/${orderID}/6`"
            listType="picture-card"
            @change="handleChange"
            @preview="handlePreview"
          >
            <div>
              <a-icon type="plus" />
              <div class="ant-upload-text">上传图片</div>
            </div>
          </a-upload>
          <a-modal
            :visible="previewVisible"
            :footer="null"
            @cancel="handleCancel"
          >
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </div>
      </group>
      <div
        class="mt25"
        style="position:fixed;bottom:10px;width:100%;text-align:right;"
      >
        <box gap="0px 20px">
          <x-button
            style="width:28%;display:inline-block;"
            :mini="true"
            @click.native="noType"
            >暂不付款
          </x-button>
          <x-button
            type="primary"
            :mini="true"
            style="background-color:#1890FF!important;width:28%;display:inline-block;"
            @click.native="handleSubmit"
            >确认
          </x-button>
        </box>
      </div>
    </div>
    <toast v-model="show" type="text" width="5.4rem" :time="1200">{{
      errMsg
    }}</toast>
  </div>
</template>

<script>
import {
  XHeader,
  Group,
  Radio,
  GroupTitle,
  PopupRadio,
  XInput,
  Box,
  XButton,
  Toast
} from "vux";
import VuxUpload from "vux-upload";

import SalesService from "../../services/SalesService";
const SalesServiceApi = new SalesService();
export default {
  data() {
    return {
      show: false,
      errMsg: "",
      payExtra: {
        payType: "",
        pAmount: ""
      },
      payUpload: {
        headers: {},
        data: {
          id: 1
        },
        images: []
      },
      payImages: [],
      checkType: "",
      offlineTypeOpts: [
        {
          key: 4,
          value: "微信支付"
        },
        {
          key: 5,
          value: "支付宝"
        },
        {
          key: 6,
          value: "拉卡拉"
        },
        {
          key: 7,
          value: "柜员机转账"
        }
      ],
      orderID: "",
      previewImage: "",
      previewVisible: false,
      test: ""
    };
  },
  components: {
    XHeader,
    Group,
    Radio,
    GroupTitle,
    PopupRadio,
    XInput,
    VuxUpload,
    Box,
    XButton,
    Toast
  },
  methods: {
    hanldeMoney(value) {
      let val = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
      this.payExtra.pAmount = val;
    },
    handleCancel() {
      this.previewVisible = false;
    },
    handlePreview(file) {
      // console.log(file, "=-=-");
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
    },
    handleRemove(index) {
      this.payUpload.images.splice(index, 1);
    },
    handleChange({ file }) {
      // console.log(file);
      if (file.status === "uploading") {
        return;
      } else if (file.status === "done") {
        this.$message.success("上传成功");
        this.payUpload.images.push(file.response);
      }
    },
    onPaySuccess(res, file) {
      this.payUpload.images.push(res);
      this.payImages.push(res.id);
    },
    change(value) {
      console.log(value);
      localStorage.setItem("offlineType", value);
    },
    onPayError(e) {
      // console.log(e);
    },
    onPayRemove(index) {
      this.payUpload.images.splice(index, 1);
    },
    noType() {
      let params = {};
      params.payType = 0;
      params.creditor = "";
      // params.payImages = this.payImages;
      // params.pAmount = this.payExtra.pAmount;
      SalesServiceApi.submitPayType(this.orderID, params).then(res => {
        if (res.ret == 0) {
          this.successMsg = "提交成功";
          this.showSuccess = true;
          console.log("=-=-=-==");
          this.$router.push(`/payInfo/${this.orderID}`);
          // if (
          //   this.payStatus == 1 &&
          //   (this.payType == 1 || this.payType == 2)
          // ) {
          //   //   this.triggerPayment();
          // } else {
          //   this.$router.go('/orderList');
          // }
        } else {
          this.errMsg = res.msg;
          this.show = true;
        }
      });
    },
    handleSubmit() {
      console.log(this.payExtra);
      console.log(this.payUpload);
      let flag = false;
      if (this.payExtra.payType == "") {
        this.show = true;
        this.errMsg = "请选择线下支付方式";
      } else if (this.payExtra.pAmount == "") {
        this.show = true;
        this.errMsg = "请输入实付金额";
      } else if (this.payUpload.images.length == 0) {
        this.show = true;
        this.errMsg = "请选择支付凭证";
      } else {
        flag = true;
      }
      console.log(flag);
      if (flag) {
        console.log("j==============");
        let params = {};
        params.payType = this.payExtra.payType;
        params.creditor = "";
        params.payImages = this.payUpload.images;
        params.pAmount = this.payExtra.pAmount;
        SalesServiceApi.submitPayType(this.orderID, params).then(res => {
          if (res.ret == 0) {
            this.paymentURL = res.data.paymentURL;
            this.successMsg = "提交成功";
            this.showSuccess = true;
            this.$router.push(`/payInfo/${this.orderID}`);
          } else {
            this.errMsg = res.msg;
            this.show = true;
          }
        });
      }
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.orderID = this.$route.params.id;
      let payId = document.querySelector("#payId .vux-label");
      let i = document.createElement("i");
      let span = document.createElement("span");
      i.innerHTML = "*";
      i.style.color = "red";
      span.innerHTML = "：";
      payId.appendChild(i);
      payId.appendChild(span);
    });
  }
};
</script>

<style scoped>
.textleft {
  text-align: left;
}
</style>
<style>
p {
  margin-bottom: 0;
  margin-top: 0;
}

.required {
  color: red;
}
.vux-header .vux-header-left .left-arrow:before {
  border-color: #000 !important;
}
</style>
