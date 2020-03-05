<template>
  <div style="background-color:#F4F5FA;min-height:100vh;">
    <div style="background:white;">
      <FinanceHeaderComponent></FinanceHeaderComponent>
    </div>

    <div class="content">
      <div style="background-color:white;">
        <a-row>
          <a-col :lg="{span:24, offset:0}" style="padding: 0 40px;text-align:left;">
            <div
              :class="activeKey == 0 ? 'wait2do tab-active' : 'wait2do' "
              @click="tabChange(0)"
            >代办</div>
            <div
              :class="activeKey == 1 ? 'alreadydo tab-active' : 'alreadydo'"
              @click="tabChange(1)"
            >已办</div>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <div style="height:9px;border-top:1px solid #E9E9E9;"></div>
          </a-col>
        </a-row>

        <a-row>
          <a-col :lg="{span:24, offset:0}" style="padding:0 40px;">
            <div
              style="border:1px solid #E9E9E9;background-color:#FAFAFA;margin-top:14px;border-radius:3px;padding:20px 0"
            >
              <a-row>
                <a-col :lg="{span:24, offset:0}" style="text-align:left;padding-left:16px;">
                  <a-select v-model="searchType" style="width:12%;">
                    <a-select-option value="1">条形码</a-select-option>
                    <a-select-option value="2">姓名</a-select-option>
                  </a-select>
                  <a-input
                    v-model="searchText"
                    maxlength="36"
                    placeholder="请输入搜索条件"
                    class="search-div"
                    style="width: 30%;margin-left:14px;max-width:360px;"
                  >
                    <template slot="suffix">
                      <a-icon
                        class="input-suffix"
                        @click="searchText=''"
                        style="font-size:13px;color:#E9E9E9;cursor:pointer;background-color:white;"
                        type="close-circle"
                      />
                    </template>
                  </a-input>
                  <a-button type="primary" @click="search" style="margin-left:20px;">查询</a-button>
                </a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>

        <a-row>
          <a-col :lg="{span:24, offset:0}" style="margin-top:20px;padding: 0 40px;">
            <a-table
              :columns="columns"
              :dataSource="orders[activeKey]"
              style="border-top:1px solid #E9E9E9;border-left:1px solid #E9E9E9;border-right:1px solid #E9E9E9;"
              :pagination="false"
              rowKey="id"
            >
              <a slot="action" slot-scope="record">
                <div v-if="activeKey == 0" style="text-align:left;">
                  <a @click="showInvoiceInfo(record.orderID)">查看发票信息</a>
                  <a style="margin: 0 12px;" @click="confirmInvoice(record)">确认开票</a>
                  <a-upload
                    v-if="record.invoiceStatus == 3"
                    name="file"
                    :action="`/reception/api/finance/invoice/upload/${record.orderID}/3`"
                    :withCredentials="true"
                    :showUploadList="false"
                    :headers="headers"
                    @change="(info) => handleUploadChange(info, record)"
                    :beforeUpload="beforeUpload"
                  >
                    <a>上传电子发票</a>
                  </a-upload>
                </div>
                <div v-else>
                  <a @click="showInvoiceInfo(record.orderID)">查看发票信息</a>
                </div>
              </a>

              <template slot="invoiceType" slot-scope="status">{{ invoiceTypeText(status) }}</template>

              <template slot="barcode" slot-scope="barcode">
                <a-popover>
                  <template slot="content">
                    <div style="max-width:360px;">{{barcode}}</div>
                  </template>
                  <div
                    style="overflow:hidden;text-overflow: ellipsis;white-space: nowrap;max-width:7rem;"
                  >{{barcode}}</div>
                </a-popover>
              </template>
            </a-table>
          </a-col>

          <a-col
            :lg="{span:22, offset:1}"
            style="margin-top:38px;margin-bottom:50px;text-align:right;"
          >
            <a-pagination
              :pageSize.sync="pageSize"
              :total="totalSize"
              v-model="currentPage"
              @change="changeSubmit"
            />
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
import auth from "../../auth.js";
import FinanceHeaderComponent from "../../components/finance/Header.vue";
import FinanceService from "../../services/FinanceService";
const FinanceServiceApi = new FinanceService();

const columns = [
  { title: "姓名", dataIndex: "name", width: 120 },
  {
    title: "条形码",
    dataIndex: "barCode",
    width: 200,
    scopedSlots: { customRender: "barcode" }
  },
  { title: "预约产品", dataIndex: "itemName", width: 160 },
  { title: "下单时间", dataIndex: "orderDate", width: 180 },
  {
    title: "发票类型",
    dataIndex: "invoiceStatus",
    width: 180,
    scopedSlots: { customRender: "invoiceType" }
  },
  { title: "操作", width: 460, scopedSlots: { customRender: "action" } }
];

