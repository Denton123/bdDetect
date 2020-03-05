<template>
  <div>
    <div style="height:0.1px;"></div>
    <group title="患者信息" class="textleft">
      <x-input
        text-align="right"
        title="手机号码"
        v-if="data.patientInfo.phoneNum"
        :value="data.patientInfo.phoneNum"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="姓名"
        v-if="data.patientInfo.name"
        :value="data.patientInfo.name"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="性别"
        v-if="data.patientInfo.gender"
        :value="genderText"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="年龄"
        v-if="data.patientInfo.age"
        :value="data.patientInfo.age + '岁'"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="身份证号码"
        v-if="data.patientInfo.idCard"
        :value="data.patientInfo.idCard"
        :readonly="true"
      ></x-input>

      <x-address
        title="所在地"
        :list="addressData"
        :disabled="true"
        v-if="data.patientInfo.location"
        v-model="data.patientInfo.location"
      ></x-address>
    </group>
    <group title="病理报告" class="textleft" v-if="data.pathology">
      <div style="margin:15px 0px;">
        <vux-upload
          url=""
          :headers="uploadHeaders"
          :images="data.pathology"
          :readonly="true"
          :span="4"
          :preview="true"
        ></vux-upload>
      </div>
    </group>

    <group
      title="医生信息"
      class="textleft"
      v-if="data.doctor.name || data.doctor.dept || data.doctor.hospital"
    >
      <x-input
        text-align="right"
        title="医生"
        v-if="data.doctor.name"
        :value="data.doctor.name"
        :readonly="true"
      ></x-input>
      <x-input
        text-align="right"
        title="科室"
        v-if="data.doctor.department"
        :value="data.doctor.department"
        :readonly="true"
      ></x-input>
      <x-input
        text-align="right"
        title="医院"
        v-if="data.doctor.hospital"
        :value="data.doctor.hospital"
        :readonly="true"
      ></x-input>
    </group>

    <group title="订单详情" class="textleft">
      <!-- <x-input
        text-align="right"
        title="收货人"
        v-if="data.addr.receiver"
        :value="data.addr.receiver"
        :readonly="true"
      >
      </x-input>-->
      <cell title="收货人" v-if="data.addr.receiver">
        <span>{{ data.addr.receiver }}</span>
        <span style="margin-left:6px;color:rgb(21, 133, 255);">{{
          data.addr.receiverType == 1 ? "本人" : "家属"
        }}</span>
      </cell>

      <x-address
        title="所在地"
        :list="addressData"
        :disabled="true"
        v-if="data.addr.addr.length"
        v-model="data.addr.addr"
      ></x-address>
    </group>

    <group title="详细地址" class="textleft" v-if="data.addr.detail">
      <x-textarea
        :value="data.addr.detail"
        :readonly="true"
        :rows="3"
      ></x-textarea>
    </group>
    <group title="地址备注" class="textleft" v-if="data.addr.comment">
      <x-textarea
        :value="data.addr.comment"
        :readonly="true"
        :rows="2"
      ></x-textarea>
    </group>

    <group title class="textleft emptyt">
      <x-input
        text-align="right"
        title="联系人电话"
        v-if="data.addr.template"
        :value="data.addr.tel"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="产品"
        :value="data.item.name"
        :readonly="true"
      ></x-input>

      <x-input
        v-show="order.detail"
        text-align="right"
        title="订单号"
        :value="order.orderID"
        :readonly="true"
      ></x-input>

     <!-- <x-input
        text-align="right"
        title="报告语言"
        :value="data.addr.language == 1 ? '中文报告' : '英文报告'"
        :readonly="true"
      ></x-input> -->

      <x-input
        v-show="order.detail"
        text-align="right"
        title="下单时间"
        :value="order.orderDate"
        :readonly="true"
      ></x-input>

      <x-input
        v-if="order.hasOwnProperty('payType') && order.payType"
        text-align="right"
        title="付款方式"
        :value="payTypeText(order.payType)"
        :readonly="true"
      ></x-input>

      <x-input
        v-if="
          order.hasOwnProperty('payType') &&
            order.payType ==3 &&
            order.creditor
        "
        text-align="right"
        title="授信人"
        :value="order.creditor"
        :readonly="true"
      ></x-input>

      <!-- <x-input
        text-align="right"
        title="金额"
        :value="data.item.amount + '元'"
        :readonly="true"
      ></x-input> -->
    </group>
  </div>
</template>

<script>
import {
  Cell,
  Group,
  XInput,
  XTextarea,
  ChinaAddressV4Data,
  XAddress,
  Value2nameFilter as value2name
} from "vux";
import VuxUpload from "vux-upload";

export default {
  // directives: {
  //   TransferDom
  // },
  props: ["data", "order"],
  components: {
    Group,
    XInput,
    XTextarea,
    Cell,
    // PopupRadio,
    // Previewer,
    // Flexbox,
    // FlexboxItem,
    VuxUpload,
    XAddress
  },
  computed: {
    genderText() {
      // console.log(99, this.data.patientInfo)
      return this.data.patientInfo.gender == "1"
        ? "男"
        : this.data.patientInfo.gender == "2"
        ? "女"
        : "未知";
    },
    sampleStatusText() {
      return this.data.sample.status == "normal" ? "正常" : "异常";
    }
  },
  data() {
    return {
      addressData: ChinaAddressV4Data,
      uploadHeaders: {}
    };
  },
  methods: {
    show(index) {
      this.$refs.previewer.show(index);
    },
    getName(value) {
      return value2name(value, ChinaAddressV4Data);
    },
    payTypeText(payType) {
      // console.log(payType, 'iwiueiwkjk')
      let type = ''
      switch (payType) {
        case 1:
          type = `微信支付`;
          break;
        case 2:
          type = `支付宝`;
          break;
        case 3:
          type = `授信`;
          break;
        case 4:
          type = `微信(线下支付)`;
          break;
        case 5:
          type = `支付宝(线下支付)`;
          break;
        case 6:
          type = `拉卡拉(线下支付)`;
          break;
        case 7:
         type = `柜员机转账(线下支付)`;
          break;
    }
      return type
  },
  },
  mounted() {
    this.uploadHeaders = {
      UserRole: 'BDLS_DAS_SALES'
    };
  }
};
</script>

<style scoped>
.textleft {
  text-align: left;
}
</style>

<style>
.vux-x-textarea.weui-cell {
  padding-left: 10px;
}

.weui-cell__bd > .weui-input {
  /* color: #2C3E50; */
  padding-right: 0px;
}

.weui-cell__bd > p {
  margin-bottom: 0px;
  margin-top: 0px;
}

.vux-datetime > div > p {
  margin-bottom: 0px;
  margin-top: 0px;
}

.vux-cell-primary > p {
  margin-bottom: 0px;
  margin-top: 0px;
}

.weui-cell__ft .vux-cell-value {
  color: #2c3e50;
}

.vux-popup-picker-select .vux-cell-value {
  color: #2c3e50;
}

.emptyt .vux-no-group-title {
  margin-top: -1px;
}
</style>
