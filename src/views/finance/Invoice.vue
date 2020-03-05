<template>
  <div style="background-color:#F4F5FA;min-height:100vh;">
    <div style="background:white;">
      <FinanceHeaderComponent></FinanceHeaderComponent>
    </div>

    <div class="content" v-if="!loading">
      <div style="background-color:white;">
        <a-row>
          <a-col :lg="{span:24, offset:0}" style="padding: 0 40px;text-align:left;">
            <div style="line-height:40px;">{{this.name}}</div>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <div style="height:9px;border-top:1px solid #E9E9E9;"></div>
          </a-col>
        </a-row>

        <a-row>
          <a-col :lg="{span:20, offset:2}" style="margin-top:20px;padding: 0 40px;">
            <a-tabs
              v-model="activeKey"
              @change="tabChange"
              style="text-align:left;color:rgba(0, 0, 0, 1);"
            >
              <a-tab-pane tab="抬头信息" :key="1">
                <div style="margin-top:45px;padding-bottom:230px;">
                  <a-row>
                    <a-col :span="4" style="text-align:right;">发票类型：</a-col>
                    <a-col
                      :span="16"
                      style="text-align:left;padding-left:14px;"
                    >{{ invoiceTypeText(invoiceInfo.invoice.type) }}</a-col>
                  </a-row>
                  <a-row class="mt24">
                    <a-col :span="4" style="text-align:right;">抬头类型：</a-col>
                    <a-col
                      :span="16"
                      style="text-align:left;padding-left:14px;"
                    >{{ invoiceInfo.invoice.taxpayerType == 1 ? '个人' : '企业' }}</a-col>
                  </a-row>
                  <a-row class="mt24">
                    <a-col :span="4" style="text-align:right;">发票抬头：</a-col>
                    <a-col
                      :span="16"
                      style="text-align:left;padding-left:14px;"
                    >{{ invoiceInfo.invoice.taxpayer }}</a-col>
                  </a-row>
                  <a-row class="mt24" v-if="invoiceInfo.invoice.taxpayerType == 2">
                    <a-col :span="4" style="text-align:right;">纳税人识别号：</a-col>
                    <a-col
                      :span="16"
                      style="text-align:left;padding-left:14px;"
                    >{{ invoiceInfo.invoice.taxpayerNO }}</a-col>
                  </a-row>
                  <a-row class="mt24">
                    <a-col :span="4" style="text-align:right;">发票内容：</a-col>
                    <a-col
                      :span="16"
                      style="text-align:left;padding-left:14px;"
                    >{{ invoiceInfo.invoice.subject }}</a-col>
                  </a-row>
                  <a-row class="mt24">
                    <a-col :span="4" style="text-align:right;">发票金额：</a-col>
                    <a-col
                      :span="16"
                      style="text-align:left;padding-left:14px;"
                    >¥{{ invoiceInfo.invoice.amount }}</a-col>
                  </a-row>

                  <a-row class="mt24">
                    <a-col :offset="4" style="padding-left:14px;">
                      <a-button
                        v-if="invoiceInfo.invoice.type == 2"
                        type="primary"
                        style="margin-right:14px;"
                        @click.native="showInvoicePDF()"
                      >查看电子发票</a-button>
                      <a-button type="default" @click="back()">返回</a-button>
                    </a-col>
                  </a-row>
                </div>
              </a-tab-pane>
              <a-tab-pane tab="收货信息" :key="2">
                <div style="margin-top:45px;padding-bottom:230px;">
                  <a-row>
                    <a-col :span="4" style="text-align:right;">收货人：</a-col>
                    <a-col
                      :span="16"
                      style="text-align:left;padding-left:14px;"
                    >{{ invoiceInfo.addr.receiver }}</a-col>
                  </a-row>
                  <a-row class="mt24">
                    <a-col :span="4" style="text-align:right;">所在地：</a-col>
                    <a-col :span="16" style="text-align:left;padding-left:14px;">
                      <a-cascader
                        :options="areas"
                        :disabled="true"
                        :defaultValue="invoiceInfo.addr.location"
                        style="width: 80%;"
                      />
                    </a-col>
                  </a-row>
                  <a-row class="mt24">
                    <a-col :span="4" style="text-align:right;">详细地址：</a-col>
                    <a-col
                      :span="16"
                      style="text-align:left;padding-left:14px;"
                    >{{ invoiceInfo.addr.detail }}</a-col>
                  </a-row>
                  <a-row class="mt24" v-if="invoiceInfo.invoice.taxpayerType == 1">
                    <a-col :span="4" style="text-align:right;">联系人电话：</a-col>
                    <a-col
                      :span="16"
                      style="text-align:left;padding-left:14px;"
                    >{{ invoiceInfo.addr.tel }}</a-col>
                  </a-row>
                  <a-row class="mt24">
                    <a-col :span="4" style="text-align:right;">业务员：</a-col>
                    <a-col
                      :span="16"
                      style="text-align:left;padding-left:14px;"
                    >{{ invoiceInfo.addr.salesman }}</a-col>
                  </a-row>
                  <a-row class="mt24">
                    <a-col :span="4" style="text-align:right;">业务员联系方式：</a-col>
                    <a-col
                      :span="16"
                      style="text-align:left;padding-left:14px;"
                    >{{ invoiceInfo.addr.salesmanTel }}</a-col>
                  </a-row>
                  <a-row class="mt24">
                    <a-col :span="4" style="text-align:right;">备注：</a-col>
                    <a-col :span="16" style="text-align:left;padding-left:14px;">
                      <a-textarea
                        :disabled="true"
                        :defaultValue="invoiceInfo.addr.comment"
                        :autosize="{ minRows: 2, maxRows: 6 }"
                        style="width: 80%;"
                      />
                    </a-col>
                  </a-row>

                  <a-row class="mt24">
                    <a-col :offset="4" style="padding-left:14px;">
                      <a-button
                        v-if="invoiceInfo.invoice.type == 2"
                        type="primary"
                        style="margin-right:14px;"
                        @click.native="showInvoicePDF()"
                      >查看电子发票</a-button>
                      <a-button type="default" @click="back()">返回</a-button>
                    </a-col>
                  </a-row>
                </div>
              </a-tab-pane>
            </a-tabs>
          </a-col>
        </a-row>
      </div>

      <div style="height:50px;"></div>
    </div>
  </div>
