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
  <div style="background-color:#F4F5FA;min-height:100vh;">
    <div style="background:white;height:64px;">
      <LabHeaderComponent></LabHeaderComponent>
    </div>
    <div>
      <a-row>
        <a-col :lg="24" :xs="0" style="height:24px;"></a-col>
      </a-row>
    </div>
    <div
      class="content"
      style="max-width:1200px;margin:0 auto;margin-bottom:20px;"
      v-if="!loading"
    >
      <div v-if="step == 1">
        <a-row class="row-bg" :gutter="16">
          <a-col :lg="{ span: 12 }" class="col-bg">
            <h3 style="text-align:left;padding-left:16px;">患者信息</h3>
            <a-form
              :hideRequiredMark="false"
              class="text-left"
              :form="patientInfo"
            >
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="手机号码"
              >
                <a-input
                  maxlength="11"
                  size="small"
                  onkeyup="this.value=this.value.replace(/\D/g,'')"
                  onafterpaste="this.value=this.value.replace(/\D/g,'')"
                  v-decorator="[
                    'phoneNum',
                    {
                      initialValue: orderInfo.patientInfo.phoneNum,
                      rules: [
                        {
                          required: true,
                          type: 'string',
                          len: 11,
                          message: '请输入手机号码!'
                        }
                      ]
                    }
                  ]"
                  placeholder="11位手机号码"
                ></a-input>
              </a-form-item>

              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="姓名"
              >
                <a-input
                  maxlength="16"
                  size="small"
                  v-decorator="[
                    'name',
                    {
                      initialValue: orderInfo.patientInfo.name,
                      rules: [
                        {
                          required: true,
                          type: 'string',
                          min: 2,
                          max: 16,
                          whitespace: true,
                          message: '请输入姓名!'
                        }
                      ]
                    }
                  ]"
                  placeholder="请输入姓名"
                ></a-input>
              </a-form-item>

              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="性别"
              >
                <a-radio-group
                  buttonStyle="solid"
                  size="small"
                  v-decorator="[
                    'gender',
                    {
                      initialValue: orderInfo.patientInfo.gender,
                      rules: [{ required: true, message: '请选择性别' }]
                    }
                  ]"
                >
                  <a-radio-button :value="1" style="width:60px;"
                    >男</a-radio-button
                  >
                  <a-radio-button :value="2" style="width:60px;"
                    >女</a-radio-button
                  >
                </a-radio-group>
              </a-form-item>

              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="年龄"
              >
                <a-input-number
                  :min="1"
                  :max="150"
                  size="small"
                  style="width:120px;"
                  v-decorator="[
                    'age',
                    {
                      initialValue: orderInfo.patientInfo.age,
                      rules: [{ required: true, message: '请输入年龄' }]
                    }
                  ]"
                />岁
              </a-form-item>

              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="所在地区"
              >
                <a-cascader
                  :options="areas"
                  size="small"
                  v-decorator="[
                    'location',
                    {
                      initialValue: orderInfo.patientInfo.location,
                      rules: [
                        {
                          required: false,
                          type: 'array',
                          length: 3,
                          message: '选择所在地区!'
                        }
                      ]
                    }
                  ]"
                  placeholder="请选择所在地区"
                />
              </a-form-item>

              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="身份证"
              >
                <a-input
                  maxlength="18"
                  size="small"
                  v-decorator="[
                    'idCard',
                    {
                      initialValue: orderInfo.patientInfo.idCard,
                      rules: [
                        {
                          required: true,
                          type: 'string',
                          len: 18,
                          message: '请输入身份证号码'
                        }
                      ]
                    }
                  ]"
                  placeholder="请输入身份证号码"
                ></a-input>
              </a-form-item>

              <div style="margin-bottom:24px;padding-left:16px;">
                <LabUploadComponent
                  :data="{
                    id: this.orderID,
                    title: '病理报告',
                    action: `/reception/api/lab/upload/${this.orderID}/5`,
                    showPreviewIcon: true,
                    showRemoveIcon: false
                  }"
                  @on-upload="uploadImages"
                  :files="orderInfo.pathology"
                ></LabUploadComponent>
              </div>
            </a-form>

            <h3 style="text-align:left;padding-left:16px;">报告接收信息</h3>
            <a-form :hideRequiredMark="false" class="text-left" :form="addr">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="患者关系"
              >
                <a-radio-group
                  buttonStyle="solid"
                  size="small"
                  v-decorator="[
                    'receiverType',
                    {
                      initialValue: orderInfo.addr.receiverType,
                      rules: [{ required: true, message: '请选择患者关系' }]
                    }
                  ]"
                >
                  <a-radio-button :value="1" style="width:60px;"
                    >本人</a-radio-button
                  >
                  <a-radio-button :value="2" style="width:60px;"
                    >家属</a-radio-button
                  >
                </a-radio-group>
              </a-form-item>

              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="收货人"
              >
                <a-input
                  size="small"
                  maxlength="16"
                  v-decorator="[
                    'receiver',
                    {
                      initialValue: orderInfo.addr.receiver,
                      rules: [
                        {
                          required: true,
                          type: 'string',
                          min: 2,
                          max: 16,
                          whitespace: true,
                          message: '请输入收货人姓名!'
                        }
                      ]
                    }
                  ]"
                  placeholder="请输入收货人姓名"
                ></a-input>
              </a-form-item>

              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="所在地"
              >
                <a-cascader
                  :options="areas"
                  size="small"
                  v-decorator="[
                    'addr',
                    {
                      initialValue: orderInfo.addr.addr,
                      rules: [
                        {
                          required: false,
                          type: 'array',
                          length: 3,
                          message: '请输入收货所在地!'
                        }
                      ]
                    }
                  ]"
                  placeholder="请输入收货所在地"
                />
              </a-form-item>

              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="详细地址"
              >
                <a-input
                  size="small"
                  v-decorator="[
                    'detail',
                    {
                      initialValue: orderInfo.addr.detail,
                      rules: [
                        {
                          required: true,
                          type: 'string',
                          min: 6,
                          max: 128,
                          whitespace: true,
                          message: '请输入收货详细地址!'
                        }
                      ]
                    }
                  ]"
                  placeholder="请输入收货详细地址"
                ></a-input>
              </a-form-item>

              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="收货人电话"
              >
                <a-input
                  size="small"
                  maxlength="16"
                  v-decorator="[
                    'tel',
                    {
                      initialValue: orderInfo.addr.tel,
                      rules: [
                        {
                          required: true,
                          type: 'string',
                          min: 6,
                          max: 16,
                          message: '请输入收货人电话!'
                        }
                      ]
                    }
                  ]"
                  placeholder="请输入收货人电话"
                ></a-input>
              </a-form-item>

              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="备注"
              >
                <a-input
                  size="small"
                  maxlength="500"
                  type="textarea"
                  :rows="1"
                  v-decorator="[
                    'comment',
                    {
                      initialValue: orderInfo.addr.comment,
                      rules: [
                        {
                          required: false,
                          type: 'string',
                          min: 0,
                          max: 500,
                          message: '请输入备注信息!'
                        }
                      ]
                    }
                  ]"
                  placeholder="请输入备注信息"
                ></a-input>
              </a-form-item>
            </a-form>
            <h3 style="text-align:left;padding-left:16px;margin-top:30px;">样本返还</h3>
            <a-form :hideRequiredMark="false" class="text-left" :form="samReturn">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="返样接收人"
              >
                <a-input
                  size="small"
                  maxlength="16"
                  v-decorator="[
                    'sRSName',
                    {
                      initialValue: orderInfo.splRreceive.sRSName,
                      rules: [
                        {
                          type: 'string',
                          min: 2,
                          max: 16,
                          whitespace: true,
                          message: '请输入返样接收人!'
                        }
                      ]
                    }
                  ]"
                  placeholder="请输入返样接收人"
                ></a-input>
              </a-form-item>

              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="接收人联系电话"
              >
                <a-input
                  size="small"
                  maxlength="16"
                  v-decorator="[
                    'sRSTel',
                    {
                      initialValue: orderInfo.splRreceive.sRSTel,
                      rules: [
                        {
                          type: 'string',
                          min: 2,
                          max: 16,
                          whitespace: true,
                          message: '请输入接收人联系电话!'
                        }
                      ]
                    }
                  ]"
                  placeholder="请输入接收人联系电话"
                ></a-input>
              </a-form-item>

              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="所在地"
              >
                <a-cascader
                  :options="areas"
                  size="small"
                  v-decorator="[
                    'sRSArea',
                    {
                      initialValue: orderInfo.splRreceive.sRSArea,
                      rules: [
                        {
                          required: false,
                          type: 'array',
                          length: 3,
                          message: '请输入收货所在地!'
                        }
                      ]
                    }
                  ]"
                  placeholder="请输入所在地"
                />
              </a-form-item>

              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="详细地址"
              >
                <a-input
                  size="small"
                  v-decorator="[
                    'sRSAddr',
                    {
                      initialValue:  orderInfo.splRreceive.sRSAddr,
                      rules: [
                        {
                          type: 'string',
                          min: 6,
                          max: 128,
                          whitespace: true,
                          message: '请输入收货详细地址!'
                        }
                      ]
                    }
                  ]"
                  placeholder="请输入详细地址"
                ></a-input>
              </a-form-item>
            </a-form>
          </a-col>
          <a-col :lg="{ span: 11, offset: 1 }" class="col-bg">
            <h3 style="text-align:left;padding-left:16px;">医生信息</h3>
            <a-form :hideRequiredMark="false" class="text-left" :form="doctor">
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="主治医生"
              >
                <a-input
                  size="small"
                  maxlength="16"
                  v-decorator="[
                    'name',
                    {
                      initialValue: orderInfo.doctor.name,
                      rules: [
                        {
                          required: false,
                          type: 'string',
                          min: 1,
                          max: 16,
                          message: '请输入主治医生姓名'
                        }
                      ]
                    }
                  ]"
                  placeholder="请输入主治医生姓名"
                ></a-input>
              </a-form-item>

              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="科室"
              >
                <a-input
                  size="small"
                  maxlength="16"
                  v-decorator="[
                    'department',
                    {
                      initialValue: orderInfo.doctor.department,
                      rules: [
                        {
                          required: false,
                          type: 'string',
                          min: 1,
                          max: 16,
                          message: '请输入主治医生科室'
                        }
                      ]
                    }
                  ]"
                  placeholder="请输入主治医生姓名"
                ></a-input>
              </a-form-item>

              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="医院"
              >
                <a-input
                  size="small"
                  maxlength="16"
                  v-decorator="[
                    'hospital',
                    {
                      initialValue: orderInfo.doctor.hospital,
                      rules: [
                        {
                          required: true,
                          type: 'string',
                          min: 1,
                          max: 16,
                          message: '请输入医院'
                        }
                      ]
                    }
                  ]"
                  placeholder="请输入医院"
                ></a-input>
              </a-form-item>

              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="联系电话"
              >
                <a-input
                  size="small"
                  maxlength="11"
                  v-decorator="[
                    'telNum',
                    {
                      initialValue: orderInfo.doctor.telNum,
                      rules: [
                        {
                          required: false,
                          type: 'string',
                          min: 6,
                          max: 11,
                          message: '请输入联系电话!'
                        }
                      ]
                    }
                  ]"
                  placeholder="请输入联系电话（选填）"
                ></a-input>
              </a-form-item>
            </a-form>

            <h3 style="text-align:left;padding-left:16px;margin-top:16px;">
              专业诊断
            </h3>
            <a-form
              :hideRequiredMark="false"
              class="text-left"
              :form="diagnose"
            >
              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="临床诊断"
              >
                <a-input
                  size="small"
                  maxlength="16"
                  v-decorator="[
                    'diagnosis',
                    {
                      initialValue: orderInfo.diagnose.diagnosis,
                      rules: [
                        {
                          required: true,
                          type: 'string',
                          min: 1,
                          max: 120,
                          message: '请输入临床诊断!'
                        }
                      ]
                    }
                  ]"
                  placeholder="请输入临床诊断"
                ></a-input>
              </a-form-item>

              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="治疗史  "
              >
                <a-input
                  size="small"
                  maxlength="500"
                  type="textarea"
                  :rows="1"
                  v-decorator="[
                    'history',
                    {
                      initialValue: orderInfo.diagnose.history,
                      rules: [
                        {
                          required: false,
                          type: 'string',
                          max: 500,
                          message: '请输入治疗史!'
                        }
                      ]
                    }
                  ]"
                  placeholder="本次患病送检前治疗经历（选填）"
                ></a-input>
              </a-form-item>

              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="疾病史  "
              >
                <a-input
                  size="small"
                  maxlength="500"
                  type="textarea"
                  :rows="1"
                  v-decorator="[
                    'disease',
                    {
                      initialValue: orderInfo.diagnose.disease,
                      rules: [
                        {
                          required: false,
                          type: 'string',
                          max: 500,
                          message: '请输入疾病史!'
                        }
                      ]
                    }
                  ]"
                  placeholder="患本疾病前是否有其它病史（选填）"
                ></a-input>
              </a-form-item>

              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="家族史  "
              >
                <a-input
                  size="small"
                  maxlength="500"
                  type="textarea"
                  :rows="1"
                  v-decorator="[
                    'family',
                    {
                      initialValue: orderInfo.diagnose.family,
                      rules: [
                        {
                          required: true,
                          type: 'string',
                          max: 500,
                          message: '请输入家族史信息!'
                        }
                      ]
                    }
                  ]"
                  placeholder="亲属中是否有患本类疾病者（选填）"
                ></a-input>
              </a-form-item>

              <a-form-item
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="病情描述  "
              >
                <a-input
                  size="small"
                  maxlength="500"
                  type="textarea"
                  :rows="1"
                  v-decorator="[
                    'descr',
                    {
                      initialValue: orderInfo.diagnose.descr,
                      rules: [
                        {
                          required: true,
                          type: 'string',
                          min: 1,
                          max: 500,
                          message: '请输入病情信息!'
                        }
                      ]
                    }
                  ]"
                  placeholder="请详细描述您的症状、疾病和身体状况，便于医生更准确的分析（1-500字），为保护您的隐私，请勿在咨询中透露您的真实姓名、手机号、微信号等信息"
                ></a-input>
              </a-form-item>

              <a-row>
                <a-col :sapn="24" style="padding-left:16px;margin-top:14px;">
                  <div style="font-size:14px;line-height:22px;">病史图片</div>
                  <LabUploadComponent
                    :data="{
                      id: this.orderID,
                      title: '',
                      action: `/reception/api/lab/upload/${this.orderID}/1`,
                      showPreviewIcon: true,
                      showRemoveIcon: false
                    }"
                    @on-upload="uploadImages2"
                    :files="orderInfo.pHisImages"
                  ></LabUploadComponent>
                </a-col>
              </a-row>
              <a-row>
                <a-col :sapn="24" style="padding-left:16px;margin-top:14px;">
                  <div style="font-size:14px;line-height:22px;">治疗史图片</div>
                  <LabUploadComponent
                    :data="{
                      id: this.orderID,
                      title: '',
                      action: `/reception/api/lab/upload/${this.orderID}/2`,
                      showPreviewIcon: true,
                      showRemoveIcon: false
                    }"
                    @on-upload="uploadImages3"
                    :files="orderInfo.treatHisImages"
                  ></LabUploadComponent>
                </a-col>
              </a-row>
              <a-row>
                <a-col :sapn="24" style="padding-left:16px;margin-top:14px;">
                  <div style="font-size:14px;line-height:22px;">申请单</div>
                  <LabUploadComponent
                    :data="{
                      id: this.orderID,
                      title: '',
                      action: `/reception/api/lab/upload/${this.orderID}/3`,
                      showPreviewIcon: true,
                      showRemoveIcon: false
                    }"
                    @on-upload="uploadImages4"
                    :files="orderInfo.applyImages"
                  ></LabUploadComponent>
                </a-col>
              </a-row>
              <a-row>
                <a-col :sapn="24" style="padding-left:16px;margin-top:14px;">
                  <div style="font-size:14px;line-height:22px;">知情书图片</div>
                  <LabUploadComponent
                    :data="{
                      id: this.orderID,
                      title: '',
                      action: `/reception/api/lab/upload/${this.orderID}/4`,
                      showPreviewIcon: true,
                      showRemoveIcon: false
                    }"
                    @on-upload="uploadImages5"
                    :files="orderInfo.letterImages"
                  ></LabUploadComponent>
                </a-col>
              </a-row>
              <a-row style="margin-top:14px;padding-left:16px;">
                <a-col>
                  <span style="font-size:14px;color:#D8D8D8;"
                    >北斗生命科学保证您的隐私安全</span
                  >
                </a-col>
              </a-row>
            </a-form>
          </a-col>
        </a-row>

        <a-row :gutter="16" style="margin-top:16px;">
          <a-col :span="24" class="col-bg">
            <a-button
              style="background-color:#36C626;color:white;width:200px;height:40px;"
              class="next-step-button"
              @click="handleSubmit(1, false)"
              >暂存</a-button
            >

            <a-button
              type="primary"
              style="width:200px;height:40px;"
              class="next-step-button"
              @click="saveInfo(1)"
              >提交</a-button
            >
          </a-col>
          <a-col :lg="{ span: 15, offset: 1 }"></a-col>
        </a-row>
      </div>
      <div v-if="step == 2">
        <a-row :gutter="16">
          <a-col :lg="{ span: 12 }" class="col-bg">
            <div class="text-left" style="padding-left: 16px;line-height:28px;">
              检测服务:
              <span style="margin-left:10px;">{{ orderInfo.item.name }}</span>
            </div>
            <div style="text-align:left;padding-left: 16px;">
              <div style="display:inline-block;">患者样本：</div>
              <div
                v-for="index in samples.length"
                :key="index"
                style="margin-right:26px;min-width:51px;display:inline-block;"
                @click="sampleStep = index"
              >
                <div
                  v-if="sampleStep == index"
                  style="background-color:#1890FF;padding: 2px 7px;border-radius:4px;"
                >
                  <span style="color:white;font-size:14px;cursor:pointer;"
                    >样本{{ index
                    }}{{
                      orderInfo.samples[index - 1]["sampleAccept"] == 2
                        ? "-已拒收"
                        : ""
                    }}</span
                  >
                </div>
                <div v-else style="vertical-align: middle;cursor:pointer;">
                  <span style="color:#A9A9A9;opacity:1;"
                    >样本{{ index
                    }}{{
                      orderInfo.samples[index - 1]["sampleAccept"] == 2
                        ? "-已拒收"
                        : ""
                    }}</span
                  >
                </div>
              </div>
            </div>
          </a-col>
          <a-col :lg="{ span: 11, offset: 1 }" class="col-bg">
            <a-button
              style="background-color:#36C626;color:white;width:200px;height:40px;"
              class="next-step-button"
              @click="handleSubmit(2, false)"
              >暂存</a-button
            >

            <a-button
              type="primary"
              style="width:200px;height:40px;"
              class="next-step-button"
              @click="saveInfo(2)"
              >提交</a-button
            >
          </a-col>
        </a-row>

        <a-row class="row-bg" :gutter="16" style="margin-top: 16px;">
          <a-col :lg="{ span: 12 }" class="col-bg">
            <h3 style="text-align:left;padding-left:16px;">包裹信息</h3>
            <div
              v-for="key in samples.length"
              :key="key"
              v-show="sampleStep == key"
            >
              <a-form
                :hideRequiredMark="false"
                class="text-left"
                :form="packages[key - 1]"
              >
                <a-form-item
                  style="display:none;"
                  :label-col="labelCol1"
                  :wrapper-col="wrapperCol1"
                  label="包裹ID"
                >
                  <a-input
                    size="small"
                    v-decorator="[
                      'id',
                      {
                        initialValue: orderInfo.packages[key - 1]['id'],
                        rules: [{ required: true }]
                      }
                    ]"
                  ></a-input>
                </a-form-item>

                <a-form-item
                  :label-col="labelCol1"
                  :wrapper-col="wrapperCol1"
                  label="快递单号"
                >
                  <a-input
                    size="small"
                    maxlength="16"
                    v-decorator="[
                      'no',
                      {
                        initialValue: orderInfo.packages[key - 1]['no'],
                        rules: [
                          {
                            required: true,
                            type: 'string',
                            min: 1,
                            max: 32,
                            whitespace: true,
                            message: '请输入快递单号!'
                          }
                        ]
                      }
                    ]"
                    placeholder="请输入快递单号"
                  ></a-input>
                </a-form-item>

                <!-- <a-form-item
                  :label-col="labelCol1"
                  :wrapper-col="wrapperCol1"
                  label="快递公司"
                >
                  <a-input
                    size="small"
                    maxlength="16"
                    v-decorator="[
                      'company',
                      { initialValue: orderInfo.packages[key-1]['company'], rules: [{ required: true, type: 'string', min:1, max: 32, whitespace:true, message: '请输入快递公司名称!' }] }
                    ]"
                    placeholder="请输入快递公司名称"
                  >
                  </a-input>
                </a-form-item>-->
                <a-form-item
                  :label-col="labelCol1"
                  :wrapper-col="wrapperCol1"
                  label="快递公司"
                >
                  <a-select
                    size="small"
                    v-decorator="[
                      'company',
                      {
                        initialValue: orderInfo.packages[key - 1]['company'],
                        rules: [{ required: true, message: '请选择快递公司!' }]
                      }
                    ]"
                  >
                    <a-select-option
                      v-for="(t, i) in orderInfo.opts.transport"
                      :key="i"
                      :value="t.value"
                      >{{ t.value }}</a-select-option
                    >
                  </a-select>
                </a-form-item>

                <!-- <a-form-item
                  :label-col="labelCol1"
                  :wrapper-col="wrapperCol1"
                  label="运输条件"
                >
                  <a-input
                    size="small"
                    maxlength="16"
                    v-decorator="[
                      'condition',
                      {initialValue: orderInfo.packages[key-1]['condition'], rules: [{ required: true, type: 'string', min:1, max: 32, whitespace:true, message: '请输入运输条件!' }] }
                    ]"
                    placeholder="请输入运输条件"
                  >
                  </a-input>
                </a-form-item>-->
                <a-form-item
                  :label-col="labelCol1"
                  :wrapper-col="wrapperCol1"
                  label="运输条件"
                >
                  <a-select
                    size="small"
                    v-decorator="[
                      'condition',
                      {
                        initialValue: orderInfo.packages[key - 1]['condition'],
                        rules: [{ required: true, message: '请输入运输条件!' }]
                      }
                    ]"
                  >
                    <a-select-option
                      v-for="(t, i) in orderInfo.opts.transCondition"
                      :key="i"
                      :value="t.value"
                      >{{ t.value }}</a-select-option
                    >
                  </a-select>
                </a-form-item>

                <a-form-item
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                  label="是否合格"
                >
                  <a-radio-group
                    buttonStyle="solid"
                    size="small"
                    v-decorator="[
                      'valid',
                      {
                        initialValue: orderInfo.packages[key - 1]['valid'],
                        rules: [{ required: true, message: '请选择是否合格' }]
                      }
                    ]"
                  >
                    <a-radio-button
                      :value="1"
                      style="width:80px;text-align:center;"
                      >合格</a-radio-button
                    >
                    <a-radio-button
                      :value="0"
                      style="width:80px;text-align:center;"
                      >不合格</a-radio-button
                    >
                  </a-radio-group>
                </a-form-item>

                <a-form-item
                  v-if="packages[key - 1].getFieldValue('valid') == 0"
                  :label-col="labelCol1"
                  :wrapper-col="wrapperCol1"
                  label="不合格原因"
                >
                  <a-input
                    size="small"
                    maxlength="16"
                    v-decorator="[
                      'reason',
                      {
                        initialValue: orderInfo.packages[key - 1]['reason'],
                        rules: [
                          {
                            required: true,
                            type: 'string',
                            min: 1,
                            max: 128,
                            whitespace: true,
                            message: '请输入不合格原因!'
                          }
                        ]
                      }
                    ]"
                    placeholder="请输入不合格原因"
                  ></a-input>
                </a-form-item>

                <h3 style="text-align:left;padding-left:16px;margin-top: 16px;">
                  拆包
                </h3>
                <a-form-item
                  :label-col="labelCol1"
                  :wrapper-col="wrapperCol1"
                  label="验收日期"
                >
                  <a-date-picker
                    size="small"
                    showTime
                    v-decorator="[
                      'acceptacnceDate',
                      {
                        initialValue: todateObj(
                          orderInfo.packages[key - 1]['acceptacnceDate'],
                          'YYYY-MM-DD HH:mm:ss'
                        ),
                        rules: [{ required: true, message: '请选择验收日期!' }]
                      }
                    ]"
                    placeholder="请选择验收日期"
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                </a-form-item>

                <a-form-item
                  :label-col="labelCol1"
                  :wrapper-col="wrapperCol1"
                  label="验收人"
                >
                  <a-input
                    size="small"
                    maxlength="16"
                    v-decorator="[
                      'acceptor',
                      {
                        initialValue: orderInfo.packages[key - 1]['acceptor'],
                        rules: [
                          {
                            required: true,
                            type: 'string',
                            min: 1,
                            max: 32,
                            whitespace: true,
                            message: '请输入验收人!'
                          }
                        ]
                      }
                    ]"
                    placeholder="请输入验收人"
                  ></a-input>
                </a-form-item>

                <a-form-item
                  :label-col="labelCol1"
                  :wrapper-col="wrapperCol1"
                  label="复核人"
                >
                  <a-input
                    size="small"
                    maxlength="16"
                    v-decorator="[
                      'validator',
                      {
                        initialValue: orderInfo.packages[key - 1]['validator'],
                        rules: [
                          {
                            required: true,
                            type: 'string',
                            min: 1,
                            max: 32,
                            whitespace: true,
                            message: '请输入复核人!'
                          }
                        ]
                      }
                    ]"
                    placeholder="请输入复核人"
                  ></a-input>
                </a-form-item>
              </a-form>
            </div>
            <div style="margin-bottom:16px;padding-left:16px;">
              <LabUploadComponent
                :data="{
                  id: this.orderID,
                  title: '病理报告',
                  isRequired: false,
                  action: '',
                  showPreviewIcon: true,
                  showRemoveIcon: false
                }"
                :files="orderInfo.pathology"
              ></LabUploadComponent>
            </div>
          </a-col>
          <a-col :lg="{ span: 11, offset: 1 }" class="col-bg">
            <h3 style="text-align:left;padding-left:16px;">样本信息</h3>
            <div
              v-for="key in samples.length"
              :key="key"
              v-show="sampleStep == key"
            >
              <a-form
                :hideRequiredMark="false"
                class="text-left"
                :form="samples[key - 1]"
              >
                <a-form-item
                  style="display:none;"
                  :label-col="labelCol1"
                  :wrapper-col="wrapperCol1"
                  label="样本ID"
                >
                  <a-input
                    v-decorator="[
                      'id',
                      {
                        initialValue: orderInfo.samples[key - 1]['id'],
                        rules: [{ required: true }]
                      }
                    ]"
                  ></a-input>
                </a-form-item>

                <a-form-item
                  :label-col="labelCol1"
                  :wrapper-col="wrapperCol1"
                  label="样本条码"
                >
                  <a-input
                    size="small"
                    maxlength="9"
                    minlength="9"
                    v-decorator="[
                      'barcode',
                      {
                        initialValue: orderInfo.samples[key - 1]['barcode'],
                        rules: [
                          {
                            required: true,
                            type: 'string',
                            min: 9,
                            max: 9,
                            whitespace: true,
                            message: '请输入样本条码!'
                          }
                        ]
                      }
                    ]"
                    placeholder="请输入样本条码"
                  ></a-input>
                </a-form-item>

                <a-form-item
                  :label-col="labelCol1"
                  :wrapper-col="wrapperCol1"
                  label="样本类型"
                >
                  <!-- <a-select
                  size="small"
                  v-decorator="[
                    'tumorSliceType',
                    { initialValue: orderInfo.samples[key-1]['tumorSliceType'], rules: [{ required: true, type: 'number', message: '请选择样本类型!' }] }
                  ]"
                >
                <a-select-option v-for="(t, i) in orderInfo.opts.tumorSliceTypeOpts" :key="i" :value="t.key">
                  {{t.value}}
                </a-select-option>
                  </a-select>-->
                  <a-cascader
                    size="small"
                    v-decorator="[
                      'tumorSliceType',
                      {
                        initialValue:
                          orderInfo.samples[key - 1]['tumorSliceType'],
                        rules: [
                          {
                            required: true,
                            type: 'array',
                            message: '请选择样本类型!'
                          }
                        ]
                      }
                    ]"
                    :options="orderInfo.opts.tumorSliceTypeOpts"
                    expandTrigger="hover"
                    placeholder="请选择样本类型"
                    @change="handleSliceTypeChange"
                  />
                </a-form-item>

                <a-form-item
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                  label="样本数量"
                >
                  <a-input-number
                    size="small"
                    :min="1"
                    :max="10"
                    onkeyup="this.value=this.value.replace(/\D/g,'')"
                    onafterpaste="this.value=this.value.replace(/\D/g,'')"
                    style="width:120px;"
                    v-decorator="[
                      'num',
                      {
                        initialValue: orderInfo.samples[key - 1]['num'],
                        rules: [{ required: true, message: '请输入样本数量' }]
                      }
                    ]"
                  />
                  <span style="margin-left:6px;">{{ sliceTypeUint }}</span>
                </a-form-item>

                <a-form-item
                  :label-col="labelCol1"
                  :wrapper-col="wrapperCol1"
                  label="取材位置"
                >
                  <a-input
                    size="small"
                    maxlength="16"
                    v-decorator="[
                      'tumorSlicePosition',
                      {
                        initialValue:
                          orderInfo.samples[key - 1]['tumorSlicePosition'],
                        rules: [
                          {
                            required: false,
                            type: 'string',
                            min: 1,
                            max: 16,
                            whitespace: true,
                            message: '请输入取材位置!'
                          }
                        ]
                      }
                    ]"
                    placeholder="请输入取材位置（选填）"
                  ></a-input>
                </a-form-item>

                <a-form-item
                  :label-col="labelCol1"
                  :wrapper-col="wrapperCol1"
                  label="样本病理编号"
                >
                  <a-input
                    size="small"
                    maxlength="16"
                    v-decorator="[
                      'no',
                      {
                        initialValue: orderInfo.samples[key - 1]['no'],
                        rules: [
                          {
                            required: true,
                            type: 'string',
                            min: 1,
                            max: 16,
                            whitespace: true,
                            message: '请输入样本病理编号!'
                          }
                        ]
                      }
                    ]"
                    placeholder="请输入样本病理编号"
                  ></a-input>
                </a-form-item>

                <a-form-item
                  :label-col="labelCol1"
                  :wrapper-col="wrapperCol1"
                  label="肿瘤细胞含量"
                >
                  <a-input
                    size="small"
                    maxlength="2"
                    onkeyup="this.value=this.value.replace(/\D/g,'')"
                    onafterpaste="this.value=this.value.replace(/\D/g,'')"
                    v-decorator="[
                      'cellPercent',
                      {
                        initialValue: orderInfo.samples[key - 1]['cellPercent'],
                        rules: [
                          {
                            required: true,
                            type: 'string',
                            min: 1,
                            max: 2,
                            whitespace: true,
                            message: '请输入肿瘤细胞含量!'
                          }
                        ]
                      }
                    ]"
                    placeholder="请输入肿瘤细胞含量"
                  ></a-input>
                </a-form-item>

                <a-form-item
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                  label="正常对照样本"
                >
                  <a-radio-group
                    buttonStyle="solid"
                    size="small"
                    v-decorator="[
                      'compareSample',
                      {
                        initialValue:
                          orderInfo.samples[key - 1]['compareSample'],
                        rules: [
                          { required: true, message: '请选择是否正常对照样本' }
                        ]
                      }
                    ]"
                  >
                    <a-radio-button
                      :value="1"
                      style="width:80px;text-align:center;"
                      >是</a-radio-button
                    >
                    <a-radio-button
                      :value="2"
                      style="width:80px;text-align:center;"
                      >否</a-radio-button
                    >
                  </a-radio-group>
                </a-form-item>

                <a-form-item
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                  label="样本状态"
                >
                  <a-radio-group
                    buttonStyle="solid"
                    size="small"
                    v-decorator="[
                      'sampleStatus',
                      {
                        initialValue:
                          orderInfo.samples[key - 1]['sampleStatus'],
                        rules: [
                          {
                            required: true,
                            pattern: new RegExp('[1, 2]{1}'),
                            message: '请选择样本状态'
                          }
                        ]
                      }
                    ]"
                  >
                    <a-radio-button
                      :value="1"
                      style="width:80px;text-align:center;"
                      >正常</a-radio-button
                    >
                    <a-radio-button
                      :value="2"
                      style="width:80px;text-align:center;"
                      >异常</a-radio-button
                    >
                  </a-radio-group>
                </a-form-item>

                <a-form-item
                  v-if="samples[key - 1].getFieldValue('sampleStatus') == 2"
                  :label-col="labelCol1"
                  :wrapper-col="wrapperCol1"
                  label="异常情况描述"
                >
                  <a-input
                    size="small"
                    maxlength="16"
                    v-decorator="[
                      'abnormal',
                      {
                        rules: [
                          {
                            required: true,
                            type: 'string',
                            min: 1,
                            max: 128,
                            whitespace: true,
                            message: '请输入异常情况描述!'
                          }
                        ]
                      }
                    ]"
                    placeholder="请输入异常情况描述"
                  ></a-input>
                </a-form-item>

                <a-form-item
                  :label-col="labelCol1"
                  :wrapper-col="wrapperCol1"
                  label="采样日期"
                >
                  <a-date-picker
                    size="small"
                    v-decorator="[
                      'simplingDate',
                      {
                        initialValue: todateObj(
                          orderInfo.samples[key - 1]['simplingDate'],
                          'YYYY-MM-DD'
                        ),
                        rules: [{ required: false, message: '请输入采样日期!' }]
                      }
                    ]"
                    placeholder="请选择采样日期"
                    format="YYYY-MM-DD"
                  />
                </a-form-item>

                <a-form-item
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                  label="是否接收"
                >
                  <a-radio-group
                    buttonStyle="solid"
                    size="small"
                    v-decorator="[
                      'sampleAccept',
                      {
                        initialValue:
                          orderInfo.samples[key - 1]['sampleAccept'],
                        rules: [
                          {
                            required: true,
                            pattern: new RegExp('[1, 2]{1}'),
                            message: '请选择是否接收样本'
                          }
                        ]
                      }
                    ]"
                  >
                    <a-radio-button
                      :value="1"
                      :disabled="
                        orderInfo.samples[key - 1]['sampleAccept'] == 2
                      "
                      style="width:80px;text-align:center;"
                      >接收</a-radio-button
                    >
                    <a-radio-button
                      :value="2"
                      style="width:80px;text-align:center;"
                      >拒绝</a-radio-button
                    >
                  </a-radio-group>
                </a-form-item>
                <a-form-item
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                  label="样本备注"
                >
                  <a-input
                    size="small"
                    maxlength="500"
                    type="textarea"
                    :rows="1"
                    v-decorator="[
                      'sRemark',
                      { initialValue: orderInfo.samples[key - 1]['sRemark'] }
                    ]"
                    placeholder="请输入样本备注信息"
                  ></a-input>
                </a-form-item>
              </a-form>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
