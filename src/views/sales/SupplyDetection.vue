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
        <div>
          <toast v-model="show" type="text" width="5.4rem" :time="1200">{{
            errMsg
          }}</toast>
          <!-- <toast v-model="show1" type="success" width="5.4rem" :time="1200">{{ successMsg }}</toast> -->
          <toast
            v-model="showSuccess"
            @on-hide="detailDetection()"
            type="success"
            width="5.4rem"
            :time="800"
          >
            <div style="padding: 0 0.5rem;text-align:center;">
              {{ successMsg }}
            </div>
          </toast>
          <toast v-model="isSusMsg" type="success" width="5.4rem" :time="800">
            <div style="padding: 0 0.5rem;text-align:center;">
              {{ sucMsg }}
            </div>
          </toast>
          <tab
            v-model="step"
            bar-active-color="#108EE9"
            active-color="#108EE9"
            :line-width="2"
            class="tabTap"
          >
            <tab-item @on-item-click="stepChange">患者信息</tab-item>
            <tab-item @on-item-click="stepChange">附件上传</tab-item>
            <tab-item @on-item-click="stepChange">收货信息</tab-item>
            <tab-item @on-item-click="stepChange">样本返还</tab-item>
            <tab-item @on-item-click="stepChange">医生信息</tab-item>
            <tab-item @on-item-click="stepChange">专业诊断</tab-item>
            <tab-item @on-item-click="stepChange">样本信息</tab-item>
          </tab>
          <!-- 患者信息 -->
          <div v-show="step == 0">
            <div class="stepDiv1">
              <group title class="textleft">
                <x-input
                  text-align="right"
                  ref="phoneNum"
                  :readonly="
                    !!orderID && !!patientInfo.phoneNum && order.status >= 3
                  "
                  v-model="patientInfo.phoneNum"
                  placeholder="请填写11位手机号码(必填)"
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
                  :readonly="order.status >= 3"
                  v-model="patientInfo.name"
                  placeholder="请填写姓名(必填)"
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
                  title="性别"
                  ref="gender"
                  :options="genderOpts"
                  v-model="patientInfo.gender"
                  placeholder="请选择性别"
                  required
                  :readonly="order.status >= 3"
                  id="det_sex"
                ></popup-radio>

                <x-input
                  text-align="right"
                  ref="age"
                  mask="999"
                  :max="3"
                  :min="1"
                  @on-blur="ageSet"
                  v-model="patientInfo.age"
                  placeholder="请输入年龄"
                  @on-click-clear-icon="patientInfo.age = ''"
                  :should-toast-error="false"
                  required
                  :readonly="order.status >= 3"
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
                <x-input
                  text-align="right"
                  ref="idCard"
                  title="身份证号码"
                  mask="99999999999999999S"
                  :max="18"
                  :min="18"
                  v-model="patientInfo.idCard"
                  placeholder="请输入身份证号码"
                  :should-toast-error="false"
                  :readonly="order.status >= 3"
                  @on-click-clear-icon="patientInfo.idCard = ''"
                >
                </x-input>

                <x-address
                  title="所在地"
                  ref="location"
                  :list="addressData"
                  placeholder="请选择所在地区"
                  :readonly="order.status >= 3"
                  v-model="patientInfo.location"
                ></x-address>
              </group>
              <!-- <group title="病理报告" class="textleft">
                <div style="margin:15px 0px;">
                  <vux-upload
                    :url="`/reception/api/sales/upload/${orderID}/2`"
                    :headers="upload1.headers"
                    :data="upload1.data"
                    :images="upload1.images"
                    :readonly="false"
                    :max="12"
                    :withCredentials="false"
                    :span="4"
                    :preview="true"
                    @success="onSuccess1"
                    @error="onError1"
                    @remove="onRemove1"
                  ></vux-upload>
                </div>
              </group> -->
              <group title="备注" class="textleft">
                <x-textarea
                  :max="500"
                  v-model="patientInfo.comment"
                  placeholder="备注(选填)"
                  :show-counter="false"
                ></x-textarea>
              </group>
              <div class="mt25">
                <box gap="0px 20px">
                  <x-button @click.native="dealSave">保存</x-button>
                </box>
              </div>
              <div class="mt25">
                <box gap="0px 20px">
                  <x-button
                    type="primary"
                    style="background-color:#1890FF!important;"
                    @click.native="nextStep"
                    >下一步</x-button
                  >
                </box>
              </div>
            </div>
          </div>

          <!-- 附件上传 -->
          <div v-show="step == 1" style="margin-top:44px;">
            <div class="stepDiv5" style="padding-bottom:12px;">
              <group class="textleft">
                <group-title slot="title"
                  >病理图片<b class="required">*</b></group-title
                >
                <div style="margin:15px 10px;">
                  <!-- <vux-upload
                    :url="`/reception/api/sales/upload/${orderID}/5`"
                    :headers="upload1.headers"
                    :data="upload1.data"
                    :images="upload1.images"
                    :readonly="order.status >= 3"
                    :max="12"
                    :withCredentials="false"
                    :span="4"
                    :preview="true"
                    @success="onSuccess1"
                    @error="onError1"
                    @remove="onRemove1"
                  ></vux-upload> -->
                  <div class="clearfix">
                    <a-upload
                      listType="picture-card"
                      :fileList="upload1.images"
                      ref="upload1"
                      :remove="handleRemove"
                      :showUploadList="{
                        showPreviewIcon: false,
                        showRemoveIcon: true
                      }"
                    ></a-upload>
                    <a-upload
                      ref="up"
                      :action="`/reception/api/sales/upload/${orderID}/5`"
                      listType="picture-card"
                      :defaultFileList="upload1.images"
                      @change="handleChange"
                    >
                      <div>
                        <a-icon type="plus" />
                        <div class="ant-upload-text">上传图片</div>
                      </div>
                    </a-upload>
                  </div>
                </div>
              </group>
              <group title="病史图片" class="textleft">
                <div style="margin:15px 10px;">
                  <!-- <vux-upload
                    :url="`/reception/api/sales/upload/${orderID}/1`"
                    :headers="upload2.headers"
                    :data="upload2.data"
                    :images="upload2.images"
                    :readonly="order.status >= 3"
                    :max="12"
                    :withCredentials="false"
                    :span="4"
                    :preview="true"
                    @success="onSuccess2"
                    @error="onError2"
                    @remove="onRemove2"
                  ></vux-upload> -->
                  <div class="clearfix">
                    <a-upload
                      listType="picture-card"
                      :fileList="upload2.images"
                      :remove="handleRemove2"
                      :showUploadList="{
                        showPreviewIcon: false,
                        showRemoveIcon: true
                      }"
                    ></a-upload>
                    <a-upload
                      ref="up"
                      :action="`/reception/api/sales/upload/${orderID}/1`"
                      listType="picture-card"
                      :defaultFileList="upload2.images"
                      @change="handleChange2"
                    >
                      <div>
                        <a-icon type="plus" />
                        <div class="ant-upload-text">上传图片</div>
                      </div>
                    </a-upload>
                  </div>
                </div>
              </group>
              <group title="治疗史图片" class="textleft">
                <div style="margin:15px 10px;">
                  <!-- <vux-upload
                    :url="`/reception/api/sales/upload/${orderID}/2`"
                    :headers="upload3.headers"
                    :data="upload3.data"
                    :images="upload3.images"
                    :readonly="order.status >= 3"
                    :max="12"
                    :withCredentials="false"
                    :span="4"
                    :preview="true"
                    @success="onSuccess3"
                    @error="onError3"
                    @remove="onRemove3"
                  ></vux-upload> -->
                  <div class="clearfix">
                    <a-upload
                      listType="picture-card"
                      :fileList="upload3.images"
                      :remove="handleRemove3"
                      :showUploadList="{
                        showPreviewIcon: false,
                        showRemoveIcon: true
                      }"
                    ></a-upload>
                    <a-upload
                      ref="up"
                      :action="`/reception/api/sales/upload/${orderID}/2`"
                      listType="picture-card"
                      :defaultFileList="upload3.images"
                      @change="handleChange3"
                    >
                      <div>
                        <a-icon type="plus" />
                        <div class="ant-upload-text">上传图片</div>
                      </div>
                    </a-upload>
                  </div>
                </div>
              </group>
              <group title="申请单" class="textleft">
                <div style="margin:15px 10px;">
                  <!-- <vux-upload
                    :url="`/reception/api/sales/upload/${orderID}/3`"
                    :headers="upload4.headers"
                    :data="upload4.data"
                    :images="upload4.images"
                    :readonly="order.status >= 3"
                    :max="12"
                    :withCredentials="false"
                    :span="4"
                    :preview="true"
                    @success="onSuccess4"
                    @error="onError4"
                    @remove="onRemove4"
                  ></vux-upload> -->
                  <div class="clearfix">
                    <a-upload
                      listType="picture-card"
                      :fileList="upload4.images"
                      :remove="handleRemove4"
                      :showUploadList="{
                        showPreviewIcon: false,
                        showRemoveIcon: true
                      }"
                    ></a-upload>
                    <a-upload
                      ref="up"
                      :action="`/reception/api/sales/upload/${orderID}/3`"
                      listType="picture-card"
                      :defaultFileList="upload4.images"
                      @change="handleChange4"
                    >
                      <div>
                        <a-icon type="plus" />
                        <div class="ant-upload-text">上传图片</div>
                      </div>
                    </a-upload>
                  </div>
                </div>
              </group>
              <group title="知情书图片" class="textleft">
                <div style="margin:15px 10px;">
                  <!-- <vux-upload
                    :url="`/reception/api/sales/upload/${orderID}/4`"
                    :headers="upload5.headers"
                    :data="upload5.data"
                    :images="upload5.images"
                    :readonly="order.status >= 3"
                    :max="12"
                    :withCredentials="false"
                    :span="4"
                    :preview="true"
                    @success="onSuccess5"
                    @error="onError5"
                    @remove="onRemove5"
                  ></vux-upload> -->
                  <div class="clearfix">
                    <a-upload
                      listType="picture-card"
                      :fileList="upload5.images"
                      :remove="handleRemove5"
                      :showUploadList="{
                        showPreviewIcon: false,
                        showRemoveIcon: true
                      }"
                    ></a-upload>
                    <a-upload
                      ref="up"
                      :action="`/reception/api/sales/upload/${orderID}/4`"
                      listType="picture-card"
                      :defaultFileList="upload5.images"
                      @change="handleChange5"
                    >
                      <div>
                        <a-icon type="plus" />
                        <div class="ant-upload-text">上传图片</div>
                      </div>
                    </a-upload>
                  </div>
                </div>
              </group>
              <div class="mt25">
                <box gap="0px 20px">
                  <x-button @click.native="dealSave">保存</x-button>
                </box>
              </div>
              <div style="margin-top:20px;">
                <box gap="0px 20px">
                  <x-button
                    type="primary"
                    style="background-color:#1890FF!important;"
                    @click.native="nextStep(2)"
                    >下一步</x-button
                  >
                </box>
              </div>
            </div>
          </div>

          <!-- 收货信息 -->
          <div v-show="step == 2">
            <div class="stepDiv5" style="padding-bottom:12px;">
              <group title class="textleft">
                <popup-radio
                  class="textleft"
                  title="患者关系"
                  id="relaId"
                  ref="receiverType"
                  :readonly="order.status >= 3"
                  :options="[
                    { key: 1, value: '本人' },
                    { key: 2, value: '家属' }
                  ]"
                  v-model="addr.receiverType"
                  @on-click-clear-icon="addr.receiverType = ''"
                  required
                ></popup-radio>
                <x-input
                  text-align="right"
                  ref="receiver"
                  :max="16"
                  :min="2"
                  v-model="addr.receiver"
                  placeholder="请填写收货人姓名"
                  placeholder-align="right"
                  :should-toast-error="false"
                  :readonly="order.status >= 3"
                  @on-click-clear-icon="addr.receiver = ''"
                  required
                >
                  <span slot="label">收货人<b class="required">*</b></span>
                </x-input>

                <x-address
                  title="所在地"
                  ref="addr"
                  :list="addressData"
                  placeholder="请选择所在地区"
                  v-model="addr.addr"
                  :should-toast-error="false"
                  :readonly="order.status >= 3"
                  @on-click-clear-icon="addr.addr = ''"
                ></x-address>

                <x-input
                  text-align="right"
                  ref="detail"
                  :max="120"
                  :min="6"
                  v-model="addr.detail"
                  placeholder="请填写详细收货地址"
                  placeholder-align="right"
                  :should-toast-error="false"
                  :readonly="order.status >= 3"
                  @on-click-clear-icon="addr.detail = ''"
                  required
                >
                  <span slot="label">详细地址<b class="required">*</b></span>
                </x-input>
                <x-input
                  text-align="right"
                  ref="tel"
                  :max="13"
                  :min="6"
                  v-model="addr.tel"
                  placeholder="请填写收货人联系电话"
                  placeholder-align="right"
                  :readonly="order.status >= 3"
                  :should-toast-error="false"
                  @on-click-clear-icon="addr.tel = ''"
                  required
                >
                  <span slot="label">联系电话<b class="required">*</b></span>
                </x-input>
                <popup-radio
                  class="textleft"
                  title="报告语言"
                  ref="language"
                  id="lanId"
                  :options="languageOpts"
                  v-model="addr.language"
                  placeholder="请选择报告语言"
                  :readonly="order.status >= 3"
                  :should-toast-error="false"
                  @on-click-clear-icon="addr.language = ''"
                  required
                ></popup-radio>
              </group>
              <!-- <group title="备注" class="textleft">
                <x-textarea
                  :max="500"
                  v-model="addr.comment"
                  placeholder="备注(选填)"
                  :show-counter="false"
                  ref="comment"
                ></x-textarea>
              </group> -->
              <div class="mt25">
                <box gap="0px 20px">
                  <x-button @click.native="dealSave">保存</x-button>
                </box>
              </div>
              <div class="mt25">
                <box gap="0px 20px">
                  <x-button
                    type="primary"
                    style="background-color:#1890FF!important;"
                    @click.native="nextStep(3)"
                    >下一步</x-button
                  >
                </box>
              </div>
            </div>
          </div>
          <!-- 样本返还 -->
          <div v-show="step == 3">
            <div class="stepDiv5" style="padding-bottom:12px;">
              <group title class="textleft">
                <x-input
                  text-align="right"
                  title="返样接收人"
                  :max="16"
                  :min="2"
                  :readonly="order.status >= 3"
                  v-model="splRreceive.sRSName"
                  placeholder="请填写返样接收人"
                  placeholder-align="right"
                  :should-toast-error="false"
                  @on-click-clear-icon="splRreceive.sRSName = ''"
                  required
                ></x-input>
                <x-input
                  text-align="right"
                  title="接收人联系电话"
                  ref="sRSTel"
                  :max="13"
                  :min="6"
                  :readonly="order.status >= 3"
                  v-model="splRreceive.sRSTel"
                  placeholder="请填写接收人联系电话"
                  placeholder-align="right"
                  :should-toast-error="false"
                  @on-click-clear-icon="splRreceive.sRSTel = ''"
                  required
                ></x-input>
                <x-address
                  title="所在地"
                  ref="sRSArea"
                  :list="addressData"
                  placeholder="请选择所在地区"
                  v-model="splRreceive.sRSArea"
                  :readonly="order.status >= 3"
                  :should-toast-error="false"
                  @on-click-clear-icon="splRreceive.sRSArea = ''"
                ></x-address>
                <x-input
                  text-align="right"
                  title="详细地址"
                  ref="sRSAddr"
                  :max="120"
                  :min="6"
                  :readonly="order.status >= 3"
                  v-model="splRreceive.sRSAddr"
                  placeholder="请填写详细收货地址"
                  placeholder-align="right"
                  :should-toast-error="false"
                  @on-click-clear-icon="splRreceive.sRSAddr = ''"
                  required
                ></x-input>
              </group>
              <div class="mt25">
                <box gap="0px 20px">
                  <x-button @click.native="dealSave">保存</x-button>
                </box>
              </div>
              <div class="mt25">
                <box gap="0px 20px">
                  <x-button
                    type="primary"
                    style="background-color:#1890FF!important;"
                    @click.native="nextStep(4)"
                    >下一步</x-button
                  >
                </box>
              </div>
            </div>
          </div>
          <!-- 医生信息 -->
          <div v-show="step == 4">
            <div class="stepDiv5" style="padding-bottom:12px;">
              <group title class="textleft">
                <x-input
                  text-align="right"
                  title="医生"
                  ref="doctor"
                  :max="16"
                  :min="2"
                  v-model="doctor.name"
                  :readonly="order.status >= 3"
                  placeholder="请填写医生姓名"
                  placeholder-align="right"
                  :should-toast-error="false"
                  @on-click-clear-icon="doctor.name = ''"
                ></x-input>
                <x-input
                  text-align="right"
                  title="科室"
                  ref="deptment"
                  :max="32"
                  :min="2"
                  v-model="doctor.department"
                  placeholder="请填写科室"
                  :readonly="order.status >= 3"
                  placeholder-align="right"
                  :should-toast-error="false"
                  @on-click-clear-icon="doctor.department = ''"
                ></x-input>
                <x-input
                  text-align="right"
                  ref="hospital"
                  :max="32"
                  :min="1"
                  v-model="doctor.hospital"
                  placeholder="请填写医院"
                  :readonly="order.status >= 3"
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
                  <x-button @click.native="dealSave">保存</x-button>
                </box>
                <box gap="20px 20px">
                  <x-button
                    type="primary"
                    style="background-color:#1890FF!important;"
                    @click.native="nextStep(5)"
                    >下一步</x-button
                  >
                </box>
              </div>
            </div>
          </div>

          <!-- 专业诊断 -->
          <div v-show="step == 5" style="margin-top:44px;">
            <div>
              <group title class="textleft">
                <div v-transfer-dom>
                  <popup
                    v-model="diagnosisShow"
                    height="60%"
                    @on-hide="diagnosisInput"
                  >
                    <div>
                      <group>
                        <radio
                          v-model="diagnosisTmp"
                          fill-mode
                          fill-label="其他"
                          fill-placeholder="自定义输入"
                          :options="diagnosisOpts"
                          :readonly="order.status >= 3"
                          @on-change="diagnosisChange"
                          @on-enter="alert(1)"
                        ></radio>
                        <box gap="0px 15px 10px">
                          <x-button
                            type="default"
                            @click.native="diagnosisShow = false"
                            >确定</x-button
                          >
                        </box>
                      </group>
                    </div>
                  </popup>
                </div>

                <x-input
                  text-align="right"
                  :readonly="true"
                  v-model="diagnose.diagnosis"
                  placeholder="请选择临床诊断结果"
                  ref="diagnosis"
                  @click.native="
                    order.status >= 3 ? null : (diagnosisShow = true)
                  "
                  placeholder-align="right"
                  :should-toast-error="false"
                >
                  <span slot="label">临床诊断<b class="required">*</b></span>

                  <template slot="right">
                    <span
                      @click="diagnosisShow = true"
                      class="arrow-right"
                      style="padding-right:10px;padding-left:3px;"
                    ></span>
                  </template>
                </x-input>
              </group>
              <group title="治疗史" class="textleft">
                <x-textarea
                  :max="200"
                  v-model="diagnose.history"
                  @on-focus="textareaFocus('refhistory')"
                  placeholder="本次患病送检前治疗经历(选填)"
                  :show-counter="false"
                  class="refhistory"
                  :readonly="order.status >= 3"
                  ref="history"
                ></x-textarea>
                <!-- <span>{{diagnose}}</span> -->
              </group>
              <group title="疾病史" class="textleft">
                <x-textarea
                  :max="200"
                  @on-focus="textareaFocus('refdisease')"
                  v-model="diagnose.disease"
                  :readonly="order.status >= 3"
                  placeholder="患本疾病前是否有其它病史(选填)"
                  :show-counter="false"
                  ref="disease"
                  class="refdisease"
                ></x-textarea>
              </group>
              <group class="textleft">
                <group-title slot="title"
                  >家族史<b class="required">*</b></group-title
                >
                <x-textarea
                  :max="200"
                  v-model="diagnose.family"
                  @on-focus="textareaFocus('reffamily')"
                  :readonly="order.status >= 3"
                  placeholder="亲属中是否有患本类疾病者"
                  :show-counter="false"
                  ref="family"
                  class="reffamily"
                ></x-textarea>
              </group>
              <group title="病情描述" class="textleft">
                <x-textarea
                  :rows="5"
                  @on-focus="textareaFocus('refdescr')"
                  :readonly="order.status >= 3"
                  v-model="diagnose.descr"
                  placeholder="请详细描述您的症状、疾病和身体状况，便于医生更准确的分析（1-500字），为保护您的隐私，请勿在咨询中透露您的真实姓名、手机号、微信号等信息"
                  :show-counter="false"
                  :max="500"
                  ref="descr"
                  class="refdescr"
                ></x-textarea>
              </group>
              <!-- <group class="textleft">
                <template slot="title">
                  <div style="margin:0.77rem 15px">
                    <div style="font-size:14px;">
                      上传相关图片（检查报告、患处照片、药品等）
                    </div>
                    <div style="color:#999999;">
                      <a @click="guideClick">如何正确拍摄清晰图片？查看指南></a>
                    </div>
                    <div style="margin-top:15px;">病情图片</div>
                  </div>
                </template>
                <div style="margin:15px 0px;">
                  <vux-upload
                    :url="`/reception/api/sales/upload/${orderID}/1`"
                    :headers="upload2.headers"
                    :data="upload2.data"
                    :images="upload2.images"
                    :readonly="false"
                    :max="12"
                    :withCredentials="false"
                    :span="4"
                    :preview="true"
                    @success="onSuccess2"
                    @error="onError2"
                    @remove="onRemove2"
                  ></vux-upload>
                </div>
              </group> -->
              <div class="mt25">
                <box gap="0px 20px">
                  <x-button @click.native="dealSave">保存</x-button>
                </box>
              </div>
              <div class="mt25" style="margin-bottom:25px;">
                <box gap="0px 20px">
                  <x-button
                    type="primary"
                    style="background-color:#1890FF!important;"
                    @click.native="nextStep"
                    >下一步</x-button
                  >
                </box>
              </div>
            </div>
          </div>

          <!-- 样本信息 -->
          <div v-show="step == 6" style="margin-top:94px;">
            <div v-if="samples.length > 0">
              <div>
                <div class="tab-container">
                  <div class="tab-scrollable">
                    <div
                      v-for="index in samples.length"
                      :key="index"
                      style="margin-right:26px;max-width:50px;display:inline-block;"
                      @click="sampleClick(index)"
                    >
                      <div
                        v-if="sampleStep == index"
                        style="background-color:#1890FF;padding: 2px 7px;border-radius:4px;"
                      >
                        <span style="color:white;font-size:14px;"
                          >样本{{ index }}</span
                        >
                      </div>
                      <div v-else style="vertical-align: middle;">
                        <span style="color:#A9A9A9;opacity:1;"
                          >样本{{ index }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style="padding-bottom:24px;margin-top:52px;">
                <div
                  v-for="index in samples.length"
                  :key="index"
                  v-show="index == sampleStep"
                >
                  <group title class="textleft">
                    <!-- <x-input
                      text-align="right"
                      title="样本条码"
                      :ref="`barcode${index}`"
                      class="barcodeInput"
                      placeholder="扫描或填写样本条形码"
                      :max="22"
                      :min="10"
                      :show-clear="false"
                      v-model="samples[sampleStep-1]['barcode']"
                      placeholder-align="right"
                      :should-toast-error="false"
                    >
                      <template slot="right">
                        <div style="padding-left:8px;display:inline-block;" @click="wxscan">
                          <img style="width:23px;height:23px;" src="/img/scan.png" />
                        </div>
                      </template>
                    </x-input>-->

                    <!-- <popup-radio
                      class="textleft"
                      title="样本类型"
                      :ref="`tumorSliceType${index}`"
                      :options="tumorSliceTypeOpts"
                      v-model="samples[sampleStep-1]['tumorSliceType']"
                      placeholder="请选择样本类型"
                    >
                    </popup-radio>-->
                    <popup-picker
                      :data="tumorSliceTypeOpts"
                      :columns="2"
                      v-model="samples[sampleStep - 1]['tumorSliceType']"
                      placeholder="请选择样本类型"
                      :ref="`tumorSliceType${index}`"
                      show-name
                      :disabled="order.status >= 3"
                    >
                      <template slot="title"
                        >样本类型<b class="required">*</b></template
                      >
                    </popup-picker>

                    <x-input
                      text-align="right"
                      :ref="`num${index}`"
                      mask="99"
                      :max="2"
                      :min="1"
                      :value="samples[sampleStep - 1]['num']"
                      @on-blur="sampleNum($event, sampleStep - 1)"
                      placeholder="请填写样本数量"
                      :should-toast-error="false"
                      @on-click-clear-icon="samples[sampleStep - 1]['num'] = ''"
                      required
                      :readonly="order.status >= 3"
                    >
                      <span slot="label"
                        >样本数量<b class="required">*</b></span
                      >
                    </x-input>

                    <x-input
                      text-align="right"
                      :ref="`tumorSlicePosition${index}`"
                      placeholder="请输入取材位置"
                      :value="samples[sampleStep - 1]['tumorSlicePosition']"
                      @on-blur="
                        sampleTumorSlicePosition($event, sampleStep - 1)
                      "
                      placeholder-align="right"
                      :should-toast-error="false"
                      :min="1"
                      :max="16"
                      @on-click-clear-icon="
                        samples[sampleStep - 1]['tumorSlicePosition'] = ''
                      "
                      required
                    >
                      <span slot="label"
                        >取材位置<b class="required">*</b></span
                      >
                    </x-input>

                    <x-input
                      text-align="right"
                      :ref="`no${index}`"
                      title="病理编号"
                      :value="samples[sampleStep - 1]['no']"
                      @on-blur="sampleSno($event, sampleStep - 1)"
                      placeholder="请输入病理编号"
                      placeholder-align="right"
                      :min="1"
                      :max="16"
                      class="code"
                      type="text"
                      :readonly="order.status >= 3"
                      @on-click-clear-icon="samples[sampleStep - 1]['no'] = ''"
                    >
                    </x-input>
                    <!-- <span>{{index}}</span> -->
                    <x-input
                      text-align="right"
                      title="肿瘤细胞含量"
                      :ref="`cellPercent${index}`"
                      mask="99"
                      :value="samples[sampleStep - 1]['cellPercent']"
                      @on-blur="sampleCellPercent($event, sampleStep - 1)"
                      :max="2"
                      placeholder="请输入肿瘤细胞含量(选填)"
                      :readonly="order.status >= 3"
                      placeholder-align="right"
                      @on-click-clear-icon="
                        samples[sampleStep - 1]['cellPercent'] = ''
                      "
                    >
                      <template slot="right">
                        <div
                          v-if="samples[sampleStep - 1]['cellPercent']"
                          style="display:inline-block;float:left;"
                        >
                          <span style="color:#2C3E50;">%</span>
                        </div>
                      </template>
                    </x-input>

                    <popup-radio
                      class="textleft samRadio"
                      title="正常对照样本"
                      :ref="`compareSample${index}`"
                      :readonly="order.status >= 3"
                      :options="[
                        { key: 1, value: '是' },
                        { key: 2, value: '否' }
                      ]"
                      v-model="samples[sampleStep - 1]['compareSample']"
                      placeholder="请选择是否"
                    >
                      <span slot="title"
                        >正常对照样本<b class="required">*</b></span
                      >
                    </popup-radio>

                    <popup-radio
                      class="textleft"
                      title="样本状态"
                      :ref="`sampleStatus${index}`"
                      :readonly="order.status >= 3"
                      :options="[
                        { key: 1, value: '正常' },
                        { key: 2, value: '异常' }
                      ]"
                      v-model="samples[sampleStep - 1]['sampleStatus']"
                      placeholder="请选择正常与异常"
                    >
                    </popup-radio>

                    <x-input
                      v-show="samples[sampleStep - 1]['sampleStatus'] == 2"
                      :readonly="order.status >= 3"
                      text-align="right"
                      title="异常原因"
                      :ref="`abnormal${index}`"
                      placeholder="请填写异常原因"
                      :value="samples[sampleStep - 1]['abnormal']"
                      @on-blur="sampleAbnormal($event, sampleStep - 1)"
                      @on-click-clear-icon="
                        samples[sampleStep - 1]['abnormal'] = ''
                      "
                    ></x-input>

                    <datetime
                      v-model="samples[sampleStep - 1]['simplingDate']"
                      placeholder="请选择采样日期(选填)"
                      :ref="`simplingDate${index}`"
                      :readonly="order.status >= 3"
                    >
                      <span slot="title"
                        >采样日期<b class="required">*</b></span
                      >
                    </datetime>
                    <group title="样本备注" class="textleft">
                      <x-textarea
                        :max="500"
                        @on-focus="keyboardFocus"
                        @on-blur="keyboardBlur"
                        v-model="samples[sampleStep - 1]['sRemark']"
                        placeholder="请简单描述样本情况(选填)"
                        :show-counter="false"
                        :ref="`sampleComment`"
                      ></x-textarea>
                    </group>
                  </group>
                </div>
                <!-- <group title="样本备注" class="textleft">
                  <x-textarea
                    :max="500"
                    @on-focus="keyboardFocus"
                    @on-blur="keyboardBlur"
                    v-model="sampleComment"
                    placeholder="请简单描述样本情况(选填)"
                    :show-counter="false"
                    :ref="`sampleComment`"
                  ></x-textarea>
                </group>-->
              </div>
            </div>
            <div v-else style="padding: 30vh 0;color:#D9D9D9;">暂无样本</div>
            <div class="mt25">
              <box gap="0px 20px">
                <x-button
                  type="primary"
                  style="background-color:#1890FF!important;"
                  @click.native="handleSubmit"
                  >提交</x-button
                >
              </box>
              <box gap="16px 20px">
                <x-button @click.native="dealSave">保存</x-button>
              </box>
              <box gap="16px 20px">
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
        <OrderDetailComponent
          :data="detailData"
          :order="{ detail: false }"
        ></OrderDetailComponent>
        <div class="mt25 mb37">
          <box gap="0px 20px">
            <x-button
              type="primary"
              @click.native="preview = false"
              style="background-color:#1890FF!important;"
              >确认</x-button
            >
          </box>
        </div>
      </div>

      <div v-if="submitDetail">
        <OrderDetailComponent
          :data="detailData"
          :order="{
            detail: true,
            orderID: order.orderID,
            orderDate: order.orderDate
          }"
        ></OrderDetailComponent>
        <div class="mt25 mb37">
          <box gap="0px 20px">
            <x-button
              type="primary"
              @click.native="detailClick"
              style="background-color:#1890FF!important;"
              >确认</x-button
            >
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
  language:
    zh-CN: 请选择报告语言
  name:
    zh-CN: 请输入2-16位长度的姓名
  age:
    zh-CN: 请输入年龄
  idCard:
    zh-CN: 请输入18位身份证号码
  email:
    zh-CN: 请输入正确邮箱如：123456@qq.com
  diagnosis:
    zh-CN: 请选择或输入临床诊断结果
  receiver:
    zh-CN: 请输入收货人信息
  detail:
    zh-CN: 请输入详细收货地址
  tel:
    zh-CN: 请输入收货人联系电话
  barcode:
    zh-CN: 请输入样本条码
  location:
    zh-CN: 请选择所在地区
  doctorID:
    zh-CN: 请选择主治医生
  hospital:
    zh-CN: 请输入医院名称
  history:
    zh-CN: 请输入治疗史信息
  family:
    zh-CN: 请输入家族史信息
  descr:
    zh-CN: 请填写（1-500字）病情信息
  no:
    zh-CN: 请输入样本病理编号
  addr:
    zh-CN: 请输入收货地址
  tumorSliceType:
    zh-CN: 请选择样本类型
  compareSample:
    zh-CN: 请选择正常对照样本
  num:
    zh-CN: 请填写样本数量
  sampleStatus:
    zh-CN: 请选择样本状态
  abnormal:
    zh-CN: 请填写异常原因
  tumorSliceType:
    zh-CN: 请选择样本类型
  tumorSlicePosition:
    zh-CN: 请输入取材位置
  simplingDate:
    zh-CN: 请选择采样日期