</template>

<script>
// import auth from '../../auth.js'
import areas from "../../utils/areas.json";

import FinanceHeaderComponent from "../../components/finance/Header.vue";
import FinanceService from "../../services/FinanceService";
const FinanceServiceApi = new FinanceService();

export default {
  components: {
    FinanceHeaderComponent
  },
  data() {
    return {
      activeKey: 1,
      loading: true,
      type: "finance",
      name: "发票信息",
      areas: areas,
      orderID: "",
      choiceID: 0,
      invoiceInfo: {
        // invoice: {
        //   type: 1,
        //   taxpayerType: 1,
        //   taxpayer: '111111',
        //   taxpayerNO: 'aaaaaaaaa',
        //   subject: '测试',
        //   amount: '12000.00',
        // },
        // addr: {
        //   receiver: '张三',
        //   location: ['110000', '110100', '110101'],
        //   detail: '测试地区',
        //   tel: '1231313131',
        //   salesman: '李斯',
        //   salesmanTel: '132456789',
        //   comment: '备注信息',
        // },
        // electronicInvoice: 'https://www.google.com',
      }
    };
  },
  methods: {
    invoiceTypeText(type) {
      let text = "";
      switch (type) {
        case 1:
        case "1":
          text = "纸质发票";
          break;
        case 2:
        case "2":
          text = "电子发票";
          break;
      }
      return text;
    },
    tabChange(key) {
      this.activeKey = key;
    },
    showInvoiceInfo(orderID) {
      this.goto(`/invoiceInfo/${orderID}`);
    },
    back() {
      this.goto(`/orderList`);
    },
    showInvoicePDF() {
      // console.log(this.invoiceInfo)
      window.open(this.invoiceInfo.electronicInvoice, "_blank");
    },
    inoviceInfo() {
      FinanceServiceApi.inoviceInfo(this.orderID).then(res => {
        if (res.ret == 0) {
          this.invoiceInfo = res.data;
          this.loading = false;
        } else {
          this.loading = false;
          this.$message.error(res.msg);
          // this.goto('/orderList')
          this.$router.push({
            path: `/orderlist`,
            name: "orderlist",
            params: { active: this.choiceID }
          });
        }
      });
    },
    goto(path) {
      this.$router.push({ path: path });
    }
  },
  created: function() {
    this.orderID = this.$route.params.id;
    this.choiceID = this.$route.params.active;

    if (!this.orderID) {
      this.$router.push({
        path: `/orderlist`,
        name: "orderlist",
        params: { active: this.choiceID }
      });
    }
    this.inoviceInfo();
    // console.log(this.$route);
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mt24 {
  margin-top: 16px;
}

.content {
  min-width: 1080px;
  width: 100%;
  margin-top: 20px;
  padding: 0 100px;
}

.input-suffix {
  display: none;
}
.search-div:hover .input-suffix {
  display: block;
}
</style>

<style>
.ant-btn {
  line-height: 1px;
}
</style>