export default {
  components: {
    FinanceHeaderComponent
  },
  data() {
    return {
      activeKey: 0,
      type: "finance",
      orders: {
        0: [],
        1: []
      },
      columns,
      name: "收样校验列表",
      searchType: "1",
      searchText: "",
      pageSize: 10,
      currentPage: 1,
      totalSize: 10,
      headers: {}
    };
  },
  methods: {
    invoiceTypeText(status) {
      let text = "";
      switch (status) {
        case 2:
        case "2":
        case 4:
        case "4":
          text = "纸质发票";
          break;
        case 3:
        case "3":
        case 5:
        case "5":
          text = "电子发票";
          break;
      }
      return text;
    },
    tabChange(key) {
      this.activeKey = key;
      // console.log(this.activeKey);
      if (this.orders[key].length < 1) {
        this.orderList();
      }
    },
    beforeUpload(file) {
      const isValidPDF = file.type === "application/pdf";
      if (!isValidPDF) {
        this.$message.error("PDF文档格式错误");
      }
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isLt20M) {
        this.$message.error("word文档必须小于20M!");
      }
      return isValidPDF && isLt20M;
    },
    handleUploadChange(info, record) {
      if (info.file.status == "uploading" && info.hasOwnProperty("event")) {
        record.percent = Math.round(info.event.percent);
      }
      if (info.file.status === "done") {
        this.$message.success(`${info.file.name}上传成功`);
        record.percent = 0;
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} ${info.response}`);
        record.percent = 0;
      }
    },
    confirmInvoice(order) {
      // if (order.invoiceStatus == 3) {
      //   this.$message.error('请先上传电子发票')
      //   return
      // }
      FinanceServiceApi.confirmInvoice(order.orderID).then(res => {
        if (res.ret == 0) {
          this.$message.success("确认成功");
          this.orderList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    showInvoiceInfo(orderID) {
      this.$router.push({
        path: `/invoiceInfo`,
        name: "invoice",
        params: { active: this.activeKey, id: orderID }
      });

      // this.goto(`/invoiceInfo/${orderID}`);
    },
    orderList() {
      FinanceServiceApi.orderList({
        pageSize: this.pageSize,
        page: this.currentPage,
        searchType: this.searchType,
        key: this.searchText,
        status: this.activeKey
      }).then(res => {
        if (res.ret == 0) {
          this.orders[this.activeKey] = res.data.orders;
          this.totalSize = res.data.total;
        } else {
          this.$message.error = "服务端异常，获取列表失败";
        }
      });
    },
    goto(path) {
      this.$router.push({ path: path });
    },
    changeSubmit(page, pageSize) {
      this.currentPage = page;
      this.pageSize = pageSize;
      this.orderList();
    },
    search() {
      this.orderList();
    },
    // 判断是否是登录成功之后进入系统的
    hasLogin() {
      let loginUrl = "";
      loginUrl =
        window.location.href.indexOf("dev") !== -1
          ? "http://dev.work.bdlifescience.com"
          : window.location.href.indexOf("test") !== -1
          ? "http://test.work.bdlifescience.com"
          : "http://work.bdlifescience.com";
      let prevLink = document.referrer;
      // let loginUrl = "http://dev.work.bdlifescience.com";
      if (prevLink.indexOf(loginUrl) !== -1 && prevLink !== "") {
        return;
      } else {
        if (!auth.isLogin()) {
          window.location.href = `${loginUrl}/login`;
        }
      }
    }
  },
  created: function() {
    this.orderList();
  },
  mounted() {
    // console.log(document.referrer, this.activeKey);
    this.hasLogin();
    this.headers = {
      UserRole: "BDLS_DAS_FINANCE"
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        // console.log(route);
        this.activeKey = route.params.active ? route.params.active : 0;
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wait2do {
  cursor: pointer;
  line-height: 40px;
  width: 78px;
  text-align: center;
  display: inline-block;
}

.alreadydo {
  cursor: pointer;
  line-height: 40px;
  width: 78px;
  text-align: center;
  display: inline-block;
}

.tab-active {
  border-bottom: 2px solid #1890ff;
}

.content {
  min-width: 1080px;
  width: 100%;
  margin-top: 20px;
  padding: 0 100px;
  min-height: 85vh;
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
