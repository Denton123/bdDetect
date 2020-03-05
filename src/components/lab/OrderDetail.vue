<style>
.col-bg {
  background-color: white;
  padding: 20px 16px;
}
.ant-form-item {
  margin-bottom: 0px;
}
</style>
<template>
  <div style="max-width:1200px;margin:0 auto;">
    <div v-if="step == 1">
      <a-row class="text-left" :gutter="16" style="margin-bottom:16px;">
        <a-col :span="24" class="col-bg">
          <div style="margin-left: 16px;">
            是否支付：
            <a-radio-group buttonStyle="solid" v-model="confirmPayment" style="margin-right:14px;">
              <a-radio-button
                :value="1"
                :disabled="orderInfo.order.status != 1 && confirmPayment != 1"
                style="width:46px;text-align:center;"
              >是</a-radio-button>
              <a-radio-button
                :value="2"
                :disabled="orderInfo.order.status != 1 && confirmPayment != 2"
                style="width:46px;text-align:center;"
              >否</a-radio-button>
            </a-radio-group>是否确认基本信息：
            <a-radio-group buttonStyle="solid" v-model="confirmBase" style="margin-right:14px;">
              <a-radio-button
                :value="1"
                :disabled="orderInfo.order.status != 1 && confirmBase != 1"
                style="width:46px;text-align:center;"
              >是</a-radio-button>
              <a-radio-button
                :value="2"
                :disabled="orderInfo.order.status != 1 && confirmBase != 2"
                style="width:46px;text-align:center;"
              >否</a-radio-button>
            </a-radio-group>

            <a-button
              style="margin-right:13px;"
              type="primary"
              :disabled="orderInfo.order.status != 1"
              @click="doConfirm(1)"
            >提交</a-button>

            <a-button @click="backto">返回</a-button>
          </div>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :lg="{span: 12}" class="col-bg">
          <h3 style="text-align:left;padding-left:16px;">患者信息</h3>
          <a-row>
            <a-col :lg="5" class="marginb20 text-right">手机号码:</a-col>
            <a-col :lg="{span:17, offset:1}" class="text-left">{{orderInfo.patientInfo.phoneNum}}</a-col>
          </a-row>
          <a-row>
            <a-col :lg="5" class="marginb20 text-right">姓名:</a-col>
            <a-col :lg="{span:17, offset:1}" class="text-left">{{orderInfo.patientInfo.name}}</a-col>
          </a-row>
          <a-row>
            <a-col :lg="5" class="marginb20 text-right">性别:</a-col>
            <a-col :lg="{span:17, offset:1}" class="text-left">
              <span v-if="orderInfo.patientInfo.gender == 1">男</span>
              <span v-if="orderInfo.patientInfo.gender == 2">女</span>
            </a-col>
          </a-row>
          <a-row>
            <a-col :lg="5" class="marginb20 text-right">年龄:</a-col>
            <a-col :lg="{span:17, offset:1}" class="text-left">{{orderInfo.patientInfo.age}} 岁</a-col>
          </a-row>
          <a-row>
            <a-col :lg="5" class="marginb20 text-right">身份证号:</a-col>
            <a-col :lg="{span:17, offset:1}" class="text-left">{{orderInfo.patientInfo.idCard}}</a-col>
          </a-row>
          <a-form :hideRequiredMark="true" :form="form1">
            <a-form-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              class="textleft"
              :colon="false"
              label="所在地区:"
            >
              <a-cascader
                :options="areas"
                style="width: 80%;"
                size="small"
                :disabled="true"
                v-decorator="[
                'location',
                { initialValue: orderInfo.patientInfo.location, rules: [{ required: true, type: 'array', length: 3, message: '选择所在地区!' }] }
              ]"
              />
            </a-form-item>
          </a-form>
          <a-row>
            <a-col :lg="5" class="marginb20 text-right">病理报告:</a-col>
            <a-col :lg="{span:17, offset:1}" class="text-left">
              <LabUploadComponent
                :data="{id: orderInfo.order.orderID, title: '', action: '', showPreviewIcon:true, showRemoveIcon:false}"
                :files="orderInfo.pathology || orderInfo.pathology.images"
              ></LabUploadComponent>
            </a-col>

            <!-- <a-col :lg="{span:17, offset:1}" class="text-left">
              <div class="clearfix" style="margin-top:24px;">
              <a-upload
                listType="picture-card"
                :defaultFileList="orderInfo.pathology || orderInfo.pathology.images"
                @preview="handlePreview"
                :showUploadList="{showPreviewIcon:true, showRemoveIcon:false}"
              >
              </a-upload>              
              <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                <img style="width: 100%" :src="previewImage" />
              </a-modal>
            </div>
            </a-col>-->
          </a-row>

          <h3 style="text-align:left;padding-left:16px;margin-top:24px;">报告接收信息</h3>
          <a-row>
            <a-col :lg="5" class="marginb20 text-right">收货人:</a-col>
            <a-col :lg="{span:17, offset:1}" class="text-left">
              {{orderInfo.addr.receiver}}
              <span
                v-if="orderInfo.addr.receiver"
                style="margin-left: 6px; color: rgb(21, 133, 255)"
              >{{orderInfo.addr.receiverType == 1 ? '本人' : '家属'}}</span>
            </a-col>
          </a-row>

          <a-form :hideRequiredMark="true" :form="form3">
            <a-form-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              class="textleft"
              label="所在地区"
            >
              <a-cascader
                :options="areas"
                style="width: 80%;"
                size="small"
                :disabled="true"
                v-decorator="[
                'addr',
                { initialValue: orderInfo.addr.addr, rules: [{ required: true, type: 'array', length: 3, message: '选择所在地区!' }] }
              ]"
              />
            </a-form-item>
          </a-form>
          <a-row>
            <a-col :lg="5" class="marginb20 text-right">详情地址:</a-col>
            <a-col :lg="{span:17, offset:1}" class="text-left">{{orderInfo.addr.detail}}</a-col>
          </a-row>
          <a-row>
            <a-col :lg="5" class="marginb20 text-right">地址备注:</a-col>
            <a-col :lg="{span:17, offset:1}" class="text-left">{{orderInfo.addr.comment}}</a-col>
          </a-row>
          <a-row>
            <a-col :lg="5" class="marginb20 text-right">联系人电话:</a-col>
            <a-col :lg="{span:17, offset:1}" class="text-left">{{orderInfo.addr.tel}}</a-col>
          </a-row>
          <a-row>
            <a-col :lg="5" class="marginb20 text-right">订单号:</a-col>
            <a-col :lg="{span:17, offset:1}" class="text-left">{{orderInfo.order.orderID}}</a-col>
          </a-row>
          <a-row>
            <a-col :lg="5" class="marginb20 text-right">订单状态:</a-col>
            <a-col :lg="{span:17, offset:1}" class="text-left">{{orderStatusText}}</a-col>
          </a-row>
          <a-row>
            <a-col :lg="5" class="marginb20 text-right">支付方式:</a-col>
            <a-col
              :lg="{span:17, offset:1}"
              class="text-left"
            >{{payTypeText(orderInfo.pay.payType)}}</a-col>
          </a-row>
          <a-row>
            <a-col :lg="5" class="marginb20 text-right">是否退款:</a-col>
            <a-col
              :lg="{span:17, offset:1}"
              class="text-left"
            >{{orderInfo.pay.isRefund == 1 ? '是' : '否'}}</a-col>
          </a-row>
          <a-row v-if="orderInfo.pay.isRefund == 1">
            <a-col :lg="5" class="marginb20 text-right">取消原因:</a-col>
            <a-col :lg="{span:17, offset:1}" class="text-left">{{orderInfo.pay.reason}}</a-col>
          </a-row>

          <a-row>
            <a-col :lg="5" class="marginb20 text-right">下单时间:</a-col>
            <a-col :lg="{span:17, offset:1}" class="text-left">{{orderInfo.order.orderDate}}</a-col>
          </a-row>

          <a-row>
            <a-col :lg="5" class="marginb20 text-right">送检时间:</a-col>
            <a-col :lg="{span:17, offset:1}" class="text-left">{{orderInfo.order.detectionDate}}</a-col>
          </a-row>

          <a-row>
            <a-col :lg="5" class="marginb20 text-right">业务员:</a-col>
            <a-col :lg="{span:17, offset:1}" class="text-left">{{orderInfo.addr.salesman}}</a-col>
          </a-row>

          <a-row>
            <a-col :lg="5" class="marginb20 text-right">业务员联系方式:</a-col>
            <a-col :lg="{span:17, offset:1}" class="text-left">{{orderInfo.addr.salemanContact}}</a-col>
          </a-row>
        </a-col>
        <a-col :lg="{span: 11, offset:1}" class="col-bg">
          <h3 style="text-align:left;padding-left:16px;">医生信息</h3>
          <a-row>
            <a-col :lg="5" class="marginb20 text-right">主治医生:</a-col>
            <a-col :lg="{span:17, offset:1}" class="text-left">{{orderInfo.doctor.name}}</a-col>
          </a-row>
          <a-row>
            <a-col :lg="5" class="marginb20 text-right">医院:</a-col>
            <a-col :lg="{span:17, offset:1}" class="text-left">{{orderInfo.doctor.hospital}}</a-col>
          </a-row>
          <a-row>
            <a-col :lg="5" class="marginb20 text-right">科室:</a-col>
            <a-col :lg="{span:17, offset:1}" class="text-left">{{orderInfo.doctor.department}}</a-col>
          </a-row>
          <a-row>
            <a-col :lg="5" class="marginb20 text-right">医生联系方式:</a-col>
            <a-col :lg="{span:17, offset:1}" class="text-left">{{orderInfo.doctor.telNum}}</a-col>
          </a-row>

          <h3 style="text-align:left;padding-left:16px;margin-top:16px;">专业诊断</h3>
          <a-row>
            <a-col :lg="5" class="marginb20 text-right">临床诊断:</a-col>
            <a-col :lg="{span:17, offset:1}" class="text-left">{{orderInfo.diagnose.diagnosis}}</a-col>
          </a-row>
          <a-form :hideRequiredMark="true" :form="form2">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="治疗史">
              <a-input
                type="textarea"
                :rows="2"
                :readOnly="true"
                v-decorator="[
                    'history',
                    {
                      initialValue: orderInfo.diagnose.history,
                    }
                  ]"
              ></a-input>
            </a-form-item>

            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="疾病史">
              <a-input
                type="textarea"
                :rows="2"
                :readOnly="true"
                v-decorator="[
                    'disease',
                    {
                      initialValue: orderInfo.diagnose.disease,
                    }
                  ]"
              ></a-input>
            </a-form-item>

            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="家族史  ">
              <a-input
                type="textarea"
                :rows="2"
                :readOnly="true"
                v-decorator="[
                    'family',
                    {
                      initialValue: orderInfo.diagnose.family,
                      rules: [{ required: true, type: 'string', min:10, max:500 }]
                    }
                  ]"
              ></a-input>
            </a-form-item>

            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="专业诊断  ">
              <a-input
                type="textarea"
                :rows="2"
                :readOnly="true"
                v-decorator="[
                    'descr',
                    {
                      initialValue: orderInfo.diagnose.descr,
                    }
                  ]"
              ></a-input>
            </a-form-item>
            <a-row>
              <a-col
                :lg="24"
                class="text-left"
                style="margin: 14px auto;font-size:12px;padding-left:16px;"
              >相关图片（检查报告、患照片、药品等）</a-col>
            </a-row>
            <div class="clearfix" style="margin-left:14px;">
              <LabUploadComponent
                :data="{id: orderInfo.order.orderID, title: '', action: '', showPreviewIcon:true, showRemoveIcon:false}"
                :files="orderInfo.diagnose.images"
              ></LabUploadComponent>

              <!-- <a-upload
                    listType="picture-card"
                    :defaultFileList="orderInfo.diagnose.images"
                    @preview="handlePreview"
                    :showUploadList="{showPreviewIcon:true, showRemoveIcon:false}"
                  >
                  </a-upload>

                  <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                    <img style="width: 100%" :src="previewImage" />
              </a-modal>-->
            </div>
          </a-form>
        </a-col>
      </a-row>
    </div>

    <div v-if="step == 2">
      <a-row class="row-bg" :gutter="16">
        <a-col :lg="{span: 12}" class="col-bg">
          <div class="text-left" style="padding-left: 16px;line-height:28px;">
            检测服务:
            <span style="margin-left:10px;">{{orderInfo.item.name}}</span>
          </div>
          <div style="text-align:left;padding-left: 16px;">
            <div style="display:inline-block;">患者样本：</div>
            <div
              v-for="index in orderInfo.samples.length"
              :key="index"
              style="margin-right:26px;min-width:51px;display:inline-block;"
              @click="sampleStep = index - 1"
            >
              <div
                v-if="sampleStep == index - 1"
                style="background-color:#1890FF;padding: 2px 7px;border-radius:4px;"
              >
                <span
                  style="color:white;font-size:14px;cursor:pointer;"
                >样本{{index}}{{ orderInfo.samples[index-1]['sampleAccept'] == 2 ? '-已拒收' : ''}}</span>
              </div>
              <div v-else style="vertical-align: middle;cursor:pointer;">
                <span
                  style="color:#A9A9A9;opacity:1;"
                >样本{{index}}{{ orderInfo.samples[index-1]['sampleAccept'] == 2 ? '-已拒收' : ''}}</span>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :lg="{span:11, offset: 1}" class="col-bg text-left">
          是否确认样本信息：
          <a-radio-group buttonStyle="solid" v-model="confirmSample">
            <a-radio-button
              :value="1"
              :disabled="(orderInfo.order.status != 1 && confirmSample != 1)|| orderInfo.order.payStatus == 4 || orderInfo.order.payStatus == 3"
              style="width:46px;text-align:center;"
            >是</a-radio-button>
            <a-radio-button
              :value="2"
              :disabled="(orderInfo.order.status != 1 && confirmSample != 2 )|| orderInfo.order.payStatus == 4 || orderInfo.order.payStatus == 3"
              style="width:46px;text-align:center;"
            >否</a-radio-button>
          </a-radio-group>
          <a-button
            style="margin-left:13px;"
            type="primary"
            :disabled="orderInfo.order.status == 3 || orderInfo.order.payStatus == 3 || orderInfo.order.payStatus == 4"
            @click="reSampling(orderInfo.order.orderID)"
          >重新采样</a-button>
          <a-button
            type="primary"
            :disabled="orderInfo.order.status != 1 || orderInfo.order.payStatus == 3 || orderInfo.order.payStatus == 4"
            @click="doConfirm(2)"
          >提交</a-button>

          <a-button @click="backto">返回</a-button>
        </a-col>
      </a-row>
      <a-row class="row-bg" :gutter="16" style="margin-top: 16px;">
        <a-col :lg="{span: 12}" class="col-bg">
          <h3 style="text-align:left;padding-left:16px;">包裹信息</h3>
          <div v-for="key in orderInfo.samples.length" :key="key" v-show="sampleStep == key - 1">
            <a-row>
              <a-col :lg="5" class="marginb20 text-right">快递单号:</a-col>
              <a-col
                :lg="{span:17, offset:1}"
                class="text-left"
              >{{orderInfo.packages[sampleStep]['no']}}</a-col>
            </a-row>
            <a-row>
              <a-col :lg="5" class="marginb20 text-right">快递公司:</a-col>
              <a-col
                :lg="{span:17, offset:1}"
                class="text-left"
              >{{orderInfo.packages[sampleStep]['company']}}</a-col>
            </a-row>
            <a-row>
              <a-col :lg="5" class="marginb20 text-right">运输条件:</a-col>
              <a-col
                :lg="{span:17, offset:1}"
                class="text-left"
              >{{orderInfo.packages[sampleStep]['condition']}}</a-col>
            </a-row>
            <a-row>
              <a-col :lg="5" class="marginb20 text-right">是否合格:</a-col>
              <a-col
                :lg="{span:17, offset:1}"
                class="text-left"
              >{{orderInfo.packages[sampleStep]['valid'] == 1 ? '合格' : '不合格'}}</a-col>
            </a-row>
            <a-row v-if="orderInfo.packages[sampleStep]['valid'] == 0">
              <a-col :lg="5" class="marginb20 text-right">快递公司:</a-col>
              <a-col
                :lg="{span:17, offset:1}"
                class="text-left"
              >{{orderInfo.packages[sampleStep]['reason']}}</a-col>
            </a-row>

            <h3 style="text-align:left;padding-left:16px;">拆包</h3>
            <a-row>
              <a-col :lg="5" class="marginb20 text-right">验收日期:</a-col>
              <a-col
                :lg="{span:17, offset:1}"
                class="text-left"
              >{{orderInfo.packages[sampleStep]['acceptacnceDate']}}</a-col>
            </a-row>
            <a-row>
              <a-col :lg="5" class="marginb20 text-right">验收人:</a-col>
              <a-col
                :lg="{span:17, offset:1}"
                class="text-left"
              >{{orderInfo.packages[sampleStep]['acceptor']}}</a-col>
            </a-row>
            <a-row>
              <a-col :lg="5" class="marginb20 text-right">复核人:</a-col>
              <a-col
                :lg="{span:17, offset:1}"
                class="text-left"
              >{{orderInfo.packages[sampleStep]['validator']}}</a-col>
            </a-row>
          </div>
          <div style="margin-left: 16px;margin-top:16px;">
            <LabUploadComponent
              :data="{id: orderInfo.order.orderID, title: '病理报告', isRequired: false, action: '', showPreviewIcon:true, showRemoveIcon:false}"
              :files="orderInfo.pathology || orderInfo.pathology.images"
            ></LabUploadComponent>
          </div>
        </a-col>

        <a-col :lg="{span: 11, offset:1}" class="col-bg">
          <h3 style="text-align:left;padding-left:16px;">样本信息</h3>
          <div v-for="key in orderInfo.samples.length" :key="key" v-show="sampleStep == key - 1">
            <a-row>
              <a-col :lg="5" class="marginb20 text-right">样本条码:</a-col>
              <a-col
                :lg="{span:17, offset:1}"
                class="text-left"
              >{{ orderInfo.samples[sampleStep]['barcode'] }}</a-col>
            </a-row>

            <a-row>
              <a-col :lg="5" class="marginb20 text-right">样本类型:</a-col>
              <a-col :lg="{span:17, offset:1}" class="text-left">{{ tumorSliceTypeText }}</a-col>
            </a-row>

            <a-row>
              <a-col :lg="5" class="marginb20 text-right">样本数量:</a-col>
              <a-col
                :lg="{span:17, offset:1}"
                class="text-left"
              >{{ orderInfo.samples[sampleStep]['num'] }} {{sliceTypeUnit}}</a-col>
            </a-row>

            <a-row>
              <a-col :lg="5" class="marginb20 text-right">取材位置:</a-col>
              <a-col
                :lg="{span:17, offset:1}"
                class="text-left"
              >{{orderInfo.samples[sampleStep]['tumorSlicePosition']}}</a-col>
            </a-row>

            <a-row>
              <a-col :lg="5" class="marginb20 text-right">样本病理编号:</a-col>
              <a-col
                :lg="{span:17, offset:1}"
                class="text-left"
              >{{orderInfo.samples[sampleStep]['no'] }}</a-col>
            </a-row>

            <a-row>
              <a-col :lg="5" class="marginb20 text-right">肿瘤细胞含量:</a-col>
              <a-col
                :lg="{span:17, offset:1}"
                class="text-left"
              >{{orderInfo.samples[sampleStep]['cellPercent'] ? orderInfo.samples[sampleStep]['cellPercent'] + '%' : ''}}</a-col>
            </a-row>

            <a-row>
              <a-col :lg="5" class="marginb20 text-right">正常对照样本:</a-col>
              <a-col :lg="{span:17, offset:1}" class="text-left">{{compareSampleText}}</a-col>
            </a-row>

            <a-row>
              <a-col :lg="5" class="marginb20 text-right">样本状态:</a-col>
              <a-col :lg="{span:17, offset:1}" class="text-left">{{sampleStatusText}}</a-col>
            </a-row>

            <a-row v-if="orderInfo.samples[sampleStep]['sampleStatus'] == 0">
              <a-col :lg="5" class="marginb20 text-right">异常情况描述:</a-col>
              <a-col
                :lg="{span:17, offset:1}"
                class="text-left"
              >{{orderInfo.samples[sampleStep]['reason']}}</a-col>
            </a-row>
            <a-row>
              <a-col :lg="5" class="marginb20 text-right">接收状态:</a-col>
              <a-col :lg="{span:17, offset:1}" class="text-left">{{sampleAcceptText}}</a-col>
            </a-row>
            <a-row>
              <a-col :lg="5" class="marginb20 text-right">采样日期:</a-col>
              <a-col
                :lg="{span:17, offset:1}"
                class="text-left"
              >{{orderInfo.samples[sampleStep]['simplingDate']}}</a-col>
            </a-row>

            <a-form :hideRequiredMark="true" :form="form4">
              <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="样本备注">
                <a-input
                  type="textarea"
                  :rows="2"
                  :readOnly="true"
                  v-decorator="[
                      'sRemark',
                      {
                        initialValue: orderInfo.samples[sampleStep]['sRemark'],
                      }
                    ]"
                ></a-input>
              </a-form-item>
            </a-form>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import areas from "../../utils/areas.json";
