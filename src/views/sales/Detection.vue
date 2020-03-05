<template>
  <div>
    <div v-if="loading">
      <div style="height:10vh;"></div>
      <p style="text-align:center;">
        <inline-loading></inline-loading>
      </p>
    </div>

    <div v-if="showPay">
      <masker :fullscreen="true">
        <div
          style="z-index:99999;position:fixed;height:100vh;width:100%;display:flex;align-items:center;justify-content: center;"
        >
          <div
            style=";border:1px solid #DDDDDD;border-radius:3px;background-color:#fff;width:82%;"
          >
            <div
              style="background-color:rgba(247, 247, 247, 100);text-align:left;padding:16px 0 16px 15px"
            >
              <span style="font-size:18px;color:#108EE9;">
                <b>二维码扫码收费</b>
              </span>
            </div>
            <div
              style="text-align:center;padding: 50px 0 65px 0px;border-bottom: 1px solid #DDDDDD;"
            >
              <qrcode :value="paymentURL" type="img"></qrcode>
            </div>
            <div style="padding: 16px 0;">
              <span style="font-size:18px;" @click="delayPayment">
                <b>暂不支付</b>
              </span>
            </div>
          </div>
        </div>
      </masker>
    </div>
    <div>
      <div v-transfer-dom>
        <confirm
          v-model="showConfirm"
          confirm-text="知道了"
          @on-confirm="detailDetection()"
          :show-cancel-button="false"
          title="支付成功"
        >
          <p style="text-align:center;">支付成功，已到账</p>
        </confirm>
      </div>
    </div>

    <div v-show="!loading" class="body bodyContent">
      <div v-show="!preview && !submitDetail">
        <div>
          <toast v-model="show" type="text" width="5.4rem" :time="1200">{{
            errMsg
          }}</toast>
          <toast
            v-model="showSuccess"
            @on-hide="toPay()"
            type="success"
            width="5.4rem"
            :time="800"
          >
            <div style="padding: 0 0.5rem;text-align:center;">
              {{ successMsg }}
            </div>
          </toast>

          <tab
            v-model="step"
            bar-active-color="#108EE9"
            active-color="#108EE9"
            :line-width="2"
          >
            <tab-item>患者信息</tab-item>
            <tab-item :disabled="step < 1">医院医生</tab-item>
            <!-- <tab-item :disabled="step < 2">收货信息</tab-item> -->
            <tab-item :disabled="step < 2">样本信息</tab-item>
          </tab>

          <div v-show="step == 0">
            <div class="stepDiv1" style="height: 80vh;">
              <group title class="textleft">
                <x-input
                  text-align="right"
                  ref="phoneNum"
                  v-model="patientInfo.phoneNum"
                  placeholder="请填写11位手机号码"
                  placeholder-align="right"
                  @on-blur="phoneNumSet"
                  :min="11"
                  :max="11"
                  mask="99999999999"
                  is-type="china-mobile"
                  :should-toast-error="false"
                  @on-click-clear-icon="patientInfo.phoneNum = ''"
                  required
                >
                  <span slot="label">手机号码<b class="required">*</b></span>
                </x-input>
                <x-input
                  text-align="right"
                  ref="name"
                  v-model="patientInfo.name"
                  placeholder="请填写姓名"
                  :should-toast-error="false"
                  :min="2"
                  :max="16"
                  @on-click-clear-icon="patientInfo.name = ''"
                  required
                >
                  <span slot="label">姓名<b class="required">*</b></span>
                </x-input>
                <popup-radio
                  class="textleft"
                  id="sexRadio"
                  ref="gender"
                  title="性别"
                  :options="genderOpts"
                  v-model="patientInfo.gender"
                  placeholder="请选择性别"
                  @on-click-clear-icon="patientInfo.gender = ''"
                  required
                >
                  <span slot="title">性别<b class="required">*</b></span>
                </popup-radio>

                <x-input
                  text-align="right"
                  ref="age"
                  mask="999"
                  :max="3"
                  :min="1"
                  @on-blur="ageSet"
                  v-model="patientInfo.age"
                  placeholder="请输入年龄"
                  :should-toast-error="false"
                  @on-click-clear-icon="patientInfo.age = ''"
                  required
                >
                  <span slot="label">年龄<b class="required">*</b></span>

                  <template slot="right">
                    <div
                      v-if="patientInfo.age"
                      style="display:inline-block;float:left;"
                    >
                      <span style="color:#2C3E50;">岁</span>
                    </div>
                  </template>
                </x-input>
                <!-- <x-input text-align="right" title="身份证号码" ref="idCard" mask="99999999999999999S" :max="18" :min="18" v-model="patientInfo.idCard" placeholder="请输入身份证号码" :should-toast-error="false"></x-input> -->

                <!-- <x-address title="所在地" ref="location" :list="addressData" placeholder="请选择所在地区" v-model="patientInfo.location"></x-address> -->
                <popup-radio
                  class="textleft"
                  title="是否采样新样本"
                  ref="sampling"
                  :options="samplingOpts"
                  v-model="patientInfo.sampling"
                  placeholder="是否采样新样本"
                  @on-click-clear-icon="patientInfo.sampling = ''"
                  @on-hide="samplingChange"
                ></popup-radio>
                <div style="padding: 0 15px;" v-if="isSampling">
                  <x-table>
                    <thead>
                      <tr style="background-color: #F7F7F7">
                        <th>序号</th>
                        <th>条形码</th>
                        <th>是否癌症样本</th>
                        <th>验收日期</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in isSamplingData"
                        :key="index"
                        @click="choiceSampling(item, index)"
                        :class="{
                          activeSample: sampleArr.indexOf(item.id) > -1
                        }"
                      >
                        <td v-for="(value, key) in isSamplingLabel" :key="key">
                          {{ item[key] }}
                        </td>
                      </tr>
                    </tbody>
                  </x-table>
                </div>
              </group>
              <!-- <group title="病理报告(必填)" class="textleft"> -->
              <!-- <span>{{upload}}</span> -->
              <!-- <div style="margin:15px 0px;">
        <vux-upload :url="`/reception/api/sales/upload/2`" :headers="upload.headers" :data="upload.data" :images="upload.images" :readonly="false" :max="12" :withCredentials="true" :span="4" :preview="true" @success="onSuccess" @error="onError" @remove="onRemove"></vux-upload>
    </div>