import areas from "../../utils/areas.json";
import auth from "../../auth.js";
import LabHeaderComponent from "../../components/lab/Header.vue";
import LabUploadComponent from "../../components/lab/Upload.vue";

const cloneDeep = require("clone-deep");

import LabService from "../../services/LabService";
const LabServiceApi = new LabService();

import moment from "moment";

export default {
  components: {
    LabHeaderComponent,
    LabUploadComponent
  },
  data() {
    return {
      loading: true,
      type: "lab",
      name: "订单审核",
      sampleStep: "1",
      step: "",
      orderID: "",
      labelCol: {
        lg: { span: 5 }
      },
      wrapperCol: {
        lg: { span: 17 }
      },
      labelCol1: {
        lg: { span: 5 }
      },
      wrapperCol1: {
        lg: { span: 17 }
      },
      sliceTypeUint: "",
      samples: [],
      packages: [],
      orderInfo: {},
      pathology: [],
      diagnoseImgs: [],
      pHisImages: [],
      treatHisImages: [],
      applyImages: [],
      letterImages: [],
      areas: areas,
      transportOpts: [
        {
          key: "常温",
          value: "常温"
        },
        {
          key: "冰袋",
          value: "冰袋"
        },
        {
          key: "干冰",
          value: "干冰"
        }
      ],
      expressOpts: [
        {
          key: "顺丰快递",
          value: "顺丰快递"
        },
        {
          key: "申通快递",
          value: "申通快递"
        },
        {
          key: "圆通快递",
          value: "圆通快递"
        },
        {
          key: "中通快递",
          value: "中通快递"
        },
        {
          key: "韵达快递",
          value: "韵达快递"
        },
        {
          key: "百世快递",
          value: "百世快递"
        },
        {
          key: "优速快递",
          value: "优速快递"
        },
        {
          key: "中邮速递易",
          value: "中邮速递易"
        },
        {
          key: "邮政EMS",
          value: "邮政EMS"
        },
        {
          key: "送货上门（无物流）",
          value: "送货上门（无物流）"
        },
        {
          key: "德邦快递",
          value: "德邦快递"
        }
      ],
      options: {
        sampleStatusOpts: [
          {
            value: "正常",
            key: 1
          },
          {
            value: "异常",
            key: 2
          }
        ]
      },
      previewVisible: false,
      previewImage: "",
      fileList: [
        {
          uid: "-1",
          name: "xxx.png",
          status: "done",
          url: ""
        }
      ]
    };
  },
  beforeCreate() {
    this.patientInfo = this.$form.createForm(this);
    this.doctor = this.$form.createForm(this);
    this.addr = this.$form.createForm(this);
    this.diagnose = this.$form.createForm(this);
    this.samReturn = this.$form.createForm(this);
  },
  methods: {
    uploadImages(images) {
      console.log(images)
      this.pathology = cloneDeep(images);
    },
    uploadImages2(images) {
      this.pHisImages = cloneDeep(images);
    },
    uploadImages3(images) {
      this.treatHisImages = cloneDeep(images);
    },
    uploadImages4(images) {
      this.applyImages = cloneDeep(images);
    },
    uploadImages5(images) {
      this.letterImages = cloneDeep(images);
    },
    todateObj(v, format) {
      return v ? moment(v, format) : null;
    },
    handleSliceTypeChange(value, selectedOptions) {
      if (value.length == 2) {
        this.sliceTypeUint = selectedOptions[1]["unit"];
      } else {
        this.sliceTypeUint = "";
      }
    },
    saveInfo(step) {
      let targets = [];
      let flag = true;
      switch (step) {
        case 1:
          // 患者信息
          if (this.pathology.length < 1) {
            this.$message.error("病理报告不能为空");
            flag = false;
            return;
          }

          // if (this.diagnoseImgs.length < 1) {
          //   this.$message.error('病情图片不能为空')
          //   flag = false
          //   return
          // }

          this.patientInfo.validateFields(err => {
            if (err) {
              flag = false;
              return;
            }
          });

          // 医生信息
          this.doctor.validateFields(err => {
            if (err) {
              flag = false;
              return;
            }
          });

          //诊断信息
          this.diagnose.validateFields(err => {
            if (err) {
              flag = false;
              return;
            }
          });

          //报告接收信息
          this.addr.validateFields(err => {
            if (err) {
              flag = false;
              return;
            }
          });

          break;
        case 2:
          for (let i = 0; i < this.samples.length; i++) {
            this.samples[i].validateFields(err => {
              if (err) {
                flag = false;
              }
            });
            this.packages[i].validateFields(err => {
              if (err) {
                flag = false;
              }
            });

            if (!flag) {
              this.sampleStep = i + 1;
              break;
            }
          }

          // 1:正常样本 2:异常样本
          targets = this.samples.filter(
            el =>
              el.getFieldsValue().sampleAccept == 1 &&
              el.getFieldsValue().compareSample == 2
          );
          // if (targets.length < 1) {
          //   this.flag = false
          //   this.$message.error("至少要有一个异常样本")
          //   return
          // } else if (targets.length > 1) {
          //   this.flag = false
          //   this.$message.error("至多只能有一个异常样本")
          //   return
          // }
          break;
      }

      if (flag) {
        this.handleSubmit(step, true);
      }
    },
    handleSubmit(step, redirect) {
      let params = {};
      if (step == 1) {
        let doctorInfo = this.doctor.getFieldsValue();
        let diagnoseInfo = this.diagnose.getFieldsValue();
        doctorInfo.doctorID = this.orderInfo.doctor.doctorID;
        diagnoseInfo.images = this.diagnoseImgs;
        params = {
          orderID: this.orderID,
          patientInfo: this.patientInfo.getFieldsValue(),
          doctor: doctorInfo,
          pathology: this.pathology,
          pHisImages: this.pHisImages,
          treatHisImages: this.treatHisImages,
          applyImages: this.applyImages,
          letterImages: this.letterImages,
          diagnose: diagnoseInfo,
          splRreceive: this.samReturn.getFieldsValue(),
          addr: this.addr.getFieldsValue()
        };
      } else if (step == 2) {
        let allSamples = this.samples.map(item => {
          return item.getFieldsValue();
        });
        let filteredSamples = allSamples.filter(
          (sample, index) =>
            sample.id == this.orderInfo.samples[index]["id"] &&
            this.orderInfo.samples[index]["sampleAccept"] != 2
        );
        params = {
          orderID: this.orderID,
          samples: filteredSamples,
          packages: this.packages.map(item => {
            let p = item.getFieldsValue();
            p.acceptacnceDate = p.acceptacnceDate.format("YYYY-MM-DD HH:mm:ss");
            return p;
          })
          // sampleComment: this.orderInfo.sampleComment
        };
      } else {
        this.$message.error("无效的参数");
      }
      // console.log(params);
      LabServiceApi.submitOrder(this.orderID, params).then(res => {
        if (res.ret === 0) {
          this.$message.success("保存成功", 1, () => {
            if (redirect) {
              this.goto(`/orderDetail/${this.orderID}?step=${step}`);
            }
          });
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleCancel() {
      this.previewVisible = false;
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
    },
    goto(path) {
      this.$router.push({ path: path });
    },
    OrderDetail(oid) {
      LabServiceApi.orderDetail(oid).then(res => {
        if (res.ret == 0) {
          this.orderInfo = res.data;
          this.pathology = this.orderInfo.pathology;
          this.pHisImages = this.orderInfo.pHisImages;
          this.treatHisImages = this.orderInfo.treatHisImages;
          this.applyImages = this.orderInfo.applyImages;
          this.letterImages = this.orderInfo.letterImages;
          let len = this.orderInfo.samples.length;
          for (let i = 0; i < len; i++) {
            this.samples.push(this.$form.createForm(this));
            this.packages.push(this.$form.createForm(this));
          }
          this.loading = false;
        } else {
          this.$message.error(res.msg);
          this.goto("/orderList");
        }
      });
    }
  },
  mounted: function() {
    // if (!auth.isLogin()) {
    //   this.goto('/lab/orderList')
    // }
    // if (!auth.isLogin()) {
    //   window.location.href = "http://dev.bdlifescience.com/login";
    // }
    this.orderID = this.$route.params.id;
    this.step = this.$route.query.step;
    if (!this.orderID || !this.step) {
      this.goto("/orderList");
    }

    this.OrderDetail(this.orderID);
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.next-step-button {
  width: 90px;
  margin-right: 14px;
}
.ant-steps-label-vertical .ant-steps-item {
  max-width: 20%;
}
.ant-steps-label-vertical .ant-steps-item .ant-steps-item-wait {
  min-width: 90px;
}

.hide {
  display: none;
}
.show {
  display: block;
}
.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.marginb20 {
  margin-bottom: 24px;
}
.content {
  width: 100%;
  margin: 0 auto;
  margin-bottom: 20px;
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
</style>
