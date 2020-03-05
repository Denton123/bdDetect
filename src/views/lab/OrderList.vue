<template>
  <div style="background-color:#F4F5FA;min-height:100vh;">
    <div style="background:white;">
      <LabHeaderComponent></LabHeaderComponent>
    </div>

    <div class="content">
      <div style="background-color:white;">
        <a-row>
          <a-col :lg="{span:24, offset:0}" style="padding: 0 20px;">
            <div style="line-height:40px;text-align:left;">{{this.name}}</div>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <div style="height:9px;border-top:1px solid #E9E9E9;"></div>
          </a-col>
        </a-row>

        <a-row>
          <a-col :lg="{span:24, offset:0}" style="padding:0 20px;">
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
                    @pressEnter="search"
                    v-model="searchText"
                    maxlength="36"
                    placeholder="请输入搜索条件"
                    class="search-div"
                    style="width: 30%;margin-left:14px;max-width:210px;"
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

                  <!-- <a-select @blur="search" v-model="searchStatus" mode="tags" :maxTagCount="3" placeholder="订单状态" allowClear style="min-width: 160px; max-width:360px">
                  <a-select-option value="1">已下单</a-select-option>
                  <a-select-option value="2">已受理</a-select-option>
                  <a-select-option value="3">检测中</a-select-option>
                  <a-select-option value="4">已完成</a-select-option>
                  <a-select-option value="5">已取消</a-select-option>
                  </a-select>-->

                  <a-tree-select
                    :allowClear="true"
                    style="width: 230px"
                    :treeDefaultExpandAll="true"
                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                    :treeData="treeData"
                    placeholder="请选择订单状态"
                    v-model="treevalue"
                    @change="statusChange"
                  ></a-tree-select>

                  <a-button type="primary" @click="search" style="margin-left:20px;">查询</a-button>
                  <a-button type="default" @click="resetSearch" style="margin-left:14px;">重置</a-button>
                  <a-button type="default" @click="showModal = true" style="margin-left:14px;">导出</a-button>
                </a-col>
              </a-row>
            </div>
          </a-col>
          <a-modal
            title="样本导出"
            v-model="showModal"
            @ok="exportExcel"
            @cancel="showModal = false"
            okText="导出"
            cancelText="取消"
          >
            <div style="text-align:center;">
              <span>送检时间：</span>
              <a-range-picker
                :format="dateFormat"
                :placeholder="['开始日期', '结束日期']"
                @change="dateChange"
              />
            </div>
          </a-modal>
        </a-row>

        <a-row>
          <a-col :lg="{span:24, offset:0}" style="margin-top:20px;padding: 0 20px;">
            <a-table
              @change="(pagination, filters, sorter) => handleTableChange(sorter)"
              :loading="loading"
              :columns="columns"
              :dataSource="orders"
              :scroll="{ x: null, y: 460 }"
              style="border-top:1px solid #E9E9E9;border-left:1px solid #E9E9E9;border-right:1px solid #E9E9E9;"
              :pagination="false"
              rowKey="id"
            >
              <div slot="action" slot-scope="record">
                <span v-if="record.orderStatus > 1">
                  <a @click="showDetail(record, 1)">基本信息</a>
                  <a @click="showDetail(record, 2)">样本信息</a>
                </span>
                <span v-else>
                  <a @click="showDetail(record, 1)">基本校验</a>
                  <a @click="showDetail(record, 2)">样本校验</a>
                </span>
              </div>

              <template slot="name" slot-scope="name">
                <a-popover>
                  <template slot="content">
                    <div>{{name}}</div>
                  </template>
                  <div>{{substr(name, 8)}}</div>
                </a-popover>
              </template>

              <div
                slot="statusText"
                slot-scope="status, record"
              >{{record.orderStatus == 3 && record.subStatus != 0 ? subStatusText(record.subStatus) : orderStatusText(record.orderStatus)}}</div>
              <span slot="confirmText" slot-scope="status">
                <div v-html="confirmText(status)"></div>
              </span>

              <template slot="barcode" slot-scope="barcode">
                <a-popover>
                  <template slot="content">
                    <div>{{barcode}}</div>
                  </template>
                  <div>{{substr(barcode, 9)}}</div>
                </a-popover>
              </template>

              <template slot="itemName" slot-scope="itemName">
                <a-popover>
                  <template slot="content">
                    <div>{{itemName}}</div>
                  </template>
                  <div>{{substr(itemName, 10)}}</div>
                </a-popover>
              </template>

              <template slot="sampleComment" slot-scope="sampleComment">
                <a-popover>
                  <template slot="content">
                    <div v-for="i in transfer(sampleComment)" :key="i">{{i}}</div>
                  </template>
                  <div>{{substr(sampleComment, 10)}}</div>
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
import LabHeaderComponent from "../../components/lab/Header.vue";
import LabService from "../../services/LabService";
const LabServiceApi = new LabService();
// import moment from 'moment'

