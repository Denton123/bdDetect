<template>
  <div>
    <div v-if="loading">
      <div style="height:10vh;"></div>
      <p style="text-align:center;">
        <inline-loading></inline-loading>
      </p>
    </div>
    <div v-show="!loading" class="body bodyContent">
      <div v-show="!preview && !submitDetail">
        <div v-if="doScan">
          <masker :fullscreen="true" color="#000000" :opacity="0.95" style="z-index:99;">
            <div slot="content">
              <div style="padding: 101px 63px 0px 63px;">
                <input type="file" id="imageLoader" name="imageLoader" />
                <canvas id="imageCanvas"></canvas>
                <quagga-scanner
                  :onDetected="logIt"
                  :readerSize="readerSize"
                  :readerType="readerType"
                ></quagga-scanner>

                <!-- <v-quagga :onDetected="logIt" :readerTypes="['ean_reader']"></v-quagga> -->
              </div>
              <div style="padding-top:250px;">
                <div style="color:#D8D8D8;font-size:12px;">将条码放入框内，即可自动扫描</div>
                <div>
                  <a @click="stopScan" style="font-size:12px;line-height:24px;">停止扫描</a>
                </div>
              </div>
            </div>
          </masker>
        </div>
        <div>
          <toast v-model="show" type="text" width="5.4rem" :time="1200">{{ errMsg }}</toast>
          <toast v-model="show1" type="success" width="5.4rem" :time="1200">{{ successMsg }}</toast>

          <tab v-model="step" bar-active-color="#108EE9" active-color="#108EE9" :line-width="2">
            <tab-item @on-item-click="stepChange">患者信息</tab-item>
            <tab-item @on-item-click="stepChange" :disabled="step < 1">医生信息</tab-item>
            <tab-item @on-item-click="stepChange" :disabled="step < 2">专业诊断</tab-item>
            <tab-item @on-item-click="stepChange" :disabled="step < 3">样本信息</tab-item>
            <tab-item @on-item-click="stepChange" :disabled="step < 4">收货信息</tab-item>
          </tab>

          <div v-show="step == 0">
            <group title class="textleft">
              <x-input
                text-align="right"
                title="手机号码"
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
                required
              ></x-input>
              <x-input
                text-align="right"
                title="姓名"
                ref="name"
                v-model="patientInfo.name"
                placeholder="请填写姓名"
                :should-toast-error="false"
                :min="2"
                :max="16"
                required
              ></x-input>
              <popup-radio
                class="textleft"
                title="性别"
                ref="gender"
                :options="genderOpts"
                v-model="patientInfo.gender"
                placeholder="请选择性别"
                required
              ></popup-radio>

              <x-input
                text-align="right"
                title="年龄"
                ref="age"
                mask="999"
                :max="3"
                :min="1"
                @on-blur="ageSet"
                v-model="patientInfo.age"
                placeholder="请输入年龄"
                :should-toast-error="false"
                required
              >
                <template slot="right">
                  <div
                    v-if="patientInfo.age"
                    style="display:inline-block;float:left;padding-left:5px;"
                  >岁</div>
                </template>
              </x-input>
              <x-input
                text-align="right"
                title="身份证号码"
                ref="idCard"
                mask="99999999999999999S"
                :max="18"
                :min="18"
                v-model="patientInfo.idCard"
                placeholder="请输入身份证号码"
                :should-toast-error="false"
                required
              ></x-input>

              <x-address
                title="所在地"
                ref="location"
                :list="addressData"
                placeholder="请选择所在地区"
                v-model="patientInfo.location"
                required
              ></x-address>

              <x-input
                text-align="right"
                title="邮箱"
                ref="email"
                class="emailInput"
                @on-focus="emailFocus"
                v-model="patientInfo.email"
                placeholder="请输入邮箱地址"
                is-type="email"
                :should-toast-error="false"
                required
              ></x-input>
            </group>
            <div class="mt25">
              <box gap="0px 20px">
                <x-button
                  type="primary"
                  style="background-color:#1890FF!important;"
                  @click.native="nextStep"
                >下一步</x-button>
              </box>
            </div>
          </div>

          <div v-show="step == 1">
            <div>
              <div>
                <search
                  @on-change="filter"
                  :results="[]"
                  position="fixed"
                  v-model="doctorFilter"
                  @on-focus="doctorSearchFocus"
                  @on-cancel="doctorSearchCancel"
                  placeholder="按医院、科室、医生名搜索"
                  auto-scroll-to-top
                  top="46px"
                  ref="doctorID"
                >
                  <template slot="default">
                    <div class="doctorItems" v-show="!doctorItemClicked">
                      <div
                        :key="i"
                        v-for="(item, i) in filteredData"
                        style="padding-left:15px;overflow-y:auto;-webkit-overflow-scrolling:touch;"
                      >
                        <div
                          style="padding:17px 0px;text-align:left;border-bottom:1px solid #E5E5E5;"
                          @click="itemClick(item)"
                        >
                          <flexbox>
                            <flexbox-item>
                              <div
                                style="font-size:17px;text-align:left;line-height:25px;"
                              >{{item.name}}</div>
                            </flexbox-item>
                            <flexbox-item>
                              <div
                                v-if="doctor.doctorID == item.id"
                                style="text-align:right;padding-right:15px;"
                              >
                                <icon type="success-no-circle"></icon>
                              </div>
                            </flexbox-item>
                          </flexbox>

                          <div
                            style="margin-top:8px;font-size:13px;color:#999999"
                          >{{item.hospital}}， {{item.department}}， {{item.name}}</div>
                        </div>
                      </div>
                    </div>
                    <div v-show="doctorItemClicked">
                      <div
                        style="padding:17px 0px 17px 15px;text-align:left;border-bottom:1px solid #E5E5E5;"
                      >
                        <flexbox>
                          <flexbox-item>
                            <div
                              style="font-size:17px;text-align:left;line-height:25px;"
                            >{{doctor.name}}</div>
                          </flexbox-item>
                          <flexbox-item>
                            <div style="text-align:right;padding-right:15px;">
                              <icon type="success-no-circle"></icon>
                            </div>
                          </flexbox-item>
                        </flexbox>

                        <div
                          style="margin-top:8px;font-size:13px;color:#999999"
                        >{{doctor.hospital}}， {{doctor.department}}， {{doctor.name}}</div>
                      </div>
                    </div>
                  </template>
                </search>
              </div>

              <div
                v-if="doctorItemClicked"
                class="mt25"
                style="position:absolute;bottom:15px;width:100%;"
              >
                <box gap="0px 20px">
                  <x-button
                    type="primary"
                    style="background-color:#1890FF!important;"
                    @click.native="nextStep"
                  >下一步</x-button>
                </box>
              </div>
            </div>
          </div>

          <div v-show="step == 2">
            <group title class="textleft">
              <div v-transfer-dom>
                <popup v-model="diagnosisShow" height="60%" @on-hide="diagnosisInput">
                  <div>
                    <group>
                      <radio
                        v-model="diagnosisTmp"
                        fill-mode
                        fill-label="其他"
                        fill-placeholder="自定义输入"
                        :options="diagnosisOpts"
                        @on-change="diagnosisChange"
                      ></radio>
                    </group>
                  </div>
                </popup>
              </div>

              <x-input
                text-align="right"
                title="临床诊断"
                :readonly="true"
                :disabled="true"
                v-model="diagnose.diagnosis"
                ref="diagnosis"
                @click.native="diagnosisShow = true"
                placeholder-align="right"
                :should-toast-error="false"
                required
              >
                <template slot="right">
                  <span @click="diagnosisShow = true">
                    <b>
                      <x-icon type="ios-arrow-right" size="14" style="color:gray;line-height:21px;"></x-icon>
                    </b>
                  </span>
                </template>
              </x-input>
            </group>
            <group title="治疗史" class="textleft">
              <x-textarea
                :max="200"
                v-model="diagnose.history"
                placeholder="本次患病送检前治疗经历"
                :show-counter="false"
                ref="history"
              ></x-textarea>
            </group>
            <group title="疾病史" class="textleft">
              <x-textarea
                :max="200"
                v-model="diagnose.disease"
                placeholder="患本疾病前是否有其它病史"
                :show-counter="false"
                ref="disease"
              ></x-textarea>
            </group>
            <group title="家族史" class="textleft">
              <x-textarea
                :max="200"
                v-model="diagnose.family"
                placeholder="亲属中是否有患本类疾病者"
                :show-counter="false"
                ref="family"
              ></x-textarea>
            </group>
            <group title="病情描述" class="textleft">
              <x-textarea
                :max="500"
                :min="10"
                :rows="5"
                v-model="diagnose.descr"
                placeholder="请详细描述您的症状、疾病和身体状况，便于医生更准确的分析（10-500字），为保护您的隐私，请勿在咨询中透露您的真实姓名、手机号、微信号等信息"
                :show-counter="false"
                ref="descr"
                required
              ></x-textarea>
            </group>
            <group class="textleft">
              <template slot="title">
                <div style="margin:0.77rem 15px">
                  <div style="font-size:14px;">上传相关图片（检查报告、患处照片、药品等）</div>
                  <div style="color:#999999;">
                    <a @click="guideClick">如何正确拍摄清晰图片？查看指南></a>
                  </div>
                  <div style="margin-top:15px;">病情图片</div>
                </div>
              </template>
              <div style="margin-top: 15px">
                <vux-upload
                  url="/reception/api/sales/upload"
                  :headers="upload.headers"
                  :data="upload.data"
                  :images="upload.images"
                  :readonly="false"
                  :max="12"
                  :withCredentials="false"
                  :span="4"
                  :preview="true"
                  @success="onSuccess"
                  @error="onError"
                  @remove="onRemove"
                ></vux-upload>
              </div>
            </group>

            <div class="mt25 mb15">
              <box gap="0px 20px">
                <x-button
                  type="primary"
                  style="background-color:#1890FF!important;"
                  @click.native="nextStep"
                >下一步</x-button>
              </box>
            </div>
          </div>

          <div v-show="step == 3">
            <group title class="textleft">
              <popup-radio
                class="textleft"
                title="肿瘤标本类型"
                ref="tumorSliceType"
                :options="tumorSliceTypeOpts"
                v-model="sample.tumorSliceType"
                placeholder="请选择切片类型"
                required
              ></popup-radio>

              <x-input
                text-align="right"
                title="取材位置"
                ref="tumorSlicePosition"
                v-model="sample.tumorSlicePosition"
                placeholder="请输入切片取材位置"
                placeholder-align="right"
                :min="1"
                :max="16"
              ></x-input>

              <x-input
                text-align="right"
                title="标本病理编号"
                ref="no"
                v-model="sample.no"
                placeholder="请输入标本病理编号"
                placeholder-align="right"
                :min="1"
                :max="16"
              ></x-input>

              <x-input
                text-align="right"
                title="肿瘤细胞含量"
                ref="cellPercent"
                mask="99"
                :max="2"
                v-model="sample.cellPercent"
                placeholder="请输入肿瘤细胞含量"
                placeholder-align="right"
              >
                <template slot="right">
                  <div
                    v-if="sample.cellPercent"
                    style="display:inline-block;float:left;padding-left:1px;"
                  >
                    <b>%</b>
                  </div>
                </template>
              </x-input>

              <popup-radio
                class="textleft"
                title="正常对照样本"
                ref="compareSample"
                :options="compareSampleOpts"
                v-model="sample.compareSample"
                placeholder="请选择正常对照样本"
                required
              ></popup-radio>

              <x-input text-align="right" title="标本状态" value="正常" :readonly="true"></x-input>

              <datetime
                v-model="sample.simplingDate"
                title="采样日期"
                placeholder="请选择采样日期"
                ref="simplingDate"
              ></datetime>
            </group>
            <div class="mt25 mb15">
              <box gap="0px 20px">
                <x-button
                  type="primary"
                  style="background-color:#1890FF!important;"
                  @click.native="nextStep"
                >下一步</x-button>
              </box>
            </div>
          </div>

          <div v-show="step == 4">
            <group title class="textleft">
              <x-input
                text-align="right"
                title="收货人"
                ref="receiver"
                :max="16"
                :min="2"
                v-model="addr.receiver"
                placeholder="请填写收货人姓名"
                placeholder-align="right"
                :should-toast-error="false"
                required
              ></x-input>

              <x-address
                title="所在地"
                ref="addr"
                :list="addressData"
                placeholder="请选择所在地区"
                v-model="addr.addr"
                :should-toast-error="false"
                required
              ></x-address>

              <x-input
                text-align="right"
                title="详细地址"
                ref="detail"
                :max="120"
                :min="6"
                v-model="addr.detail"
                placeholder="请填写详细收货地址"
                placeholder-align="right"
                :should-toast-error="false"
                required
              ></x-input>
              <x-input
                text-align="right"
                title="联系电话"
                ref="tel"
                :max="16"
                :min="6"
                v-model="addr.tel"
                placeholder="请填写收货人联系电话"
                placeholder-align="right"
                :should-toast-error="false"
                required
              ></x-input>
            </group>
            <group title="备注" class="textleft">
              <x-textarea
                :max="200"
                v-model="addr.comment"
                placeholder="备注 选填"
                :show-counter="false"
                ref="comment"
              ></x-textarea>
            </group>
            <group>
              <x-input
                text-align="right"
                title="条形码"
                ref="barcode"
                class="barcodeInput"
                mask="9999999999"
                :max="10"
                :min="10"
                :show-clear="false"
                v-model="addr.barcode"
                placeholder-align="right"
                :should-toast-error="false"
                required
              >
                <!-- :max="10"
             :min="10"
                mask="9999999999"-->
                <template slot="right">
                  <div style="padding-left:8px;display:inline-block;" @click="wxscan">
                    <img style="width:23px;height:23px;" src="/img/scan.png" />
                  </div>
                </template>
              </x-input>
            </group>

            <div class="mt25">
              <box gap="0px 20px">
                <x-button
                  type="primary"
                  style="background-color:#1890FF!important;"
                  @click.native="handleSubmit"
                >提交</x-button>
              </box>
            </div>

            <div class="mt25">
              <box gap="0px 20px">
                <x-button
                  style="background-color:#FFFFFF!important;"
                  @click.native="previewDetection"
                >
                  <span style="color:black;">预览</span>
                </x-button>
              </box>
            </div>
          </div>
        </div>
      </div>
      <div v-if="preview">
        <OrderDetailComponent :data="detailData" :order="{detail: false}"></OrderDetailComponent>
        <div class="mt25 mb37">
          <box gap="0px 20px">
            <x-button
              type="primary"
              @click.native="preview=false"
              style="background-color:#1890FF!important;"
            >确认</x-button>
          </box>
        </div>
      </div>

      <div v-if="submitDetail">
        <OrderDetailComponent
          :data="detailData"
          :order="{detail: true, orderID: order.OrderID, orderDate: order.orderDate}"
        ></OrderDetailComponent>
        <div class="mt25 mb37">
          <box gap="0px 20px">
            <x-button
              type="primary"
              @click.native="detailClick"
              style="background-color:#1890FF!important;"
            >确认</x-button>
          </box>
        </div>
      </div>
    </div>
  </div>