</i18n>

<script>
import auth from "../../auth.js";

import OrderDetailComponent from "../../components/sales/OrderDetail";
import {
  InlineLoading,
  TransferDom,
  Popup,
  Radio,
  Group,
  Box,
  XButton,
  XInput,
  Toast,
  Tab,
  TabItem,
  PopupRadio,
  PopupPicker,
  XTextarea,
  Datetime,
  ChinaAddressV4Data,
  XAddress,
  GroupTitle,
  Value2nameFilter as value2name
} from "vux";
import VuxUpload from "vux-upload";
const cloneDeep = require("clone-deep");
import SalesService from "../../services/SalesService";
const SalesServiceApi = new SalesService();
import LabUploadComponent from "../../components/lab/Upload.vue";

export default {
  directives: {
    TransferDom
  },
  components: {
    InlineLoading,
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
    PopupPicker,
    // Search,
    // Flexbox,
    // FlexboxItem,
    // Icon,
    XTextarea,
    VuxUpload,
    Datetime,
    XAddress,
    GroupTitle,
    LabUploadComponent
    // Masker
  },
  data() {
    return {
      orderInfo: {
        pathology: []
      },
      focusedInput: "",
      loading: true,
      focusedTextarea: "",
      sampleStep: 1,
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
      orderID: "",
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
      splRreceive: {
        sRSName: "",
        sRSTel: "",
        sRSArea: [],
        sRSAddr: ""
      },
      sampleComment: "",
      samples: [],
      pay: {},
      addr: {
        receiver: "",
        addr: [],
        detail: "",
        tel: "",
        comment: "",
        language: "",
        receiverType: ""
      },
      order: {
        orderID: "",
        orderDate: "",
        price: ""
      },
      data: [],
      pathology: [],
      pHisImages: [],
      treatHisImages: [],
      applyImages: [],
      letterImages: [],
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
      languageOpts: [
        {
          key: 1,
          value: "中文报告"
        },
        {
          key: 2,
          value: "英文报告"
        }
      ],
      compareSampleOpts: [],
      tumorSliceTypeOpts: [],
      sampleStatusOpts: [],
      addressData: ChinaAddressV4Data,
      upload1: {
        headers: {},
        data: {
          id: 1
        },
        images: []
      },
      upload2: {
        headers: {},
        data: {
          id: 1
        },
        images: []
      },
      upload3: {
        headers: {},
        data: {
          id: 1
        },
        images: []
      },
      upload4: {
        headers: {},
        data: {
          id: 1
        },
        images: []
      },
      upload5: {
        headers: {},
        data: {
          id: 1
        },
        images: []
      },
      show: false,
      show1: false,
      showSuccess: false,
      successMsg: "",
      errMsg: "",
      previewVisible: false,
      previewImage: "",
      fileList: [
        // {
        //   uid: "-1",
        //   name: "xxx.png",
        //   status: "done",
        //   url:
        //     "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        // }
      ],
      isSusMsg: false,
      sucMsg: ""
    };
  },
  watch: {
    // step: function() {
    //   // console.log(oldValue, newValue);

    // },
    doctorItemClicked: function(newValue, oldValue) {
      // console.log(oldValue, newValue);
      this.$store.commit("setDetectionStep2ItemClicked", newValue);
    },
    step: {
      handler: function(newValue, oldValue) {
        this.$store.commit("setDetectionStep", newValue);
        if (newValue == 6) {
          let samRadio = document.querySelectorAll(".samRadio .vux-label");
          let span = document.createElement("span");
          span.innerHTML = "*";
          span.style.color = "red";
          samRadio[0].appendChild(span);
        }
        if (newValue == 2) {
          let relaId = document.querySelector("#relaId .vux-label");
          let lanId = document.querySelector("#lanId .vux-label");
          // console.log(samRadio);
          let span = document.createElement("span");
          span.innerHTML = "*";
          span.style.color = "red";
          relaId.appendChild(span);
          lanId.appendChild(span);
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    sampleClick(index) {
      this.sampleStep = index;
      let samRadio = document.querySelectorAll(".samRadio .vux-label");
      let span = document.createElement("span");
      span.innerHTML = "*";
      span.style.color = "red";
      if (samRadio[index - 1].children.length == 0) {
        samRadio[index - 1].appendChild(span);
      }
    },
    uploadImages(images) {
      this.upload1.images = cloneDeep(images);
    },
    handleCancel() {
      this.previewVisible = false;
    },
    handleRemove(file) {
      SalesServiceApi.deleteImage(this.orderID, file.uid).then(res => {
        if (res.ret == 0) {
          this.upload1.images.forEach((v, i) => {
            if (v.uid === file.uid) {
              this.upload1.images.splice(i, 1);
            }
          });
          this.sucMsg = res.msg;
          this.isSusMsg = true;
        } else {
          this.errMsg = "删除失败";
          this.show = true;
        }
      });
      // this.upload1.images.splice(index, 1);
    },
    handleChange({ file }) {
      console.log(file);
      if (file.status === "uploading") {
        return;
      } else if (file.status === "done") {
        this.$message.success("上传成功");
        this.upload1.images.push(file.response);
      }
    },
    handleRemove2(file) {
      SalesServiceApi.deleteImage(this.orderID, file.uid).then(res => {
        if (res.ret == 0) {
          this.upload2.images.forEach((v, i) => {
            if (v.uid === file.uid) {
              this.upload2.images.splice(i, 1);
            }
          });
          this.sucMsg = res.msg;
          this.isSusMsg = true;
        } else {
          this.errMsg = "删除失败";
          this.show = true;
        }
      });
    },
    handleChange2({ file }) {
      console.log(file);
      if (file.status === "uploading") {
        return;
      } else if (file.status === "done") {
        this.$message.success("上传成功");
        this.upload2.images.push(file.response);
      }
    },
    handleRemove3(file) {
      SalesServiceApi.deleteImage(this.orderID, file.uid).then(res => {
        if (res.ret == 0) {
          this.upload3.images.forEach((v, i) => {
            if (v.uid === file.uid) {
              this.upload3.images.splice(i, 1);
            }
          });
          this.sucMsg = res.msg;
          this.isSusMsg = true;
        } else {
          this.errMsg = "删除失败";
          this.show = true;
        }
      });
    },
    handleChange3({ file }) {
      console.log(file);
      if (file.status === "uploading") {
        return;
      } else if (file.status === "done") {
        this.$message.success("上传成功");
        this.upload3.images.push(file.response);
      }
    },
    handleRemove4(file) {
      SalesServiceApi.deleteImage(this.orderID, file.uid).then(res => {
        if (res.ret == 0) {
          this.upload4.images.forEach((v, i) => {
            if (v.uid === file.uid) {
              this.upload4.images.splice(i, 1);
            }
          });
          this.sucMsg = res.msg;
          this.isSusMsg = true;
        } else {
          this.errMsg = "删除失败";
          this.show = true;
        }
      });
    },
    handleChange4({ file }) {
      console.log(file);
      if (file.status === "uploading") {
        return;
      } else if (file.status === "done") {
        this.$message.success("上传成功");
        this.upload4.images.push(file.response);
      }
    },
    handleRemove5(file) {
      SalesServiceApi.deleteImage(this.orderID, file.uid).then(res => {
        if (res.ret == 0) {
          this.upload5.images.forEach((v, i) => {
            if (v.uid === file.uid) {
              this.upload5.images.splice(i, 1);
            }
          });
          this.sucMsg = res.msg;
          this.isSusMsg = true;
        } else {
          this.errMsg = "删除失败";
          this.show = true;
        }
      });
    },
    handleChange5({ file }) {
      console.log(file);
      if (file.status === "uploading") {
        return;
      } else if (file.status === "done") {
        this.$message.success("上传成功");
        this.upload5.images.push(file.response);
      }
    },
    appendSample() {
      if (this.samples.length >= 2) {
        this.errMsg = "最多只能存在2个样本";
        this.show = true;
      } else {
        const samples = [...this.samples];
        samples.push({
          barcode: "",
          tumorSliceType: "",
          num: "",
          tumorSlicePosition: "",
          no: "",
          cellPercent: "",
          compareSample: "",
          sampleStatus: "",
          abnormal: "",
          simplingDate: ""
        });
        this.samples = samples;
        this.sampleStep = samples.length;
      }
    },
    deleteSample() {
      this.$confirm({
        title: "删除",
        width: "200",
        content: "确定删除当前样本？",
        okText: "删除",
        cancelText: "取消",
        onOk: () => {
          const samples = [...this.samples];
          samples.splice(this.sampleStep - 1, 1);
          this.samples = samples;
          this.sampleStep = samples.length;
        }
      });
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
      // console.log('blur')
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
            return true;
          } else {
            return false;
          }
        });
      }
    },
    guideClick() {
      this.goto("/guide");
    },
    stepChange() {},
    nextStep() {
      if (this.validate(this.step)) {
        this.step += 1;
      }
    },
    previewDetection() {
      // if (this.allValidate()) {
      this.detailData = {
        pay: this.pay,
        order: this.order,
        pathology: this.fileList,
        patientInfo: this.patientInfo,
        doctor: this.doctor,
        samples: this.samples,
        sampleComment: this.sampleComment,
        addr: this.addr,
        diagnose: this.diagnose,
        item: this.projectItem,
        opts: {
          compareSampleOpts: this.compareSampleOpts,
          tumorSliceTypeOpts: this.tumorSliceTypeOpts
        }
      };
      // console.log(this.detailData)
      this.preview = true;
      // }
    },
    detailDetection() {
      this.detailData = {
        pay: this.pay,
        order: this.order,
        pathology: this.fileList,
        patientInfo: this.patientInfo,
        doctor: this.doctor,
        samples: this.samples,
        sampleComment: this.sampleComment,
        addr: this.addr,
        diagnose: this.diagnose,
        item: this.projectItem,
        opts: {
          compareSampleOpts: this.compareSampleOpts,
          tumorSliceTypeOpts: this.tumorSliceTypeOpts
        }
      };

      this.submitDetail = true;
    },
    handleSubmit() {
      // console.log(this.samples);
      if (this.allValidate()) {
        SalesServiceApi.supplyOrder(this.orderID, {
          pathology: this.upload1.images,
          pHisImages: this.upload2.images,
          treatHisImages: this.upload3.images,
          applyImages: this.upload4.images,
          letterImages: this.upload5.images,
          patientInfo: this.patientInfo,
          doctor: this.doctor,
          samples: this.samples,
          sampleComment: this.sampleComment,
          addr: this.addr,
          diagnose: this.diagnose,
          itemID: this.projectItem.id,
          orderID: this.orderID,
          splRreceive: this.splRreceive
        }).then(res => {
          if (res.ret == 0) {
            this.successMsg = "预约成功";
            this.showSuccess = true;
            this.order.orderID = res.data.orderID;
            this.order.orderDate = res.data.orderDate;
            // clear cache
            auth.clearDetectionTmp();
          } else {
            this.errMsg = res.msg;
            this.show = true;
          }
        });
      }
    },
    // 保存
    dealSave() {
      SalesServiceApi.supplySave(this.orderID, {
        pathology: this.upload1.images,
        pHisImages: this.upload2.images,
        treatHisImages: this.upload3.images,
        applyImages: this.upload4.images,
        letterImages: this.upload5.images,
        patientInfo: this.patientInfo,
        doctor: this.doctor,
        samples: this.samples,
        sampleComment: this.sampleComment,
        addr: this.addr,
        diagnose: this.diagnose,
        itemID: this.projectItem.id,
        orderID: this.orderID,
        splRreceive: this.splRreceive
      }).then(res => {
        if (res.ret == 0) {
          this.sucMsg = "保存成功";
          this.isSusMsg = true;
          this.order.orderID = res.data.orderID;
          this.order.orderDate = res.data.orderDate;
          // clear cache
          auth.clearDetectionTmp();
        } else {
          this.errMsg = res.msg;
          this.show = true;
        }
      });
    },
    doctorSearchFocus() {
      this.doctorItemClicked = false;
    },
    doctorSearchCancel() {
      // this.$refs.doctorID.onFocus()
      this.doctorItemClicked = true;
    },
    detailClick() {
      this.submitDetail = false;
      this.goto("/sales/");
    },
    allValidate() {
      if (this.validate(6)) {
        if (this.validate(5)) {
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
            this.step = 4;
          }
        } else {
          this.step = 5;
        }
      } else {
        this.step = 6;
      }

      return false;
    },
    getName(value) {
      return value2name(value, ChinaAddressV4Data);
    },
    onSuccess1(res) {
      console.log(res);
      // this.fileList.push(res);
      this.upload1.images.push(res);
      this.pathology = this.upload1.images;
    },
    onError1(e) {
      // console.log(8888, e.message);
    },

    onRemove1(index) {
      this.upload1.images.splice(index, 1);
    },
    onSuccess2(res) {
      this.upload2.images.push(res);
      this.diagnose.images = this.upload2.images;
    },
    onError2(e) {
      // console.log(8888, e.message);
    },
    onRemove2(index) {
      this.upload2.images.splice(index, 1);
    },
    onSuccess3(res) {
      this.upload3.images.push(res);
      // this.diagnose.images = this.upload2.images;
    },
    onError3(e) {
      // console.log(8888, e.message);
    },
    onRemove3(index) {
      this.upload3.images.splice(index, 1);
    },
    onSuccess4(res) {
      this.upload4.images.push(res);
      // this.diagnose.images = this.upload2.images;
    },
    onError4(e) {
      // console.log(8888, e.message);
    },
    onRemove4(index) {
      this.upload4.images.splice(index, 1);
    },
    onSuccess5(res) {
      this.upload5.images.push(res);
      // this.diagnose.images = this.upload2.images;
    },
    onError5(e) {
      // console.log(8888, e.message);
    },
    onRemove5(index) {
      this.upload5.images.splice(index, 1);
    },
    validate(step) {
      let obs = [];
      let ignores = [];
      if (step == 0) {
        obs.push(this.patientInfo);
        ignores = ["location", "email", "idCard", "comment"];
      } else if (step == 4) {
        obs = [{ hospital: this.doctor.hospital }];
      } else if (step == 5) {
        obs = [];
      } else if (step == 6) {
        obs = this.samples.map(sample => {
          return {
            tumorSliceType: sample.tumorSliceType,
            num: sample.num,
            compareSample: sample.compareSample,
            tumorSlicePosition: sample.tumorSlicePosition,
            simplingDate: sample.simplingDate
          };
        });
      } else if (step == 2) {
        obs = [
          {
            receiver: this.addr.receiver,
            receiverType: this.addr.receiverType,
            detail: this.addr.detail,
            tel: this.addr.tel,
            language: this.addr.language
          }
        ];
      }

      let bflag = false;

      //必须只能有 1个异常样本
      // if (step == 4) {
      //   const targets = this.samples.filter(sample => sample.compareSample == 2)
      //   if (targets.length < 1) {
      //     this.errMsg = '必须有一个异常样本'
      //     this.show = true
      //     return false
      //   } else if (targets.length > 1) {
      //     this.errMsg = '只能有一个异常样本'
      //     this.show = true
      //     return false
      //   }
      // }
      for (let i = 0; i < obs.length; i++) {
        if (step == 6) {
          this.sampleStep = i + 1;
          let samRadio = document.querySelectorAll(".samRadio .vux-label");
          let span = document.createElement("span");
          span.innerHTML = "*";
          span.style.color = "red";
          if (samRadio[i].children.length == 0) {
            samRadio[i].appendChild(span);
          }
          console.log(samRadio, "samRadio");
        }
        const ob = obs[i];
        for (let key in ob) {
          if (!ob.hasOwnProperty(key)) {
            continue;
          }
          if (ignores.includes(key)) {
            continue;
          }

          if (
            key == "abnormal" &&
            ob.hasOwnProperty("sampleStatus") &&
            ob.sampleStatus != 2
          ) {
            continue;
          }
          console.log(this.sampleStep, "stepsm", obs);
          let ele = this.$refs[key] || this.$refs[`${key}${this.sampleStep}`];
          let val = ele.value || ob[key];
          if (
            (ele.hasOwnProperty("valid") && !ele.valid) ||
            (key == "diagnosis" && !val)
          ) {
            if (ele.hasOwnProperty("onBlur")) {
              ele.onBlur();
              this.errMsg = this.$t(`${key}`);
              this.show = true;
            }
            bflag = true;
            break;
          }
          if (!ele.hasOwnProperty("valid") && (!val || val.length == 0)) {
            if (key == "tumorSlicePosition") {
              this.errMsg = "请填写取材位置";
            } else if (key == "simplingDate") {
              this.errMsg = "请选择采样日期";
            } else {
              this.errMsg = this.$t(`${key}`);
            }
            this.show = true;
            bflag = true;
            break;
          }
        }
        if (bflag) {
          break;
        }
      }
      if (bflag) {
        return false;
      }

      if (step == 1) {
        if (this.upload1.images.length < 1) {
          this.errMsg = "请上传病理图片";
          this.show = true;
          return;
        }
      }
      console.log(this.diagnose);
      if (step == 5) {
        if (this.diagnose.diagnosis == "") {
          this.errMsg = "请选择临床诊断";
          this.show = true;
          return;
        }
        if (this.diagnose.family == null) {
          this.errMsg = "请输入家族史";
          this.show = true;
          return;
        }
      }

      if (step == 6) {
        console.log(this.samples, "=-=-=-=-=", step);
        // this.samples.forEach(v => {
        //   if (v.tumorSlicePosition == "" || v.tumorSlicePosition == null) {
        //     this.errMsg = "请输入取材位置";
        //     this.show = true;
        //     return;
        //   }
        // });
        auth.cacheDetectionTmp(step, obs);
      } else {
        auth.cacheDetectionTmp(step, obs[0]);
      }
      return true;
    },
    filter(val) {
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
          this.projectItem.id = res.data.id;
          this.projectItem.amount = res.data.discountPrice;
          this.projectItem.name = res.data.itemName;
        } else {
          this.goto("/projects/unpaid");
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
        } else if (i == 4) {
          this.doctor = tmp;
        } else if (i == 5) {
          this.diagnose = tmp;
        } else if (i == 6) {
          this.samples = tmp;
        } else if (i == 2) {
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
            jsApiList: ["scanQRCode"] // 必填，需要使用的JS接口列表
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
        scanType: ["barCode"], // 可以指定扫二维码还是一维码，默认二者都有 qrCode
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
        let el = document.querySelector(".stepDiv1");
        el.classList.add("stepDiv1Pad");
        this.keyboardScroll();
      }
    },
    emailBlur() {
      let el = document.querySelector(".stepDiv1");
      el.classList.remove("stepDiv1Pad");
    },
    keyboardFocus() {
      let u = navigator.userAgent;
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
        let el = document.querySelector(".stepDiv5");
        el.classList.add("stepDiv5Pad");
        this.keyboardScroll();
      }
    },
    keyboardBlur() {
      let el = document.querySelector(".stepDiv5");
      el.classList.remove("stepDiv5Pad");
    },
    keyboardScroll() {
      let el = document.querySelector(".appDiv");
      let h = el.scrollHeight;
      el.scrollTop = h;
    },
    textareaFocus(classname) {
      this.focusedTextarea = classname;
      // console.log(classname);
    },
    // inputFocus(classname) {
    //   this.focusedInput = classname;
    //   // console.log(this.focusedInput);
    //   let inputEl = document.querySelector(`.${this.focusedInput} .weui-input`);

    //   console.log(inputEl)
    //   inputEl.addEventListener("keyup", function() {
    //     inputEl.focus();
    //     console.log(88)
    //   });
    //   inputEl.addEventListener("keydown", function() {
    //     inputEl.focus();
    //     console.log(88)
    //   });
    // },
    pagemove() {
      let el = document.querySelector(".appDiv");
      el.addEventListener("touchmove", () => {
        // console.log(el);
        if (this.focusedTextarea) {
          let el1 = document.querySelector(
            `.${this.focusedTextarea} .weui-textarea`
          );
          el1.blur();
        }
      });
    },
    sampleSno(e, index) {
      // console.log(e);
      this.$set(this.samples[index], "no", e);
    },
    sampleCellPercent(e, index) {
      this.$set(this.samples[index], "cellPercent", e);
    },
    sampleNum(e, index) {
      this.$set(this.samples[index], "num", e);
    },
    sampleTumorSlicePosition(e, index) {
      this.$set(this.samples[index], "tumorSlicePosition", e);
    },
    sampleAbnormal(e, index) {
      this.$set(this.samples[index], "abnormal", e);
    }
  },
  created: function() {
    // this.appendSample()
  },
  mounted: function() {
    let sexRadio = document.querySelector("#det_sex .vux-label");
    let span = document.createElement("span");
    span.innerHTML = "*";
    span.style.color = "red";
    sexRadio.appendChild(span);
    // samRadio.appendChild(span);
    this.upload1.headers = {
      UserRole: "BDLS_DAS_SALES"
    };
    this.upload2.headers = {
      UserRole: "BDLS_DAS_SALES"
    };
    auth.clearDetectionTmp();
    this.$nextTick(function() {
      let pid = this.$route.params.id;
      if (!pid) {
        this.goto("/projects");
        return;
      }
      this.orderID = this.$route.query.orderID;
      if (this.orderID) {
        SalesServiceApi.GetInfoByOrderID(this.orderID).then(res => {
          if (res.ret == 0) {
            // set defualt value 只设置 step = 0 and step= 4
            this.patientInfo = res.data.patientInfo;
            this.order = res.data.order;
            this.addr = res.data.addr;
            this.orderInfo = res.data;
            this.samples = res.data.samples;
            this.doctor = res.data.doctor;
            this.upload1.images = res.data.pathology;
            console.log(this.upload1.images, "0-0");
            this.upload2.images = res.data.pHisImages;
            this.upload3.images = res.data.treatHisImages;
            this.upload4.images = res.data.applyImages;
            this.upload5.images = res.data.letterImages;
            this.diagnose = res.data.diagnose;
            this.pay = res.data.pay;
            this.splRreceive = res.data.splRreceive;
          }
        });
      }
      this.getOpts();
      this.getProjectItem(pid);
      // this.wxConfig()

      //设置默认值
      // this.setCacheDefault()

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
.tabTap {
  position: fixed;
  top: 0;
  height: 44px;
  width: 100%;
  z-index: 9999;
}
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
  margin-top: 40px;
}
.stepDiv5 {
  margin-top: 40px;
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
.required {
  color: red;
}
</style>
