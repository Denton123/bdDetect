<template>
  <div style="background:#f4f5fa;">
    <x-header
      @on-click-back="backTo"
      style="background-color:#fff;"
      :left-options="{ backText: '', preventGoBack: true }"
    ></x-header>
    <group title="支付信息" class="textleft">
      <cell-box>{{ payType }}</cell-box>
    </group>
    <group>
      <x-input
        v-if="
          payInfo.paymentType == 4 ||
            payInfo.paymentType == 5 ||
            payInfo.paymentType == 6 ||
            payInfo.paymentType == 7
        "
        title="付款工具："
        :readonly="true"
        v-model="payTool"
        text-align="right"
      ></x-input>
      <x-input
        v-if="payInfo.paymentType == 1 || payInfo.paymentType == 2"
        title="支付流水号："
        :readonly="true"
        class="textleft"
        v-model="payInfo.paySeriNo"
        text-align="right"
      ></x-input>

      <popup-radio
        class="textleft"
        title="授信人 "
        text-align="right"
        :readonly="true"
        :options="creditorOpts"
        placeholder="请选择授信人"
        v-model="payInfo.creditor"
        v-if="payInfo.paymentType == 3"
      ></popup-radio>
      <x-input
        title="实付金额（元）："
        :value="`${payInfo.price}元`"
        text-align="right"
        :readonly="true"
      ></x-input>
    </group>
    <group
      title="支付凭证"
      class="textleft"
      v-if="
        payInfo.paymentType == 4 ||
          payInfo.paymentType == 5 ||
          payInfo.paymentType == 6 ||
          payInfo.paymentType == 7
      "
    >
      <div style="padding:10px;">
        <a-upload
          listType="picture-card"
          :fileList="payInfo.payImages"
          :showUploadList="{
            showPreviewIcon: false,
            showRemoveIcon: false
          }"
        ></a-upload>
        <a-modal
          :visible="previewVisible"
          :footer="null"
          @cancel="handleCancel"
        >
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </div>
      <!-- <vux-upload
        url=""
        :headers="uploadHeaders"
        :images="payInfo.payImages"
        :readonly="true"
        :span="4"
        :preview="true"
      ></vux-upload> -->
    </group>
  </div>
</template>

<script>
import VuxUpload from "vux-upload";
import { XHeader, Group, CellBox, XInput } from "vux";
import SalesService from "../../services/SalesService";
const SalesServiceApi = new SalesService();
export default {
  data() {
    return {
      uploadHeaders: {},
      data: {},
      payTool: "",
      payType: "",
      orderID: "",
      payInfo: {},
      creditorOpts: [],
      previewImage: "",
      previewVisible: false
    };
  },
  components: {
    XHeader,
    Group,
    CellBox,
    XInput
  },
  methods: {
    handleCancel() {
      this.previewVisible = false;
    },
    handlePreview(file) {
      // console.log(file, "=-=-");
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
    },
    handleType(type) {
      switch (type) {
        case 1:
          this.payType = `微信支付`;
          break;
        case 2:
          this.payType = `支付宝`;
          break;
        case 3:
          this.payType = `授信`;
          break;
        case 4:
          this.payType = `线下支付`;
          break;
        case 5:
          this.payType = `线下支付`;
          break;
        case 6:
          this.payType = `线下支付`;
          break;
        case 7:
          this.payType = `线下支付`;
          break;
      }
    },
    handleTool(type) {
      switch (type) {
        case 4:
          this.payTool = `微信`;
          break;
        case 5:
          this.payTool = `支付宝`;
          break;
        case 6:
          this.payTool = `拉卡拉`;
          break;
        case 7:
          this.payTool = `柜员机转账`;
          break;
      }
    },
    getPaymentInfo() {
      SalesServiceApi.getPaymentInfo(this.orderID).then(res => {
        if (res.ret == 0) {
          console.log(res);
          this.handleType(res.data.paymentType);
          this.handleTool(res.data.paymentType);
          this.payInfo = res.data;
        } else {
          this.$router.go(-1);
        }
      });
    },
    backTo() {
      this.$router.push("/orderList");
    },
    getCreditorOpts() {
      SalesServiceApi.getCreditorOpts().then(res => {
        if (res.ret == 0) {
          this.creditorOpts = res.data;
        }
      });
    }
  },
  mounted() {
    this.orderID = this.$route.params.id;
    this.getPaymentInfo();
    this.getCreditorOpts();
  }
};
</script>

<style scoped>
.textleft {
  text-align: left;
}
.weui-input {
  text-align: right;
}
</style>