const columns = [
  {
    title: "姓名",
    dataIndex: "name",
    width: "10%",
    scopedSlots: { customRender: "name" }
  },
  {
    title: "条形码",
    dataIndex: "barCode",
    width: "11%",
    scopedSlots: { customRender: "barcode" }
  },
  {
    title: "预约产品",
    dataIndex: "itemName",
    width: "13%",
    scopedSlots: { customRender: "itemName" }
  },
  { title: "下单时间", dataIndex: "orderDate", width: "10%" },
  { title: "接收时间", dataIndex: "lapTime", width: "10%" },
  {
    title: "样本备注",
    dataIndex: "sampleComment",
    width: "10%",
    scopedSlots: { customRender: "sampleComment" }
  },
  {
    title: "订单状态",
    dataIndex: "orderStatus",
    width: "7%",
    scopedSlots: { customRender: "statusText" }
  },
  {
    title: "是否支付",
    dataIndex: "paymentConfirm",
    width: "7%",
    scopedSlots: { customRender: "confirmText" },
    sorter: true
  },
  {
    title: "基本信息",
    dataIndex: "baseConfirm",
    width: "7%",
    scopedSlots: { customRender: "confirmText" },
    sorter: true
  },
  {
    title: "样本信息",
    dataIndex: "sampleConfirm",
    width: "7%",
    scopedSlots: { customRender: "confirmText" },
    sorter: true
  },
  { title: "操作", width: "12%", scopedSlots: { customRender: "action" } }
];