</group> -->

              <div
                class="mt25"
                style="position: fixed;bottom: 10px;width: 100%;"
              >
                <box gap="0px 20px">
                  <x-button
                    type="primary"
                    style="background-color:#1890FF!important;"
                    @click.native="nextStep(1)"
                    >下一步
                  </x-button>
                </box>
              </div>
            </div>
          </div>

          <div v-show="step == 1">
            <div class="stepDiv5" style="padding-bottom:12px;">
              <group title class="textleft">
                <x-input
                  text-align="right"
                  ref="doctor"
                  :max="16"
                  :min="2"
                  v-model="doctor.name"
                  placeholder="请填写医生姓名"
                  placeholder-align="right"
                  :should-toast-error="false"
                  @on-click-clear-icon="doctor.name = ''"
                  required
                >
                  <span slot="label">医生<b class="required">*</b></span>
                </x-input>
                <x-input
                  text-align="right"
                  ref="department"
                  :max="32"
                  :min="2"
                  v-model="doctor.department"
                  placeholder="请填写科室"
                  placeholder-align="right"
                  :should-toast-error="false"
                  @on-click-clear-icon="doctor.department = ''"
                  required
                >
                  <span slot="label">科室<b class="required">*</b></span>
                </x-input>
                <x-input
                  text-align="right"
                  ref="hospital"
                  :max="32"
                  :min="1"
                  v-model="doctor.hospital"
                  placeholder="请填写医院"
                  placeholder-align="right"
                  :should-toast-error="false"
                  @on-click-clear-icon="doctor.hospital = ''"
                  required
                >
                  <span slot="label">医院<b class="required">*</b></span>
                </x-input>
              </group>

              <div style="position:absolute;bottom:43px;width:100%;">
                <box gap="0px 20px">
                  <x-button
                    type="primary"
                    style="background-color:#1890FF!important;"
                    @click.native="nextStep(2)"
                    >下一步
                  </x-button>
                </box>
              </div>
            </div>
          </div>

          <div v-show="step == 2">
            <div class="stepDiv5" style="padding-bottom:12px;">
              <!-- <group title class="textleft">
            <popup-radio class="textleft" title="患者关系" ref="receiverType" :options="[{key: 1, value: '本人'}, {key: 2, value: '家属'}]" v-model="addr.receiverType" @on-click-clear-icon="addr.receiverType = ''"></popup-radio>
            <x-input text-align="right" title="收货人" ref="receiver" :max="16" :min="2" v-model="addr.receiver" placeholder="请填写收货人姓名" placeholder-align="right" :should-toast-error="false" @on-click-clear-icon="addr.receiver = ''"></x-input>

            <x-address title="所在地" ref="addr" :list="addressData" placeholder="请选择所在地区" v-model="addr.addr" :should-toast-error="false" @on-click-clear-icon="addr.addr = ''"></x-address>

            <x-input text-align="right" title="详细地址" ref="detail" :max="120" :min="6" v-model="addr.detail" placeholder="请填写详细收货地址" placeholder-align="right" :should-toast-error="false" @on-click-clear-icon="addr.detail = ''"></x-input>
            <x-input text-align="right" title="联系电话" ref="tel" :max="13" :min="6" v-model="addr.tel" placeholder="请填写收货人联系电话" placeholder-align="right" :should-toast-error="false" @on-click-clear-icon="addr.tel = ''"></x-input>
            <popup-radio class="textleft" title="报告语言" ref="language" :options="languageOpts" v-model="addr.language" placeholder="请选择报告语言" :should-toast-error="false" @on-click-clear-icon="addr.language = ''" required></popup-radio>
        </group> -->
              <div v-if="isOffline">
                <group class="textleft">
                  <group-title slot="title"
                    >支付方式<b class="required">*</b></group-title
                  >

                  <popup-radio
                    title="付款工具："
                    :options="offlineTypeOpts"
                    v-model="payExtra.payType"
                    id="test"
                    ref="payRadio"
                  >
                  </popup-radio>
                  <x-input
                    text-align="right"
                    type="number"
                    placeholder="请输入实付金额"
                    required
                    mask="99999"
                    :max="5"
                    :min="1"
                    @on-change="change"
                    v-model="payExtra.pAmount"
                  >
                    <span slot="label"
                      >实付金额<b class="required">*</b>：</span
                    >
                  </x-input>
                </group>
                <div style="height:73vh;">
                  <group class="textleft">
                    <group-title slot="title"
                      >支付凭证<b class="required">*</b></group-title
                    >
                    <vux-upload
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
                    ></vux-upload>
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
              </div>
              <div v-else>
                <div v-if="sampleArr.length == 0">
                  <div v-for="(sample, index) in samples" :key="index">
                    <group class="textleft">
                      <group-title slot="title"
                        >样本信息{{ index + submitSamples.length + 1
                        }}<b class="required">*</b></group-title
                      >
                      <x-input
                        text-align="right"
                        title="样本条码"
                        placeholder="扫描或填写样本条形码 "
                        :max="9"
                        :min="9"
                        :ref="'sample' + index"
                        :show-clear="false"
                        v-model="sample.barcode"
                        placeholder-align="right "
                        :should-toast-error="false"
                        required
                      >
                        <template slot="right">
                          <div
                            style="padding-left:8px;display:inline-block; "
                            @click="samplewxscan(index)"
                          >
                            <img
                              style="width:23px;height:23px; "
                              src="../../assets/scan.png"
                            />
                          </div>
                        </template>
                      </x-input>
                      <cell title="操作" v-if="sample.barcode !== ''">
                        <a href="javascript:void(0)">
                          <!-- <span @click="saveEditSample(sample, index)" v-if="activeIndex ==index" 
                            >保存</span
                          >
                          <span @click="editSample(sample, index)" v-else>编辑</span> -->
                        </a>
                        <a href="javascript:void(0)" @click="showDelete(index)"
                          >删除</a
                        >
                      </cell>
                    </group>
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

                  <div class="mt25 " v-if="validSamples + samples.length < 2">
                    <box gap="0px 20px " style="white-space:nowrap; ">
                      <div>
                        <x-button
                          style="background-color:#FFFFFF!important; "
                          @click.native="appendSample"
                        >
                          <span style="color:black;">添加样本</span>
                        </x-button>
                      </div>
                    </box>
                  </div>
                </div>
                <group class="textleft ">
                  <group-title slot="title"
                    >支付方式<b class="required">*</b></group-title
                  >
                  <radio
                    :options="payOpts"
                    ref="payType"
                    v-model="addr.payType"
                    @on-change="choicePay"
                    @click.native="clickPay"
                  ></radio>
                  <template v-if="addr.payType == 3">
                    <popup-radio
                      class="textleft "
                      title="授信人 "
                      ref="creditor "
                      :options="creditorOpts"
                      v-model="addr.creditor"
                      placeholder="请选择授信人 "
                    ></popup-radio>
                  </template>
                </group>

                <div class="mt25 ">
                  <box gap="0px 20px ">
                    <x-button
                      type="primary "
                      style="background-color:#1890FF!important; "
                      @click.native="handleSubmit"
                      >提交
                    </x-button>
                  </box>
                </div>

                <div class="mt25">
                  <box gap="0px 20px ">
                    <x-button
                      style="background-color:#FFFFFF!important; "
                      @click.native="previewDetection"
                    >
                      <span style="color:black; ">预览</span>
                    </x-button>
                  </box>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="preview">
        <OrderBaseComponent
          :data="detailData"
          :order="{
            detail: false,
            payType: payExtra.payType ? payExtra.payType : addr.payType,
            status: order.status,
            creditor: creditorName()
          }"
        >
        </OrderBaseComponent>
        <div class="mt25 mb37 ">
          <box gap="0px 20px ">
            <x-button
              type="primary "
              @click.native="preview = false"
              style="background-color:#1890FF!important; "
              >确认
            </x-button>
          </box>
        </div>
      </div>

      <div v-if="submitDetail">
        <OrderBaseComponent
          :data="detailData"
          :order="{
            detail: true,
            payType: payExtra.payType ? payExtra.payType : addr.payType,
            orderID: order.orderID,
            orderDate: order.orderDate,
            status: order.status,
            creditor: creditorName()
          }"
        >
        </OrderBaseComponent>
        <div class="mt25 mb37 ">
          <box gap="0px 20px ">
            <x-button
              type="primary "
              @click.native="detailClick"
              style="background-color:#1890FF!important; "
              >确认
            </x-button>
          </box>
        </div>
      </div>
    </div>
  </div>