</template>

<i18n>
  phoneNum:
    zh-CN: '请输入11位手机号码'
  gender:
    zh-CN: 请选择性别
  name:
    zh-CN: 请输入2-16位长度的姓名
  age:
    zh-CN: 请输入年龄
  idCard:
    zh-CN: 请输入18位身份证号码
  email:
    zh-CN: 请输入正确邮箱如：123551QQ@.com
  diagnosis:
    zh-CN: 请选择或输入临床诊断结果
  receiver:
    zh-CN: 请输入收货人信息
  detail:
    zh-CN: 请输入详细收货地址
  tel:
    zh-CN: 请输入收货人联系电话
  barcode:
    zh-CN: 请输入订单条码
  location:
    zh-CN: 请选择所在地区
  doctorID:
    zh-CN: 请选择主治医生
  history:
    zh-CN: 请输入治疗史信息
  family:
    zh-CN: 请输入家族史信息
  descr:
    zh-CN: 请填写（10-500字）病情信息
  addr:
    zh-CN: 请输入收货地址
  tumorSliceType:
    zh-CN: 请选择肿瘤标本类型
  compareSample:
    zh-CN: 请选择正常对照样本
</i18n>

<script>
import auth from "../../auth.js";

import Quagga from "quagga";
import { QuaggaScanner } from "vue-cc-quaggajs";

