<template>
  <div class="body">
    <div v-if="loading">
      <div style="height:10vh;"></div>
      <p style="text-align:center;">
        <inline-loading></inline-loading>
      </p>
    </div>

    <div v-if="!loading">
      <tab v-model="step" bar-active-color="#108EE9" active-color="#108EE9" :line-width="2">
        <tab-item @on-item-click="stepChange(0)">待办</tab-item>
        <tab-item @on-item-click="stepChange(1)">已完成</tab-item>
      </tab>

      <div v-for="(item, index) in orders[step]" :key="item.orderID + index">
        <div class="itemTag">
          <div style="border-bottom:1px solid #E5E5E5;padding: 13px 0 8px 0;">
            <flexbox>
              <flexbox-item :span="9">
                <div class="textleft" style="font-size:16px;">订单号：{{item.orderID}}</div>
              </flexbox-item>
              <!-- <flexbox-item>
                <div
                  class="textright pr15"
                >{{item.orderStatus == 3 && item.subStatus != 0 ? subStatusText(item.subStatus) : orderStatusText(item.orderStatus)}}</div>
              </flexbox-item> -->
            </flexbox>
            <flexbox>
              <flexbox-item  :span="7">
                <div class="textleft" style="font-size:16px;">{{nPStatusText(item.nPStatus)}}</div>
              </flexbox-item>
              <flexbox-item  :span="5">
                <div class="textright pr15" style="font-size:16px;">{{item.orderStatus == 3 && item.subStatus != 0 ? subStatusText(item.subStatus) : orderStatusText(item.orderStatus)}}</div>
              </flexbox-item>
            </flexbox>
          </div>

          <div style="margin-top:18px;">
            <flexbox>
              <flexbox-item>
                <div class="textleft">下单时间</div>
              </flexbox-item>
              <flexbox-item>
                <div class="textright pr15">{{item.orderDate}}</div>
              </flexbox-item>
            </flexbox>
            <flexbox class="mt6">
              <flexbox-item :span="1">
                <div class="textleft">产品</div>
              </flexbox-item>
              <flexbox-item :span="11">
                <div class="textright pr15">{{item.itemName}}</div>
              </flexbox-item>
            </flexbox>
            <flexbox class="mt6">
              <flexbox-item>
                <div class="textleft">姓名</div>
              </flexbox-item>
              <flexbox-item>
                <div class="textright pr15">{{item.name}}</div>
              </flexbox-item>
            </flexbox>
            <flexbox class="mt6">
              <flexbox-item>
                <div class="textleft">医院</div>
              </flexbox-item>
              <flexbox-item>
                <div class="textright pr15">{{item.hospital}}</div>
              </flexbox-item>
            </flexbox>
            <flexbox class="mt6">
              <flexbox-item>
                <div class="textleft">业务员</div>
              </flexbox-item>
              <flexbox-item>
                <div class="textright pr15">{{item.salesman}}</div>
              </flexbox-item>
            </flexbox>
            <flexbox class="mt6">
              <flexbox-item>
                <div class="textleft">采样标签</div>
              </flexbox-item>
              <flexbox-item>
                <div
                  class="textright pr15"
                  v-html="statusText(item.sampleStatus)"
                >{{item.sampleStatus}}</div>
              </flexbox-item>
            </flexbox>
          </div>

          <div class="mt12">
            <div class="pr15 textright">
              <x-button
                mini
                v-if="item.sampleRefused == 1"
                style="width:101px;background-color:#FF7774!important;margin-right:10px;"
              >
                <span style="font-size:13px;color:white;">有拒收样本</span>
              </x-button>
              <x-button
                mini
                style="width:90px;background-color:#1890FF!important;margin-right:10px;"
                @click.native="sampleBind(item.orderID, item.name)"
              >
                <span style="font-size:13px;color:white;">样本绑定</span>
              </x-button>
              <x-button
                mini
                style="width:90px;background-color:#F8F8F8!important;border-right:0.5px solid #D8D8D8;"
                @click.native="showDetail(item.orderID)"
              >
                <span style="font-size:13px;">查看详情</span>
              </x-button>
            </div>
          </div>
        </div>
      </div>
      <toast v-model="show" type="text" width="6.2rem" :time="1200">
        <div style="padding: 0 0.5rem;text-align:center;">{{errMsg}}</div>
      </toast>
    </div>
  </div>
</template>

<script>
import auth from "../../auth.js";

import {
  Toast,
  Tab,
  TabItem,
  Flexbox,
  FlexboxItem,
  XButton,
  InlineLoading
} from "vux";

import SamplerService from "../../services/SamplerService";
const SamplerServiceApi = new SamplerService();

export default {
  components: {
    Tab,
    TabItem,
    Flexbox,
    FlexboxItem,
    XButton,
    Toast,
    InlineLoading
  },
  data() {
    return {
      loading: true,
      type: "sampler",
      step: 0,
      show: false,
      errMsg: "",
      paginate: {
        page: 1,
        pageSize: 5
      },
      orders: {
        0: [],
        1: []
      }
    };
  },
  methods: {
    // 采样状态
    statusText(status) {
      switch (status) {
        case 1:
          return "待采样";
          break;
        case 2:
          return "完成采样";
          break;
        case 3:
          return "异常采样";
          break;
        case 4:
          return "已收货";
          break;
        case 5:
          return "拒收货";
          break;
        case 6:
          return "重新采样";
          break;
      }
    },
    stepChange(step) {
      this.step = step;
      if (this.orders[this.step].length == 0) {
        this.orderList();
      }
    },
    sampleBind(orderID, name) {
      this.goto(`/bind/${orderID}?name=${name}`);
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
    nPStatusText(text) {
      switch (text) {
        case 1:
          return "未付款";
          break;
        case 2:
          return "已付款";
          break;
        case 3:
          return "申请退款";
          break;
        case 4:
          return "已退款";
          break;
      }
    },
    showDetail(orderID) {
      this.goto(`/orderDetail/${orderID}`);
    },
    goto(path) {
      this.$router.push({ path: path });
    },
    orderList() {
      SamplerServiceApi.orderList(this.step, this.paginate).then(res => {
        if (res.ret == 0) {
          this.orders[this.step] = res.data.orders;
          this.loading = false;
        } else {
          this.loading = false;
          this.errMsg = res.msg;
          this.show = true;
        }
      });
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
      if (prevLink.indexOf(loginUrl) !== -1 && prevLink !== "") {
        return;
      } else {
        if (!auth.isLogin()) {
          window.location.href = `${loginUrl}/login`;
        }
      }
    }
  },
  mounted: function() {
    this.hasLogin();
    this.orderList();
  }
};
</script>

<style>
.body {
  background-color: #f4f5fa;
  min-height: 100vh;
}

.itemTag {
  padding-left: 15px;
  padding-bottom: 15px;
  margin-top: 12px;
  background-color: white;
}

.textleft {
  text-align: left;
}

.textright {
  text-align: right;
}

.pr15 {
  padding-right: 15px;
}
.mt12 {
  margin-top: 12px;
}

.mt6 {
  margin-top: 6px;
}
</style>
