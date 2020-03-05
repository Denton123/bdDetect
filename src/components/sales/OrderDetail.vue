<template>
  <div>
    <div style="height:0.1px;"></div>
    <group title="患者信息" class="textleft">
      <x-input
        text-align="right"
        title="手机号码"
        :value="data.patientInfo.phoneNum"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="姓名"
        :value="data.patientInfo.name"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="性别"
        :value="genderText"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="年龄"
        :value="data.patientInfo.age > 0 ? data.patientInfo.age + '岁' : ''"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="身份证号码"
        :value="data.patientInfo.idCard"
        :readonly="true"
      ></x-input>

      <x-address
        title="所在地"
        :list="addressData"
        :disabled="true"
        v-model="data.patientInfo.location"
      ></x-address>
    </group>
    <div v-if="data.pathology.length > 0">
      <group title="病理图片" class="textleft">
        <vux-upload
          url=""
          :headers="uploadHeaders"
          :images="data.pathology"
          :readonly="true"
          :withCredentials="false"
          :span="4"
          :preview="true"
        ></vux-upload>
      </group>
    </div>

    <group title="医生信息" class="textleft">
      <x-input
        text-align="right"
        title="主治医生"
        :value="data.doctor.name"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="医院"
        :value="data.doctor.hospital"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="科室"
        :value="data.doctor.department"
        :readonly="true"
      ></x-input>
    </group>

    <group title="专业诊断" class="textleft">
      <x-input
        text-align="right"
        title="临床诊断"
        :value="data.diagnose.diagnosis"
        :readonly="true"
      ></x-input>
    </group>

    <group title="治疗史" class="textleft">
      <x-textarea :value="data.diagnose.history" :readonly="true"></x-textarea>
    </group>

    <group title="疾病史" class="textleft">
      <x-textarea :value="data.diagnose.disease" :readonly="true"></x-textarea>
    </group>

    <group title="家族史" class="textleft">
      <x-textarea :value="data.diagnose.family" :readonly="true"></x-textarea>
    </group>

    <group title="病情描述" class="textleft">
      <x-textarea :value="data.diagnose.descr" :readonly="true"></x-textarea>
    </group>

    <div v-if="data.diagnose.images && data.diagnose.images.length > 0">
      <group title="病情图片" class="textleft">
        <vux-upload
          url
          :headers="uploadHeaders"
          :images="data.diagnose.images"
          :readonly="true"
          :withCredentials="false"
          :span="4"
          :preview="true"
        ></vux-upload>
      </group>
    </div>

    <group
      :title="`样本${index + 1}`"
      class="textleft"
      v-for="(sample, index) in data.samples"
      :key="index"
    >
      <x-input
        text-align="right"
        title="样本条码"
        :value="sample.barcode"
        :readonly="true"
      ></x-input>
      <popup-picker
        class="textleft"
        title="样本类型"
        ref="tumorSliceType"
        :data="data.opts.tumorSliceTypeOpts"
        :columns="2"
        v-model="sample.tumorSliceType"
        :disabled="true"
        show-name
      ></popup-picker>

      <x-input
        text-align="right"
        title="样本数量"
        :value="sample.num"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="取材位置"
        :value="sample.tumorSlicePosition"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="样本病理编号"
        :value="sample.no"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="肿瘤细胞含量"
        :value="sample.cellPercent ? sample.cellPercent + '%' : ''"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="正常对照样本"
        :value="sample.compareSample == 1 ? '是' : '否'"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="样本状态"
        :value="sample.sampleStatus == 1 ? '正常' : '异常'"
        :readonly="true"
      ></x-input>

      <x-input
        v-if="sample.sampleStatus != 1"
        text-align="right"
        title="异常原因"
        :value="sample.abnormal"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="采样日期"
        :value="sample.simplingDate"
        :readonly="true"
      ></x-input>
      <x-textarea
        title="样本备注"
        :value="sample.sRemark"
        :readonly="true"
      ></x-textarea>
    </group>
    <group title="样本备注" class="textleft" v-if="data.sampleComment">
      <x-textarea :value="data.sampleComment" :readonly="true"></x-textarea>
    </group>

    <group title="订单详情" class="textleft">
      <!-- <x-input
        text-align="right"
        title="收货人"
        :value="data.addr.receiver"
        :readonly="true"
      >
      </x-input>-->
      <cell title="收货人">
        <span>{{ data.addr.receiver }}</span>
        <span
          v-if="data.addr.receiver"
          style="margin-left:6px;color:rgb(21, 133, 255);"
          >{{ data.addr.receiverType == 1 ? "本人" : "家属" }}</span
        >
      </cell>

      <x-address
        title="所在地"
        :list="addressData"
        :disabled="true"
        v-model="data.addr.addr"
      ></x-address>
    </group>

    <group title="详细地址" class="textleft">
      <x-textarea
        :value="data.addr.detail"
        :readonly="true"
        :rows="3"
      ></x-textarea>
    </group>

    <group title class="textleft emptyt">
      <x-input
        text-align="right"
        title="联系人电话"
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
        :value="data.order.orderID"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="报告语言"
        :value="data.addr.language == 1 ? '中文报告' : '英文报告'"
        :readonly="true"
      ></x-input>

      <x-input
        v-show="order.detail"
        text-align="right"
        title="下单时间"
        :value="data.order.orderDate"
        :readonly="true"
      ></x-input>

      <x-input
        v-show="order.detail"
        text-align="right"
        title="订单状态"
        :value="orderStatusText(data.order.status)"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="订单金额"
        :value="'¥' + data.order.price"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="支付方式"
        :value="payTypeText(data.pay.payType)"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="是否支付"
        :value="data.order.payStatus > 1 ? '是' : '否'"
        :readonly="true"
      ></x-input>

      <x-input
        v-if="data.order.payStatus > 1"
        text-align="right"
        title="是否退款"
        :value="data.pay.isRefund == 0 ? '否' : '是'"
        :readonly="true"
      ></x-input>

      <x-input
        v-if="data.pay.isRefund == 1"
        text-align="right"
        title="取消原因"
        :value="data.pay.reason"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="业务员"
        :value="data.addr.salesman"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="业务员联系方式"
        :value="data.addr.salemanContact"
        :readonly="true"
      ></x-input>
    </group>

    <group
      title="发票"
      class="textleft"
      v-if="data.hasOwnProperty('invoice') && data.invoice.length > 0"
    >
      <x-input
        text-align="right"
        title="发票类型"
        :value="data.invoice.type"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="发票抬头"
        :value="data.invoice.taxpayer"
        :readonly="true"
      ></x-input>

      <x-input
        v-if="data.invoice.taxpayerType == 1"
        text-align="right"
        title="纳税人识别号"
        :value="data.invoice.taxpayerNO"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="发票内容"
        :value="data.invoice.subject"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="发票金额"
        :value="data.invoice.amount"
        :readonly="true"
      ></x-input>

      <x-input
        text-align="right"
        title="发票状态"
        :value="data.invoice.status"
        :readonly="true"
      ></x-input>
    </group>

    <group title="备注" class="textleft">
      <x-textarea
        :value="data.patientInfo.comment"
        :readonly="true"
        :rows="2"
      ></x-textarea>
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
  PopupPicker,
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
    PopupPicker,
    // Previewer,
    // Flexbox,
    // FlexboxItem,
    VuxUpload,
    XAddress
  },
  computed: {
    genderText() {
      return this.data.patientInfo.gender == "1"
        ? "男"
        : this.data.patientInfo.gender == "2"
        ? "女"
        : "";
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
    orderStatusText(status) {
      const subStatus = this.data.order.subStatus;
      if (status == 1) {
        return "已下单";
      } else if (status == 2) {
        return "已受理";
      } else if (status == 3) {
        if (subStatus == 0) {
          return "检测中";
        } else {
          return this.subStatusText(subStatus);
        }
      } else if (status == 4) {
        return "已完成";
      } else if (status == 5) {
        return "已取消";
      } else {
        return "未知 #" + status;
      }
    },
    subStatusText(ss) {
      let text = "";
      switch (ss) {
        case 1:
          text = "样本已验收";
          break;
        case 2:
          text = "上机";
          break;
        case 3:
          text = "下机";
          break;
        case 4:
          text = "开始分析";
          break;
        case 5:
          text = "完成分析";
          break;
        case 6:
          text = "报告准备中";
          break;
        default:
          text = "";
      }
      return text;
    },
    show(index) {
      this.$refs.previewer.show(index);
    },
    getName(value) {
      return value2name(value, ChinaAddressV4Data);
    },
    payTypeText(payType) {
      let type = "";
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
      return type;
    }
  },
  mounted() {
    this.uploadHeaders = {
      UserRole: "BDLS_DAS_SALES"
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
.weui-textarea {
  /*text-align: right;*/
}
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