</template>

<i18n>
hospital: zh-CN: '请输入医院'
department: zh-CN: '请输入科室'
    doctor: zh-CN: '请输入医生姓名'
    phoneNum: zh-CN: '请输入11位手机w号码'
    gender: zh-CN: 请选择性别 
    language: zh-CN: 请选择报告语言 
    name: zh-CN: 请输入2-16位长度的姓名 
    age: zh-CN: 请输入年龄 
    idCard: zh-CN: 请输入18位身份证号码 
    email: zh-CN: 请输入正确邮箱如：123456@qq.com 
    diagnosis: zh-CN: 请选择或输入临床诊断结果 
    receiver:
    zh-CN: 请输入收货人信息 
    detail: zh-CN: 请输入详细收货地址 tel: zh-CN: 请输入收货人联系电话 barcode: zh-CN: 请输入样本条码 location: zh-CN: 请选择所在地区 doctorID: zh-CN: 请选择主治医生 history: zh-CN: 请输入治疗史信息 family: zh-CN: 请输入家族史信息 descr: zh-CN: 请填写（1-500字）病情信息 addr: zh-CN: 请输入收货地址 receiverType:
    zh-CN: 请选择患者关系 tumorSliceType: zh-CN: 请选择样本类型 compareSample: zh-CN: 请选择正常对照样本 num: zh-CN: 请填写样本数量 sampleStatus: zh-CN: 请选择样本状态 abnormal: zh-CN: 请填写异常原因 payType: zh-CN: 请选择支付方式