import OrderDetailComponent from "../../components/sales/OrderDetail";
import {
  InlineLoading,
  TransferDom,
  Popup,
  Radio,
  Group,
  Box,
  Masker,
  XButton,
  XInput,
  Toast,
  Tab,
  TabItem,
  PopupRadio,
  Search,
  Flexbox,
  FlexboxItem,
  Icon,
  XTextarea,
  Datetime,
  ChinaAddressV4Data,
  XAddress,
  Value2nameFilter as value2name
} from "vux";
import VuxUpload from "vux-upload";

import SalesService from "../../services/SalesService";
const SalesServiceApi = new SalesService();

export default {
  directives: {
    TransferDom
  },
  components: {
    InlineLoading,
    QuaggaScanner,
    OrderDetailComponent,
    Group,
    Radio,
    Popup,
    XButton,
    Box,
    XInput,
    Toast,
    Tab,
    TabItem,
    PopupRadio,
    // PopupPicker,
    Search,
    Flexbox,
    FlexboxItem,
    Icon,
    XTextarea,
    VuxUpload,
    Datetime,
    XAddress,
    Masker
  },
  data() {
    return {
      loading: true,
      readerSize: {
        width: 640,
        height: 480
      },
      readerType: ["ean_reader"],
      step: 0,
      disabled: false,
      doScan: false,
      preview: false,
      submitDetail: false,
      diagnosisShow: false,
      doctorFilter: "",
      doctorItemClicked: false,
      detailData: {},
      diagnosisTmp: "",
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
        idCard: "",
        location: [],
        email: ""
      },
      doctor: {
        doctorID: "",
        hospital: "",
        name: "",
        department: ""
      },
      diagnose: {
        diagnosis: "",
        history: "",
        disease: "",
        family: "",
        descr: "",
        images: []
      },
      sample: {
        tumorSliceType: "",
        tumorSlicePosition: "",
        no: "",
        cellPercent: "",
        compareSample: "",
        status: "1",
        simplingDate: ""
        // detectionDate: '',
        // reportDate: '',
      },
      addr: {
        receiver: "",
        addr: [],
        detail: "",
        tel: "",
        comment: "",
        barcode: ""
      },
      order: {
        orderID: "",
        orderDate: ""
      },
      // selected: '',
      data: [],
      filteredData: [],
      diagnosisOpts: [],
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
      compareSampleOpts: [],
      tumorSliceTypeOpts: [],
      sampleStatusOpts: [],
      addressData: ChinaAddressV4Data,
      upload: {
        headers: {},
        data: {
          id: 1
        },
        images: []
      },
      show: false,
      show1: false,
      errMsg: "",
      successMsg: ""
    };
  },
  watch: {
    step: function(newValue, oldValue) {
      // console.log("aaaaaa", newValue, oldValue);
      this.$store.commit("setDetectionStep", newValue);

      // let el = document.getElementById('appDiv')
      if (newValue == 1) {
        // el.classList.remove('ab-position')
        // el.classList.add('fixed-position')
        // console.log(9999, document.querySelector(".doctorItems"));
        this.touchBid(document.querySelector(".doctorItems"));
        // console.log(el)
      } else {
        // el.classList.add('ab-position')
        // el.classList.remove('fixed-position')
      }
    },
    doctorItemClicked: function(newValue, oldValue) {
      // console.log(oldValue, newValue);
      this.$store.commit("setDetectionStep2ItemClicked", newValue);
    }
  },
  methods: {
    stopScan() {
      Quagga.stop();
      this.doScan = false;
    },
    logIt(data) {
      // console.log(data);
      this.addr.barcode = data.codeResult.code;
      if (data.codeResult.code.length == 10) {
        this.addr.barcode = data.codeResult.code;
        this.doScan = false;
      } else {
        this.doScan = false;
        this.errMsg = `无效的条码${data.codeResult.code}`;
        this.show = true;
      }
    },
    diagnosisChange(value) {
      if (this.diagnosisOpts.includes(value)) {
        this.diagnosisShow = false;
        this.diagnose.diagnosis = value;
      }
    },
    diagnosisInput() {
      this.diagnose.diagnosis = this.diagnosisTmp;
    },
    diagnosisBlur() {
      // console.log("blur");
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
          if (res.ret == 0) {
            // set defualt value 只设置 step = 0 and step= 4
            this.patientInfo = res.data.patientInfo;
            this.addr = res.data.addr;
            this.addr.barcode = "";
            return true;
          } else {
            return false;
          }
        });
      }
    },
    // locationSet(value) {
    //   if (!value) {
    //     this.$refs.location.$el.classList.add('errTip')
    //   } else {
    //     this.$refs.location.$el.classList.remove('errTip')
    //   }
    // },
    // genderSet(value) {
    //   if (!value) {
    //     this.$refs.gender.$el.classList.add('errTip')
    //   } else {
    //     this.$refs.gender.$el.classList.remove('errTip')
    //   }
    //   console.log(this.$refs.gender)
    //
    //   console.log(value)
    // },
    guideClick() {
      this.goto("/guide");
    },
    stepChange(index) {
      // console.log(111111, index);
    },
    nextStep() {
      if (this.validate(this.step)) {
        this.step += 1;
      }
      //  else {
      //
      // }
    },
    previewDetection() {
      if (this.allValidate()) {
        this.detailData = {
          patientInfo: this.patientInfo,
          doctor: this.doctor,
          sample: this.sample,
          addr: this.addr,
          diagnose: this.diagnose,
          item: this.projectItem,
          opts: {
            compareSampleOpts: this.compareSampleOpts,
            tumorSliceTypeOpts: this.tumorSliceTypeOpts
          }
        };
        // console.log(this.doctor);
        this.preview = true;
      }
    },
    detailDetection() {
      this.detailData = {
        patientInfo: this.patientInfo,
        doctor: this.doctor,
        sample: this.sample,
        addr: this.addr,
        diagnose: this.diagnose,
        item: this.projectItem,
        opts: {
          compareSampleOpts: this.compareSampleOpts,
          tumorSliceTypeOpts: this.tumorSliceTypeOpts
        }
      };
      // console.log(this.detailData);
      this.submitDetail = true;
    },
    handleSubmit() {
      if (this.allValidate()) {
        SalesServiceApi.submitOrder({
          patientInfo: this.patientInfo,
          doctor: this.doctor,
          sample: this.sample,
          addr: this.addr,
          diagnose: this.diagnose,
          itemID: this.projectItem.id
        }).then(res => {
          if (res.ret == 0) {
            this.successMsg = "操作成功";
            this.show1 = true;
            this.order.orderID = res.data.orderID;
            this.order.orderDate = res.data.orderDate;
            // clear cache
            auth.clearDetectionTmp();
            this.detailDetection();
          } else {
            this.errMsg = res.msg;
            this.show = true;
          }
        });
      }
    },
    doctorSearchFocus() {
      this.doctorItemClicked = false;
    },
    doctorSearchCancel() {
      // console.log(this.$refs.doctorID);
      this.$refs.doctorID.onFocus();
      this.doctorItemClicked = true;
    },
    detailClick() {
      this.submitDetail = false;
      this.goto("/sales/");
    },
    allValidate() {
      // console.log("all");
      if (this.validate(4)) {
        if (this.validate(3)) {
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
        } else {
          this.step = 3;
        }
      } else {
        // console.log("aaa");
        this.step = 4;
      }
      return false;
    },
    getName(value) {
      return value2name(value, ChinaAddressV4Data);
    },
    onSuccess(res) {
      this.upload.images.push(res);
      // console.log()
      this.diagnose.images = this.upload.images;
    },
    onError(e) {
      // console.log(8888, e.message);
    },
    onRemove(index) {
      this.upload.images.splice(index, 1);
    },
    validate(step) {
      let obs = {};
      let ignores = [];
      if (step == 0) {
        obs = this.patientInfo;
      } else if (step == 1) {
        obs = this.doctor;
        ignores = ["name", "department", "hospital"];
      } else if (step == 2) {
        obs = this.diagnose;
        ignores = ["images", "history", "disease", "family"];
      } else if (step == 3) {
        obs = this.sample;
        ignores = [
          "simplingDate",
          "tumorSlicePosition",
          "no",
          "cellPercent",
          "status"
        ];
      } else if (step == 4) {
        obs = this.addr;
        ignores = ["comment"];
      }

      for (let key in obs) {
        if (!obs.hasOwnProperty(key)) {
          continue;
        }
        if (ignores.includes(key)) {
          continue;
        }
        let ele = this.$refs[key];
        // ele.$el.classList.remove('errTip')
        let val = ele.value || obs[key];
        if (ele.hasOwnProperty("valid") && !ele.valid) {
          if (ele.hasOwnProperty("onBlur")) {
            // ele.$el.classList.add('errTip')
            this.$refs[key].onBlur();
            this.errMsg = this.$t(`${key}`);
            this.show = true;
          }
          return false;
        }
        if (!ele.hasOwnProperty("valid") && (!val || val.length == 0)) {
          // ele.$el.classList.add('errTip')
          this.errMsg = this.$t(`${key}`);
          this.show = true;
          return false;
        }
      }
      auth.cacheDetectionTmp(step, obs);
      return true;
    },
    itemClick(item) {
      // console.log(this.$refs.doctorID);
      this.doctor.doctorID = `${item.id}`;
      this.doctor.name = item.name;
      this.doctor.hospital = item.hospital;
      this.doctor.department = item.department;
      this.doctorItemClicked = true;
    },
    filter(val) {
      // console.log(val);
      if (!val) {
        this.filteredData = this.data;
      } else {
        let tmp = [];
        this.data.forEach(item => {
          let str = item.name + item.hospital + item.department;
          if (str.includes(val)) {
            tmp.push(item);
          }
        });
        this.filteredData = tmp;
        // console.log(tmp);
      }
    },
    getOpts() {
      SalesServiceApi.getOpts({}).then(res => {
        if (res.ret == 0) {
          this.data = res.data.doctorOpts;
          this.filteredData = this.data;
          this.tumorSliceTypeOpts = res.data.tumorSliceTypeOpts;
          this.compareSampleOpts = res.data.compareSampleOpts;
          this.diagnosisOpts = res.data.diagnosisOpts;
          this.loading = false;
        } else {
          this.errMsg = res.msg;
          this.show = true;
        }
      });
    },
    getProjectItem(id) {
      SalesServiceApi.getProjectItem(id, {}).then(res => {
        if (res.ret == 0) {
          this.projectItem.id = id;
          this.projectItem.amount = res.data.discountPrice;
          this.projectItem.name = res.data.itemName;
        } else {
          this.goto("/projects");
        }
      });
    },
    goto(path) {
      this.$router.push({ path: path });
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
          this.$refs.doctorID.onFocus();
          if (this.doctor.doctorID) {
            this.doctorItemClicked = true;
          }
        } else if (i == 2) {
          this.diagnose = tmp;
        } else if (i == 3) {
          this.sample = tmp;
        } else if (i == 4) {
          this.addr = tmp;
        }
      }
    },
    wxConfig() {
      this.$wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: "", // 必填，公众号的唯一标识
        timestamp: "", // 必填，生成签名的时间戳
        nonceStr: "", // 必填，生成签名的随机串
        signature: "", // 必填，签名
        jsApiList: ["scanQRCode"] // 必填，需要使用的JS接口列表
      });

      this.$wx.ready(function() {});

      // this.$wx.error(function(res){})
    },
    wxscan() {
      this.$wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function(res) {
          // console.log(res);
          // var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
        }
      });
    },
    emailFocus() {
      this.keyboardScroll("emailInput");
    },
    barcodeFocus() {
      this.keyboardScroll("barcodeInput");
    },
    keyboardScroll(classname) {
      let u = navigator.userAgent;
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
        let el = document.querySelector(`.${classname}`);
        // console.log(el)
        let h = document.querySelector(".bodyContent").scrollHeight;
        el.addEventListener("focus", () => {
          window.setTimeout(window.scrollTo(0, h), 500);
        });
      }
    },
    touchBid(el) {
      let startY, endY;
      //记录手指触摸的起点坐标
      // console.log(111, el);
      el.addEventListener(
        "touchstart",
        e => {
          startY = e.touches[0].pageY;
        },
        { passive: false }
      );

      let el2 = document.querySelector("#appDiv");

      el.addEventListener(
        "touchmove",
        e => {
          endY = e.touches[0].pageY; //记录手指触摸的移动中的坐标

          if (endY > startY && (el.scrollTop <= 0 || el2.scrollTop <= 0)) {
            e.preventDefault();
          }

          if (
            endY < startY &&
            el.scrollTop + window.innerHeight + 120 >= el.scrollHeight
          ) {
            // console.log("stop up scroll");
            e.preventDefault();
          }
        },
        { passive: false }
      );

      el2.addEventListener(
        "touchmove",
        e => {
          endY = e.touches[0].pageY; //记录手指触摸的移动中的坐标

          if (endY > startY && (el.scrollTop <= 0 || el2.scrollTop <= 0)) {
            e.preventDefault();
          }

          if (
            endY < startY &&
            el.scrollTop + window.innerHeight + 120 >= el.scrollHeight
          ) {
            // console.log("stop up scroll");
            e.preventDefault();
          }
        },
        { passive: false }
      );
    }
  },

  mounted: function() {
    this.upload.headers = {
      UserRole: "BDLS_DAS_SALES"
    };
    // auth.clearDetectionTmp()
    let pid = this.$route.params.id;
    if (!pid) {
      this.goto("/projects");
      return;
    }

    this.getOpts();
    this.getProjectItem(pid);
    // this.wxConfig()

    //设置默认值
    this.setCacheDefault();
  }
};
</script>