import LabUploadComponent from "./Upload.vue";
import LabService from "../../services/LabService";
const LabServiceApi = new LabService();

export default {
  components: {
    LabUploadComponent
  },
  name: "OrderDetailComponent",
  props: ["orderInfo", "defaultStep"],
  data() {
    return {
      confirmSample: "",
      confirmBase: "",
      confirmPayment: "",
      areas: areas,
      sliceTypeUnit: "",
      step: 1,
      sampleStep: 0,
      labelCol: {
        lg: { span: 5 }
      },
      wrapperCol: {
        lg: { span: 17, offset: 1 }
      },
      form1: this.$form.createForm(this),
      form2: this.$form.createForm(this),
      form3: this.$form.createForm(this),
      form4: this.$form.createForm(this),
      previewVisible: false,
      previewVisible1: false,
      previewVisible2: false,
      previewImage: ""
    };
  },
  computed: {
    orderStatusText() {
      const status = this.orderInfo.order.status;
      const subStatus = this.orderInfo.order.subStatus;
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
    itemText: function() {
      let text = "";
      let item = this.orderInfo.samples[this.sampleStep]["item"];
      this.orderInfo.opts.itemOpts.forEach(opt => {
        if (opt.key == item) {
          text = opt.value;
        }
      });
      return text;
    },
    tumorSliceTypeText: function() {
      let text = "";
      const tumorSliceType = this.orderInfo.samples[this.sampleStep][
        "tumorSliceType"
      ];
      const sample = this.orderInfo.opts.tumorSliceTypeOpts.filter(
        item => item.value == tumorSliceType[0]
      )[0];
      if (!sample) {
        return text;
      }
      const type = sample.children.filter(
        item => item.value == tumorSliceType[1]
      )[0];
      if (type) {
        text = type.label;
        this.sliceTypeUnit = type.unit;
      }
      return text;
    },
    compareSampleText: function() {
      let text = "";
      if (this.orderInfo.samples[this.sampleStep]["compareSample"] == 1) {
        text = "是";
      } else {
        text = "否";
      }
      return text;
    },
    sampleStatusText: function() {
      if (this.orderInfo.samples[this.sampleStep]["sampleStatus"] == 1) {
        return " 正常";
      } else {
        return "异常";
      }
    },
    sampleAcceptText: function() {
      if (this.orderInfo.samples[this.sampleStep]["sampleAccept"] == 1) {
        return "接收";
      } else {
        return "拒收";
      }
    }
  },
  mounted: function() {
    this.confirmSample = this.orderInfo.order.sampleConfirm;
    this.confirmBase = this.orderInfo.order.baseConfirm;
    this.confirmPayment = this.orderInfo.order.paymentConfirm;
    this.step = this.defaultStep;
  },
  methods: {
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
    // 重新采样
    reSampling(id) {
      LabServiceApi.reSampling(id).then(res => {
        if (res.ret == 0) {
          this.$message.success("重新采样成功");
          this.$parent.OrderDetail(this.$route.params.id);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    backto() {
      this.goto("/orderList");
    },
    doConfirm(step) {
      // console.log(step, this.confirmBase, this.confirmPayment);
      // console.log(this.confirmSample, "confirmSample");
      if (
        (step == 1 && this.confirmBase == 1 && this.confirmPayment == 1) ||
        (step == 2 && this.confirmSample == 1)
      ) {
        if (step == 2 && this.orderInfo.samples.length == 0) {
          this.$message.error("样本不存在");
          return;
        } else {
          if (step == 2) {
            let flag = false;
            // 校验其中有一个样本是正常对照样本为否且已接收的状态
            this.orderInfo.samples.forEach(v => {
              if (v.compareSample == 2 && v.sampleAccept == 1) {
                flag = true;
              }
            });
            if (flag) {
              this.$emit("on-confirm", step);
            } else {
              this.$message.error(
                "至少验收一个癌症样本，请检查数据正确性或选择重新采样"
              );
            }
          }
          this.$emit("on-confirm", step);
        }
        // console.log(this.orderInfo.samples);
        //
      } else {
        this.$message.error("信息确认后才可提交");
      }
    },
    goto(path) {
      this.$router.push({ path: path });
    },
    handleCancel() {
      this.previewVisible = false;
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
    },
    payTypeText(payType) {
      return payType == 1
        ? "微信支付"
        : payType == 2
        ? "支付宝"
        : payType == 3
        ? "线下支付"
        : payType == 4
        ? "授信"
        : "";
    }
  }
};
</script>

<style scoped>
.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.marginb20 {
  margin-bottom: 6px;
}

.textleft {
  text-align: left;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>

<style>
.ant-upload-list-picture-card .ant-upload-list-item-info:before {
  left: -0%;
}

.ant-form-item-label label {
  color: #303e4e;
  margin-right: -9px;
}
</style>