export default {
  components: {
    LabHeaderComponent
  },
  data() {
    return {
      dateFormat: "YYYY-MM-DD",
      showModal: false,
      loading: true,
      exportDateRange: [],
      type: "lab",
      orders: [],
      columns,
      name: "收样校验列表",
      searchType: "1",
      searchText: "",
      treevalue: "",
      searchStatus: [],
      sortField: "",
      sortOrder: "",
      pageSize: 10,
      currentPage: 1,
      totalSize: 10,
      treeData: [
        {
          title: "已下单",
          key: "1-0",
          value: "1-0"
        },
        {
          title: "检测中",
          key: "3-0",
          value: "3-0",
          selectable: false,
          children: [
            {
              title: "样本已验收",
              key: "3-1",
              value: "3-1"
            },
            {
              title: "上机",
              key: "3-2",
              value: "3-2"
            },
            {
              title: "下机",
              key: "3-3",
              value: "3-3"
            },
            {
              title: "开始分析",
              key: "3-4",
              value: "3-4"
            },
            {
              title: "完成分析",
              key: "3-5",
              value: "3-5"
            },
            {
              title: "报告准备中",
              key: "3-6",
              value: "3-6"
            }
          ]
        },
        {
          title: "已完成",
          key: "4-0",
          value: "4-0"
        },
        {
          title: "已取消",
          key: "5-0",
          value: "5-0"
        }
      ]
    };
  },
  computed: {},
  methods: {
    statusChange(value) {
      if (value) {
        this.searchStatus = value.split("-");
      } else {
        this.searchStatus = [];
      }
      this.search();
    },
    dateChange(dates) {
      this.exportDateRange = dates;
    },
    exportExcel() {
      if (this.exportDateRange.length != 2) {
        this.$message.error("请选择导出日期范围");
        return;
      }
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      month = month < 10 ? `0${month}` : month;
      let day = now.getDate();
      let hour = now.getHours();
      let minute = now.getMinutes();
      let filename = `orderDetail${year}${month}${day}${hour}${minute}.xls`;

      LabServiceApi.downloadExcel(
        {
          startDate: this.exportDateRange[0].format(this.dateFormat),
          endDate: this.exportDateRange[1].format(this.dateFormat)
        },
        filename
      );
      this.showModal = false;
    },
    handleTableChange(sorter) {
      if (sorter.hasOwnProperty("field") && sorter.hasOwnProperty("order")) {
        this.sortField = sorter.field;
        this.sortOrder = sorter.order;
      } else {
        this.sortField = "";
        this.sortOrder = "";
      }
      this.search();
    },
    resetSearch() {
      this.searchType = "1";
      this.searchText = "";
      this.treevalue = "";
      this.searchStatus = [];
      this.sortField = "";
      this.sortOrder = "";
      this.search();
    },
    substr(str, len) {
      if (str && str.length > len) {
        return str.substr(0, len) + "...";
      } else {
        return str;
      }
    },
    orderStatusText(status) {
      if (status == 1) {
        return "已下单";
      } else if (status == 2) {
        return "已受理";
      } else if (status == 3) {
        return "检测中";
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
    confirmText(status) {
      return status == 1
        ? "<span>是</span>"
        : '<span style="color: red;">否</span>';
    },
    orderList() {
      this.loading = true;
      let params = {
        pageSize: this.pageSize,
        page: this.currentPage,
        searchType: this.searchType,
        key: this.searchText
      };
      if (this.searchStatus.length == 2) {
        params["status"] = this.searchStatus[0];
        params["subStatus"] = this.searchStatus[1];
      }

      if (this.sortField && this.sortOrder) {
        params["sortField"] = this.sortField;
        params["sortOrder"] = this.sortOrder;
      }

      // console.log(params)
      LabServiceApi.orderList(params).then(res => {
        if (res.ret == 0) {
          this.orders = res.data.orders;
          this.totalSize = res.data.total;
          this.loading = false;
        } else {
          this.$message.error = "服务端异常，获取列表失败";
          this.loading = false;
        }
      });
    },
    goto(path) {
      this.$router.push({ path: path });
    },
    showDetail(record, step) {
      if (record.orderStatus == 1) {
        this.goto(`/orderConfirm/${record.orderID}?step=${step}`);
      } else {
        this.goto(`/orderDetail/${record.orderID}?step=${step}`);
      }
    },
    changeSubmit(page, pageSize) {
      this.currentPage = page;
      this.pageSize = pageSize;
      this.orderList();
    },
    search() {
      this.currentPage = 1;
      this.orderList();
    },
    transfer(text) {
      let arr = text && text.split(",");
      return arr;
    }
  },
  mounted: function() {
    this.orderList();
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content {
  min-width: 1280px;
  width: 100%;
  margin-top: 20px;
  padding: 0 1.2%;
  min-height: 85vh;
}

.input-suffix {
  display: none;
}
.search-div:hover .input-suffix {
  display: block;
}
.provider {
  color: rgba(0, 0, 0, 0.65);
}
.provider:hover,
.provider:active,
.provider:focus,
.provider:visited {
  text-decoration: none;
}
</style>

<style>
.ant-btn {
  line-height: 1px;
}

.ant-table-row > td {
  padding: 0px;
}
</style>