<style scoped>
.errTip {
  color: red;
}

.body {
  background-color: #f4f5fa;
  overflow: auto;
  min-height: 100vh;
}

.content {
  width: 100%;
}

.mt25 {
  margin-top: 25px;
}

.mb37 {
  margin-bottom: 37px;
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
/*
.search-cancel-font-color {
  color:red;
} */
</style>

<style>
/*
@media screen and (-webkit-min-device-pixel-ratio:0) {
  select,
  textarea,
  #search_input_rvhgs {
    font-size: 16px;
  }
}

@media screen and (-webkit-min-device-pixel-ratio:0) {

  #search_input_rvhgs:focus {
    font-size: 16px;
    background: #eee;
  }
}

input[type='search'],
#search_input_rvhgs  {
font-size: 16px;
}

input[type="text"] {
  font-size: inherit;
} */

/*
  .weui-cell__ft::after {
    content: "";
  } */

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
  /* color: red; */
}

.weui-cell__ft > .vux-cell-value {
  color: #585858;
}

.vux-popup-picker-select > .vux-cell-value {
  color: #585858;
}

.vux-popup-dialog > div {
  margin-bottom: 12px;
}

.weui-cell__bd > .needsclick {
  /* z-index:999; */
  /* border:1px solid red; */
  height: 40px;
}

.vux-tab-container {
  position: fixed;
  top: 0px;
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

/* .viewport {
   top: 38%;
 } */

canvas {
  /* position: fixed; */
  /* top:100px; */
  width: 250px;
  height: 250px;
  z-index: 999;
  /* border:0.3px solid #979797; */
}

video {
  /* position: fixed; */
  /* top:100px; */

  width: 250px;
  height: 250px;
  z-index: 999;
}
</style>