</i18n>

<script>
import auth from "../../auth.js";

import OrderBaseComponent from "../../components/sales/OrderBase.vue";
import {
  InlineLoading,
  Masker,
  Qrcode,
  Confirm,
  TransferDom,
  Radio,
  PopupRadio,
  Group,
  Box,
  XButton,
  XInput,
  Toast,
  Tab,
  TabItem,
  ChinaAddressV4Data,
  XAddress,
  Value2nameFilter as value2name,
  XTable,
  GroupTitle,
  Cell
} from "vux";
import VuxUpload from "vux-upload";

import SalesService from "../../services/SalesService.js";
const SalesServiceApi = new SalesService();
import moment from "moment";
import SamplerService from "../../services/SamplerService";
const SamplerServiceApi = new SamplerService();

export default {
  directives: {
    TransferDom
  },
  components: {
    Confirm,
    InlineLoading,
    Qrcode,
    OrderBaseComponent,
    Group,
    Radio,
    XButton,
    PopupRadio,
    Box,
    XInput,
    Toast,
    Tab,
    TabItem,
    XAddress,
    VuxUpload,
    Masker,
    XTable,
    Cell,
    GroupTitle
  },
  data() {
    return {
      showConfirm: false,
      showPay: false,
      loading: true,
      paymentURL: " ",
      intervalID: " ",
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
          value: "线下支付 "
        },
        {
          key: 3,
          value: "授信 "
        }
      ],
      samplingOpts: [
        {
          key: 1,
          value: "是 "
        },
        {
          key: 2,
          value: "否 "
        }
      ],
      upload: {
        headers: {},
        data: {
          id: 1
        },
        images: []
      },
      payUpload: {
        headers: {},
        data: {
          id: 1
        },
        images: []
      },
      pathology: [],
      focusedTextarea: " ",
      step: 0,
      disabled: false,
      doScan: false,
      preview: false,
      submitDetail: false,
      detailData: {},
      projectItem: {
        id: "",
        amount: "",
        name: ""
      },
      patientInfo: {
        phoneNum: "",
        name: "",
        gender: "",
        age: "",
        sampling: 1
        // idCard: " ",
        // location: []
      },
      doctor: {
        name: "",
        department: "",
        hospital: ""
      },
      addr: {
        receiver: "",
        receiverType: "",
        addr: [],
        detail: "",
        tel: "",
        payType: "",
        creditor: "",
        language: ""
      },
      payExtra: {
        payType: "",
        pAmount: ""
      },
      order: {
        orderID: "",
        orderDate: ""
      },
      genderOpts: [
        {
          key: 1,
          value: "男"
        },
        {
          key: 2,
          value: "女"
        }
      ],
      languageOpts: [
        {
          key: 1,
          value: "中文报告"
        },
        {
          key: 2,
          value: "英文报告 "
        }
      ],
      creditorOpts: [],
      addressData: ChinaAddressV4Data,
      show: false,
      show1: false,
      showSuccess: false,
      successMsg: " ",
      errMsg: " ",
      isSampling: false,
      isSamplingLabel: {
        serial: "标识",
        code: "条形码",
        status: "样本状态",
        aceptTime: "验收日期"
      },
      choiceActive: false,
      choiceIndex: -1,
      isSamplingData: [
        // {
        //   id: "0 ",
        //   code: "23252 ",
        //   status: "1 ",
        //   aceptTime: "2015-2-2 ",
        //   check: false
        // },
        // {
        //   id: "1 ",
        //   code: "23252 ",
        //   status: "1 ",
        //   aceptTime: "2015-2-2 ",
        //   check: false
        // },
        // {
        //   id: "2 ",
        //   code: "23252 ",
        //   status: "1 ",
        //   aceptTime: "2015-2-2 ",
        //   check: false
        // }
      ],
      sampleArr: [],
      sampleStatus: [],
      submitSamples: [],
      samples: [
        {
          barcode: ""
        }
      ],
      validSamples: 0,
      isOffline: false,
      payImages: [],
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
      activeIndex: 0,
      showConfirm: false,
      noPay: false
    };
  },
  methods: {
    showDelete(index) {
      // this.showConfirm = true;
      this.samples.splice(index, 1);
      // console.log(this.samples)
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
    editSample(item, index) {
      this.activeIndex = index;
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
    change(value) {
      console.log(value);
      // let noNum = isNaN(e.target.value) && !/^-$/.test(e.target.value);
      // let flag = /^[+-]?\d*\.{0,2}\d{0,2}$/.test(e.target.value);
      // if (noNum) {
      //   e.target.value = "";
      //   row[`${key}`] = "";
      // } else if (!flag) {
      //   e.target.value = e.target.value.replace(
      //     /\.\d{2,}$/,
      //     e.target.value.substr(e.target.value.indexOf("."), 3)
      //   );
      //   row[`${key}`] = e.target.value.replace(
      //     /\.\d{2,}$/,
      //     e.target.value.substr(e.target.value.indexOf("."), 3)
      //   );
      // }
      // value= "hu";
    },
    toPayType() {
      this.$router.push("/payType");
    },
    // 线下支付
    choicePay(value) {
      if (value == 9) {
        console.log(value);
        this.isOffline = true;
      }
    },
    clickPay(value) {
      if (value.target.value == 9) {
         this.isOffline = true;
         this.addr.payType = 9
      }
    },
    appendSample() {
      if (this.validSamples + this.samples.length >= 2) {
        this.errMsg = "最多只能存在2个有效样本 ";
        this.show = true;
      } else {
        const samples = [...this.samples];
        samples.push({
          barcode: " "
        });
        this.samples = samples;
      }
    },
    samplewxscan(key) {
      this.$wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["barCode "], // 可以指定扫二维码还是一维码，默认二者都有 qrCode
        success: res => {
          // alert(res.resultStr)
          this.samples[key]["barcode "] = res.resultStr;
        }
      });
    },
    // 是否采样新样本
    samplingChange() {
      // console.log(this.patientInfo.sampling);
      let flagText = this.patientInfo.sampling;
      let phoneNum = this.patientInfo.phoneNum;
      if (flagText == 2) {
        if (phoneNum !== " ") {
          this.isSampling = true;
          SalesServiceApi.getSampleList(phoneNum).then(res => {
            if (res.ret == 0) {
              this.sampleArr = [];
              this.sampleStatus = [];
              // console.log(res);
              this.isSamplingData = res.data;
              this.isSamplingData.forEach((v, i) => {
                v.status = v.status == 1 ? "否 " : "是 ";
                v.aceptTime =
                  v.aceptTime !== null
                    ? moment(v.aceptTime).format("YYYY-MM-DD ")
                    : "";
                v.check = false;
                v.serial = i + 1;
              });
            }
          });
        } else {
          this.$message.error("电话号码不为空 ");
        }
      } else {
        this.isSampling = false;
      }
    },
    choiceSampling(item, id) {
      // console.log(item, item.status, "状态 ");
      // if (this.sampleArr.length >= 2) {
      // this.$message.error("最多可选两个样本 ");
      // if (new Set(this.sampleStatus).size !== this.sampleStatus.length) {
      //   console.log("重复 ");
      //   this.$message.error(
      //     "最多可选两个样本，且一个为异常，一个为正常，请重新选择 "
      //   );
      //   // item.check = !item.check;
      //   // this.choiceActive = item.check
      //   // this.choiceIndex = item.id
      //   // console.log(id, "index ", item.check);
      //   // if (item.check) {
      //   //   this.sampleArr.push(item.id);
      //   //   this.sampleStatus.push(item.status);
      //   // } else {
      //   //   this.sampleArr.splice(this.sampleArr.indexOf(item.id), 1);
      //   //   this.sampleStatus.splice(this.sampleStatus.indexOf(item.status), 1);
      //   // }
      // } else {
      //   console.log('最多可选两个样本')
      //   this.$message.error("最多可选两个样本 ");
      // }
      // } else {
      // console.log(this.sampleStatus, this.sampleArr)
      if (
        this.sampleStatus.indexOf(item.status) !== -1 &&
        this.sampleArr.indexOf(item.id) === -1
      ) {
        this.$message.error(
          "最多可选两个样本，且一个为异常，一个为正常，请重新选择 "
        );
      } else {
        item.check = !item.check;
        // this.choiceActive = item.check
        // this.choiceIndex = item.id
        // this.isSamplingData[id].check = item.check
        // console.log(this.isSamplingData)

        // console.log(id, "index ", item.check,this.choiceActive);
        if (item.check) {
          this.sampleArr.push(item.id);
          this.sampleStatus.push(item.status);
        } else {
          this.sampleArr.splice(this.sampleArr.indexOf(item.id), 1);
          this.sampleStatus.splice(this.sampleStatus.indexOf(item.status), 1);
        }
      }
      console.log(this.sampleArr, "sampleArr");
      // }
      // console.log(this.sampleArr, this.sampleStatus, "状态 ");
      // this.$set(item, 'check', true)
    },
    getCreditorOpts() {
      SalesServiceApi.getCreditorOpts().then(res => {
        if (res.ret == 0) {
          this.creditorOpts = res.data;
        } else {
          this.goto("/projects ");
        }
      });
    },
    creditorName() {
      const opts = [...this.creditorOpts];
      const target = opts.filter(item => item.key == this.addr.creditor)[0];
      if (target) {
        return target.value;
      }
      return " ";
    },
    ageSet() {
      if (this.$refs.age.valid && this.patientInfo.age > 150) {
        this.patientInfo.age = 150;
      }
    },
    phoneNumSet(value) {
      if (this.$refs.phoneNum.valid) {
        this.disabled = false;
        SalesServiceApi.GetInfoByPhoneNum(value).then(res => {
          // console.log(res, 'test phone')
          if (res.ret == 0) {
            // set defualt value 只设置 step = 0 and step= 4
            this.patientInfo = res.data.patientInfo;
            this.addr = res.data.addr;
            this.doctor.name = res.data.doctor.sDName;
            this.doctor.department = res.data.doctor.sDDept;
            this.doctor.hospital = res.data.doctor.sDHospital;
            this.patientInfo.sampling = 1;
            // console.log(this.doctor);
            return true;
          } else {
            return false;
          }
        });
      }
    },
    stepChange(step) {
      this.step = step;
    },
    nextStep(step) {
      if (this.validate(this.step)) {
        this.step = step;
      }
      if (step == 2) {
        this.isOffline = false;
      }
      // this.step = step;
    },
    toPay() {
      if ([1, 2].includes(this.addr.payType)) {
        this.showPay = true;
        this.intervalID = setInterval(() => {
          this.intervalCheckPayment();
        }, 1000 * 3);
      } else {
        this.detailDetection();
      }
    },
    previewDetection() {
      if (this.allValidate()) {
        this.detailData = {
          // pathology: this.pathology,
          patientInfo: this.patientInfo,
          addr: this.addr,
          doctor: this.doctor,
          item: this.projectItem,
          payExtra: this.payExtra
        };
        this.preview = true;
      }
    },
    detailDetection() {
      this.detailData = {
        // pathology: this.pathology,
        patientInfo: this.patientInfo,
        addr: this.addr,
        doctor: this.doctor,
        item: this.projectItem,
        payExtra: this.payExtra
      };
      console.log(this.detailData, "ddddddddddddddddd");
      this.submitDetail = true;
    },
    intervalCheckPayment() {
      // console.log(this.order, 'order')
      SalesServiceApi.getPaymentInfo(this.order.orderID).then(res => {
        if (res.ret == 0) {
          if (
            res.data.paymentType == this.addr.payType &&
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
    delayPayment() {
      this.showPay = false;
      this.clearInterval();
      this.detailDetection();
    },
    noType() {
      this.noPay = true;
      let sampleParams = [];
      this.samples.forEach(v => {
        sampleParams.push(v.barcode);
      });
      if (this.allValidate()) {
        SalesServiceApi.submitOrder({
          patientInfo: this.patientInfo,
          pAmount:
            this.payExtra.pAmount !== ""
              ? parseFloat(this.payExtra.pAmount)
              : null,
          doctor: this.doctor,
          payType: 0,
          creditor: this.addr.creditor,
          itemID: this.projectItem.id,
          oldSamples: this.sampleArr,
          payImages: this.payImages,
          splList: sampleParams
        }).then(res => {
          if (res.ret == 0) {
            this.successMsg = "预约成功";
            this.showSuccess = true;
            this.paymentURL = res.data.paymentURL;
            this.order.orderID = res.data.orderID;
            this.order.orderDate = res.data.orderDate;
            this.order.status = res.data.status;
            // clear cache
            auth.clearDetectionTmp();
          } else {
            this.errMsg = res.msg;
            this.show = true;
          }
        });
      }
    },
    handleSubmit() {
      let sampleParams = [];
      this.samples.forEach(v => {
        sampleParams.push(v.barcode);
      });
      if (this.allValidate()) {
        console.log("==========");
        SalesServiceApi.submitOrder({
          patientInfo: this.patientInfo,
          pAmount:
            this.payExtra.pAmount !== ""
              ? parseFloat(this.payExtra.pAmount)
              : null,
          doctor: this.doctor,
          payType:
            this.payExtra.payType !== ""
              ? this.payExtra.payType
              : this.addr.payType,
          creditor: this.addr.creditor,
          itemID: this.projectItem.id,
          oldSamples: this.sampleArr,
          payImages: this.payImages,
          splList: sampleParams
        }).then(res => {
          if (res.ret == 0) {
            this.successMsg = "预约成功";
            this.showSuccess = true;
            this.paymentURL = res.data.paymentURL;
            this.order.orderID = res.data.orderID;
            this.order.orderDate = res.data.orderDate;
            this.order.status = res.data.status;
            // clear cache
            auth.clearDetectionTmp();
          } else {
            this.errMsg = res.msg;
            this.show = true;
          }
        });
      }
    },
    onPaySuccess(res, file) {
      this.payUpload.images.push(res);
      console.log(res, file);
      this.payImages.push(res.id);
      console.log(this.payImages);
    },
    onSuccess(res, file) {
      // console.log(res, file);
      this.upload.images.push(res);
      // console.log(this.upload.images);
      // this.upload.images.forEach(v => {
      //   v.src = v.url;
      // });
      this.pathology = this.upload.images;
    },
    onError(e) {
      // console.log(e);
    },
    onPayError(e) {
      // console.log(e);
    },
    onRemove(index) {
      this.upload.images.splice(index, 1);
    },
    onPayRemove(index) {
      this.payUpload.images.splice(index, 1);
    },
    detailClick() {
      this.submitDetail = false;
      this.goto("/orderList");
    },
    allValidate() {
      if (this.validate(2)) {
        if (this.validate(1)) {
          if (this.validate(0)) {
            return true;
          } else {
            this.step = 0;
          }
        } else {
          this.step = 1;
        }
      } else {
        this.step = 2;
      }
      return false;
    },
    getName(value) {
      return value2name(value, ChinaAddressV4Data);
    },
    validate(step) {
      console.log(this.patientInfo, "====", this.addr.payType);
      let obs = [];
      let ignores = [];
      if (step == 0) {
        ignores = ["gender"];
        obs.push(this.patientInfo);
      } else if (step == 1) {
        obs.push(this.doctor);
        ignores = [];
      } else if (step == 2) {
        obs.push(this.addr);
        // ignores = [
        //   "receiver ",
        //   "receiverType ",
        //   "addr ",
        //   "detail ",
        //   "tel ",
        //   "creditor ",
        //   "barcode ",
        //   "comment "
        // ];
      }

      let bflag = false;
      // for (let i = 0; i < obs.length; i++) {
      //   const ob = obs[i];
      //   for (let key in ob) {
      //     if (!ob.hasOwnProperty(key)) {
      //       continue;
      //     }

      //     if (
      //       step == 2 &&
      //       key == "payType" &&
      //       ob[key] == 4 &&
      //       !this.addr.creditor
      //     ) {
      //       this.errMsg = "请选择授信人";
      //       this.show = true;
      //       bflag = true;
      //       break;
      //     }

      //     if (ignores.includes(key)) {
      //       console.log(key);
      //       continue;
      //     }

      //     let ele = this.$refs[key] || this.$refs[`${key}${this.sampleStep}`];
      //     let val = ele.value || ob[key];
      //     console.log(ele);
      //     if (
      //       (ele.hasOwnProperty("valid") && !ele.valid) ||
      //       (key == "diagnosis " && !val)
      //     ) {
      //       if (ele.hasOwnProperty("onBlur")) {
      //         ele.onBlur();
      //         this.errMsg = this.$t(`${key}`);
      //         this.show = true;
      //       }
      //       bflag = true;
      //       break;
      //     }
      //     if (!ele.hasOwnProperty("valid") && (!val || val.length == 0)) {
      //       this.errMsg = this.$t(`${key}`);
      //       this.show = true;
      //       bflag = true;
      //       break;
      //     }
      //   }
      //   if (bflag) {
      //     break;
      //   }
      // }
      if (bflag) {
        return false;
      }

      if (step == 0) {
        if (
          this.patientInfo.phoneNum === "" ||
          !/^1[3456789]\d{9}$/.test(this.patientInfo.phoneNum)
        ) {
          this.errMsg = "请填写11位手机号码";
          this.show = true;
          return;
        }
        if (this.patientInfo.name === "") {
          this.errMsg = "请填写姓名";
          this.show = true;
          return;
        }
        if (this.patientInfo.gender === "") {
          this.errMsg = "请选择性别";
          this.show = true;
          return;
        }
        if (this.patientInfo.age === "") {
          this.errMsg = "请输入年龄";
          this.show = true;
          return;
        }
        // if (this.pathology.length < 1) {
        //     this.errMsg = "请上传病理报告 ";
        //     this.show = true;
        //     return;
        // }
      }
      if (step == 1) {
        if (this.doctor.name === "") {
          this.errMsg = "请填写医生姓名";
          this.show = true;
          return;
        }
        if (this.doctor.department === "") {
          this.errMsg = "请填写科室";
          this.show = true;
          return;
        }
        if (this.doctor.hospital === "") {
          this.errMsg = "请填写医院";
          this.show = true;
          return;
        }
      }
      if (step == 2) {
        // console.log(this.samples,'samples')
        if (this.samples[0].barcode == '') {
          this.errMsg = "请填写样本条码";
          this.show = true;
          return;
        }
        if (this.addr.payType === undefined) {
          this.errMsg = "请选择支付方式";
          this.show = true;
          return;
        }
        if (this.addr.payType == 3) {
          if (this.addr.creditor === "") {
            this.errMsg = "请选择授信人";
            this.show = true;
            return;
          }
        }
        if (this.isOffline && !this.noPay) {
          if (this.payExtra.payType == "") {
            this.errMsg = "请选择线下支付工具";
            this.show = true;
            return;
          }
          if (this.payExtra.pAmount == "") {
            this.errMsg = "请输入实付金额";
            this.show = true;
            return;
          }
          if (this.payUpload.images.length == 0) {
            this.errMsg = "请选择支付凭证";
            this.show = true;
            return;
          }
        }
      }
      if (step == 2) {
        auth.cacheDetectionTmp(4, obs[0]);
      } else {
        auth.cacheDetectionTmp(step, obs[0]);
      }
      return true;
    },
    handleCheck() {
      this.$router.push("/orderList");
    },
    getProjectItem(id) {
      SalesServiceApi.getProjectItem(id, {}).then(res => {
        if (res.ret == 0) {
          this.projectItem.id = res.data.id;
          this.projectItem.amount = res.data.discountPrice;
          this.projectItem.name = res.data.itemName;
          this.loading = false;
        } else {
          this.goto("/projects");
        }
      });
    },
    goto(path) {
      this.$router.push({
        path: path
      });
    },
    setCacheDefault() {
      let tmp = {};
      for (let i = 0; i <= 4; i++) {
        tmp = auth.getDetectionTmp(i);
        if (!tmp) {
          continue;
        }
        if (i == 0) {
          this.patientInfo = tmp;
        } else if (i == 1) {
          this.doctor = tmp;
        } else if (i == 4) {
          this.addr = tmp;
        }
      }
    },
    wxConfig() {
      SalesServiceApi.getSign().then(res => {
        if (res.ret == 0) {
          this.$wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.appId, // 必填，公众号的唯一标识
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.noncestr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名
            jsApiList: ["scanQRCode "] // 必填，需要使用的JS接口列表
          });
        }
      });
      this.$wx.ready(function() {});

      this.$wx.error(function(res) {
        // console.log(res);
      });
    },
    wxscan() {
      this.$wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["barCode "], // 可以指定扫二维码还是一维码，默认二者都有 qrCode
        success: res => {
          // alert(res.resultStr)
          this.addr.barcode = res.resultStr;

          // var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
        }
      });
    },
    emailFocus() {
      let u = navigator.userAgent;
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
        let el = document.querySelector(".stepDiv1 ");
        el.classList.add("stepDiv1Pad ");
        this.keyboardScroll();
      }
    },
    emailBlur() {
      let el = document.querySelector(".stepDiv1 ");
      el.classList.remove("stepDiv1Pad ");
    },
    keyboardFocus() {
      let u = navigator.userAgent;
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
        let el = document.querySelector(".stepDiv5 ");
        el.classList.add("stepDiv5Pad ");
        this.keyboardScroll();
      }
    },
    keyboardBlur() {
      let el = document.querySelector(".stepDiv5 ");
      el.classList.remove("stepDiv5Pad ");
    },
    keyboardScroll() {
      let el = document.querySelector(".appDiv ");
      let h = el.scrollHeight;
      el.scrollTop = h;
    },
    textareaFocus(classname) {
      this.focusedTextarea = classname;
    },
    pagemove() {
      let el = document.querySelector(".appDiv ");
      el.addEventListener("touchmove ", () => {
        if (this.focusedTextarea) {
          let el1 = document.querySelector(
            `.${this.focusedTextarea} .weui-textarea`
          );
          el1.blur();
        }
      });
    }
    // initPayType() {
    //   let type = localStorage.getItem("offlineType");
    //   switch (type) {
    //     case "4":
    //       this.payExtra.payType = "微信支付";
    //       break;
    //     case "5":
    //       this.payExtra.payType = "支付宝";
    //       break;
    //     case "6":
    //       this.payExtra.payType = "拉卡拉";
    //       break;
    //     case "7":
    //       this.payExtra.payType = "柜员机转账";
    //       break;
    //   }
    //   console.log(this.payExtra.payType);
    // }
  },
  beforeDestroy: function() {
    this.clearInterval();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      //  这里的vm指的就是vue实例，可以用来当做this使用
      console.log(to);
      console.log(from);
      if (from.meta.type === "payType") {
        vm.step = 2;
        vm.isOffline = true;
      } else {
        vm.isOffline = false;
      }
    });
  },
  watch: {
    isOffline: {
      handler: function(v) {
        if (v) {
          let payRadio = document.querySelector("#test");
          // let  payRadio = this.$refs.payRadio
          let span = document.createElement("span");
          span.innerHTML = "*";
          span.style.color = "red";
          // payRadio.appendChild(span);
          console.log(payRadio, "2222222222", v);
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted: function() {
    let sexRadio = document.querySelector("#sexRadio .vux-label");
    let span = document.createElement("span");
    span.innerHTML = "*";
    span.style.color = "red";
    sexRadio.appendChild(span);
    // this.initPayType();
    let token = localStorage.getItem("BD_JWT_Token ");
    let role = localStorage.getItem("DETECT_SALES_ROLE ");
    // console.log(role);
    this.upload.headers = {
      Authorization: token,
      UserRole: role
    };
    auth.clearDetectionTmp();
    this.$nextTick(function() {
      // console.log(this.$route.params);
      let pid = this.$route.params.id;
      if (!pid) {
        this.goto("/projects ");
        return;
      }

      this.getProjectItem(pid);
      this.getCreditorOpts();
      // this.wxConfig()

      //设置默认值
      this.setCacheDefault();

      let u = navigator.userAgent;
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
        this.pagemove();
      }
    });
  }
};
</script>

<style scoped>
.tab-container {
  top: 43px;
  left: 0;
  right: 0;
  position: absolute;
  overflow: hidden;
  text-align: left;
  white-space: nowrap;
}

.tab-scrollable {
  padding-left: 15px;
  margin-top: 13px;
  overflow-y: hidden;
  overflow-x: auto;
}

.tab-scrollable::-webkit-scrollbar {
  display: none;
}

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

.stepDiv1 {
  padding-bottom: 200px;
}

.stepDiv1Pad {
  padding-bottom: 200px;
}

.stepDiv5Pad {
  padding-bottom: 200px;
}

.errTip {
  color: red;
}

.body {
  background-color: #f4f5fa;
  min-height: 100vh;
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
/* .viewport {
   top: 38%;
 } */

canvas {
  width: 250px;
  height: 250px;
  z-index: 999;
  /* border:0.3px solid #979797; */
}

video {
  width: 250px;
  height: 250px;
  z-index: 999;
}

.activeSample {
  background: #108ee9;
  color: #fff;
}
.required {
  color: red;
}
</style>
