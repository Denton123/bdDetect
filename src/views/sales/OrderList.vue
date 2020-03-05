<template>
  <div class="body">

    <div v-transfer-dom>
      <confirm
        v-model="showConfirm"
        title="是否确认退款"
        @on-cancel="showConfirm = false"
        @on-confirm="offlineRefund"
      >
        <p style="text-align:center;">您是否确认已线下退款。</p>
      </confirm>
    </div>

    <div>
      <tab
        v-model="step"
        bar-active-color="#108EE9"
        active-color="#108EE9"
        :line-width="2"
        class="tab"
      >
        <tab-item @on-item-click="tabClick(1)">基本信息未确认</tab-item>
        <tab-item @on-item-click="tabClick(2)">基本信息确认</tab-item>
        <tab-item @on-item-click="tabClick(3)">已完成</tab-item>
      </tab>

      <div v-if="orders.length !== 0">
        <div
          v-for="(item, index) in orders"
          :key="item.orderID + index"
          style="margin-top:44px;"
        >
          <div class="itemTag">
            <div style="border-bottom:1px solid #E5E5E5;padding: 13px 0 8px 0;">
              <flexbox>
                <flexbox-item :span="10">
                  <div class="textleft" style="font-size:16px;">
                    订单号：{{ item.orderID }}
                  </div>
                </flexbox-item>
                <!-- <flexbox-item :span="2">
                <div
                  class="textright pr15"
                >{{item.orderStatus == 3 && item.subStatus != 0 ? subStatusText(item.subStatus) : orderStatusText(item.orderStatus)}}</div>
              </flexbox-item>-->
              </flexbox>
              <flexbox>
                <flexbox-item :span="7">
                  <div class="textleft" style="font-size:16px;">
                    {{ nPStatusText(item.paymentStatus) }}
                  </div>
                </flexbox-item>
                <flexbox-item :span="5">
                  <div class="textright pr15" style="font-size:16px;">
                    {{
                      item.orderStatus == 3 && item.subStatus != 0
                        ? subStatusText(item.subStatus, item.labStatus)
                        : orderStatusText(item.orderStatus)
                    }}
                  </div>
                </flexbox-item>
              </flexbox>
            </div>

            <div style="margin-top:18px;">
              <flexbox style="padding:0 0 10px 0;">
                <flexbox-item>
                  <div class="textleft">下单时间</div>
                </flexbox-item>
                <flexbox-item>
                  <div class="textright" style="padding-right: 7px;">{{ item.orderDate }}</div>
                </flexbox-item>
              </flexbox>
              <flexbox class="mt6" style="padding:0 0 10px 0;">
                <flexbox-item :span="1">
                  <div class="textleft">产品</div>
                </flexbox-item>
                <flexbox-item :span="11">
                  <div class="textright pr15">{{ item.itemName }}</div>
                </flexbox-item>
              </flexbox>
              <flexbox class="mt6" style="padding:0 0 10px 0;">
                <flexbox-item>
                  <div class="textleft">姓名</div>
                </flexbox-item>
                <flexbox-item>
                  <div class="textright pr15">{{ item.name }}</div>
                </flexbox-item>
              </flexbox>
              <flexbox class="">
                <flexbox-item>
                  <div class="textleft">基本信息确认</div>
                </flexbox-item>
                <flexbox-item>
                  <x-switch
                    title
                    :value-map="[2, 1]"
                    :disabled="item.orderStatus != 1"
                    @on-change="b => baseConfirmChange(b, item.orderID)"
                    class="textright pr15"
                    v-model="item.baseConfirm"
                  ></x-switch>
                </flexbox-item>
              </flexbox>
              <flexbox class="">
                <flexbox-item>
                  <div class="textleft">样本信息确认</div>
                </flexbox-item>
                <flexbox-item>
                  <x-switch
                    title
                    :value-map="[2, 1]"
                    :disabled="true"
                    @on-change="b => sampleConfirmChange(b, item.orderID)"
                    class="textright pr15"
                    v-model="item.sampleConfirm"
                  ></x-switch>
                </flexbox-item>
              </flexbox>
              <!-- <flexbox class="mt6">
              <flexbox-item>
                <div class="textleft">是否付款</div>
              </flexbox-item>
              <flexbox-item>
                <x-switch
                  title
                  :value-map="[2, 1]"
                  :disabled="[1, 2, 4].includes(item.paymentType) || item.orderStatus !=1 "
                  @on-change="b => paymentConfirmChange(b, item.orderID)"
                  class="textright pr15"
                  v-model="item.paymentConfirm"
                ></x-switch>
              </flexbox-item>
            </flexbox> -->
              <flexbox
                class="mt6"
                v-if="item.paymentStatus == 3 || item.paymentStatus == 4"
              >
                <flexbox-item>
                  <div class="textleft">是否已退款</div>
                </flexbox-item>
                <flexbox-item>
                  <x-switch
                    title
                    disabled
                    :value="paymentValue(item.paymentStatus)"
                    class="textright pr15"
                  ></x-switch>
                </flexbox-item>
              </flexbox>
            </div>

            <div>
              <div class="pr15 textright">
                <x-button
                  mini
                  :disabled="item.orderStatus != 1"
                  style="width:100px;background-color:#F8F8F8!important;border-right:0.5px solid #D8D8D8;margin-right:13px;"
                  @click.native="showPayment(item)"
                >
                  <span style="font-size:13px;">{{
                    item.paymentConfirm == 2 ? "支付" : "支付信息"
                  }}</span>
                </x-button>
                <!-- <x-button
                mini
                :disabled="item.orderStatus != 1"
                style="width:100px;background-color:#F8F8F8!important;border-right:0.5px solid #D8D8D8;"
                @click.native="additional(item)"
              >
                <span style="font-size:13px;">补充信息</span>
              </x-button> -->
                <x-button
                  mini
                  style="width:100px;background-color:#F8F8F8!important;border-right:0.5px solid #D8D8D8;"
                  @click.native="additional(item)"
                >
                  <span style="font-size:13px;">补充信息</span>
                </x-button>
              </div>
            </div>

            <div>
              <div class="pr15 textright">
                <x-button
                  mini
                  :disabled="disabledRefund(item)"
                  v-show="showRefund(item)"
                  @click.native="doConfirm(item)"
                  style="width:100px; background-color:#F8F8F8!important;border-right:0.5px solid #D8D8D8;margin-right:13px;"
                >
                  <span style="font-size:13px;">{{ refundText(item) }}</span>
                </x-button>
                <!-- <x-button
                mini
                style="width:100px;background-color:#F8F8F8!important;border-right:0.5px solid #D8D8D8;"
                @click.native="showDetail(item)"
              >
                <span style="font-size:13px;">查看详情</span>
              </x-button> -->
              </div>
            </div>
            <div class="mt12"></div>
          </div>
        </div>
        <toast v-model="show" width="4.5rem" :time="1200" type="text">
          <div style="margin:0 0.4rem;">{{ errMsg }}</div>
        </toast>
        <toast v-model="showSuccess" type="success" width="5.4rem" :time="800">
          <div style="padding: 0 0.5rem;text-align:center;">
            {{ successMsg }}
          </div>
        </toast>
      </div>
      <div v-else style="margin-top:44px;height:50vh;line-height:40;color:#b8b8b8;">无数据</div>
    </div>
  </div>
</template>

<script>
import {
  InlineLoading,
  TransferDom,
  XSwitch,
  Toast,
  Tab,
  TabItem,
  Flexbox,
  FlexboxItem,
  XButton,
  Confirm
} from "vux";

import SalesService from "../../services/SalesService";
const SalesServiceApi = new SalesService();

export default {
  directives: {
    TransferDom
  },
  components: {
    Tab,
    TabItem,
    XSwitch,
    Flexbox,
    FlexboxItem,
    XButton,
    Toast,
    InlineLoading,
    Confirm
  },
  data() {
    return {
      refundItem: {},
      showConfirm: false,
      loading: true,
      type: "sale",
      step: 0,
      errMsg: "",
      successMsg: "",
      showSuccess: false,
      show: false,
      orders: []
    };
  },
  methods: {
    tabClick(index) {
      console.log(index);
      SalesServiceApi.getOrderList(index, {}).then(res => {
        if (res.ret == 0) {
          this.orders = res.data;
          // this.scrollTop();
          this.loading = false;
        } else {
          this.errMsg = "服务端异常";
          this.show = true;
        }
      });
    },
    // 是否已退款
    paymentValue(text) {
      switch (text) {
        case 3:
          return false;
          break;
        case 4:
          return true;
          break;
      }
    },
    baseConfirmChange(v, orderID) {
      const params =
        v == 1
          ? {
              status: 1
            }
          : {
              status: 0
            };
      SalesServiceApi.confirmBaseInfo(orderID, params).then(res => {
        if (res.ret == 0) {
          this.successMsg = "状态更新成功";
          this.showSuccess = true;
        } else {
          this.errMsg = res.msg;
          this.show = true;
        }
      });
    },
    doConfirm(item) {
      this.refundItem = item;
      this.showConfirm = true;
    },
    offlineRefund() {
      this.showConfirm = false;
      let item = this.refundItem;
      if ([3, 4].includes(item.paymentType) && item.paymentStatus == 3) {
        SalesServiceApi.offlineRefund(item.orderID).then(res => {
          if (res.ret == 0) {
            this.successMsg = "退款成功";
            this.showSuccess = true;
            this.orderList();
          } else {
            this.errMsg = res.msg;
            this.show = true;
          }
        });
      }
    },
    sampleConfirmChange(v, orderID) {
      const params =
        v == 1
          ? {
              status: 1
            }
          : {
              status: 0
            };
      SalesServiceApi.confirmSampleInfo(orderID, params).then(res => {
        if (res.ret == 0) {
          this.successMsg = "状态更新成功";
          this.showSuccess = true;
        } else {
          this.errMsg = res.msg;
          this.show = true;
        }
      });
    },
    paymentConfirmChange(v, orderID) {
      const params =
        v == 1
          ? {
              status: 1
            }
          : {
              status: 0
            };
      SalesServiceApi.confirmPayment(orderID, params).then(res => {
        if (res.ret == 0) {
          this.successMsg = "状态更新成功";
          this.showSuccess = true;
        } else {
          this.errMsg = res.msg;
          this.show = true;
        }
      });
    },
    showPayment(item) {
      console.log(item.paymentConfirm);
      if (item.paymentConfirm == 2) {
        this.goto(`/payment/${item.orderID}`);
      } else {
        this.goto(`/payInfo/${item.orderID}`);
      }
    },
    filteredOrders() {
      const orders = [...this.orders];
      const targets = orders.filter(
        order =>
          (this.step == 0 && [1, 2, 3].includes(order.orderStatus)) ||
          (this.step == 1 && [4, 5].includes(order.orderStatus))
      );
      console.log(targets, this.orders);
      return targets;
    },
    disabledRefund(item) {
      if ([3, 4].includes(item.paymentType) && item.paymentStatus == 3) {
        return false;
      } else {
        return true;
      }
    },
    showRefund(item) {
      if (
        ([1, 2].includes(item.paymentType) &&
          [3, 4].includes(item.paymentStatus)) ||
        ([3, 4].includes(item.paymentType) &&
          [3, 4].includes(item.paymentStatus))
      ) {
        return true;
      } else {
        return false;
      }
    },
    // 退款按钮文字
    // refundText(item) {
    //   if ([1, 2].includes(item.paymentType)) {
    //     if (item.paymentStatus == 4) {
    //       return "已线上退款";
    //     } else if (item.paymentStatus == 3) {
    //       return "线上退款中";
    //     }
    //   } else if ([3, 4].includes(item.paymentType)) {
    //     if (item.paymentStatus == 4) {
    //       return "已线下退款";
    //     } else if (item.paymentStatus == 3) {
    //       return "线下退款";
    //     }
    //   }
    //   return;
    // },
    refundText(item) {
      if ([1, 2].includes(item.paymentType)) {
        if (item.paymentStatus == 4) {
          return "退款确认";
        } else if (item.paymentStatus == 3) {
          return "退款确认";
        }
      } else if ([3, 4].includes(item.paymentType)) {
        if (item.paymentStatus == 4) {
          return "退款确认";
        } else if (item.paymentStatus == 3) {
          return "退款确认";
        }
      }
      return;
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
    subStatusText(ss, labS) {
      console.log(ss);
      let text = "";
      if (ss == 1) {
        switch (labS) {
          case null:
            text = "待实验";
            break;
          case 0:
            text = "待实验";
            break;
          case 1:
            text = "HE染色";
            break;
          case 2:
            text = "核酸提取";
            break;
          case 3:
            text = "DNA片段化";
            break;
          case 4:
            text = "预文库构建";
            break;
          case 5:
            text = "终文库构建";
            break;
          case 6:
            text = "文库混合";
            break;
          case 7:
            text = "上机测序";
            break;
          case 8:
            text = "生信分析";
            break;
          case 9:
            text = "QPCR";
            break;
          case 10:
            text = "实验完成";
            break;
          default:
            text = "";
        }
      } else {
        switch (ss) {
          case 0:
            text = "样本已验收";
            break;
          case 1:
            text = "样本已验收";
            break;
          case 2:
            text = "报告准备中";
            break;
          default:
            text = "";
        }
      }
      // let text = "";
      // switch (ss) {
      //     case 1:
      //         text = "样本已验收";
      //         break;
      //     case 2:
      //         text = "上机";
      //         break;
      //     case 3:
      //         text = "下机";
      //         break;
      //     case 4:
      //         text = "开始分析";
      //         break;
      //     case 5:
      //         text = "完成分析";
      //         break;
      //     case 6:
      //         text = "报告准备中";
      //         break;
      //     default:
      //         text = "";
      // }
      return text;
    },
    additional(item) {
      this.goto(`/detection/supply/${item.itemID}?orderID=${item.orderID}`);
    },
    showDetail(item) {
      this.goto(`/orderDetail/${item.orderID}`);
    },
    goto(path) {
      this.$router.push({
        path: path
      });
    },
    scrollTop() {
      // document.body.scrollTop = 0;
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
      console.log(document.body.scrollTop, 'wwwwwwwwwwwww')
      // window.scrollTo(100,100)
      //  var scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
  // document.documentElement.scrollTop = document.body.scrollTop =0; 
    },
    orderList() {
      SalesServiceApi.getOrderList(1, {}).then(res => {
        if (res.ret == 0) {
          this.orders = res.data;
          this.loading = false;
          // this.scrollTop();
        } else {
          this.errMsg = "服务端异常";
          this.show = true;
        }
      });
      // SalesServiceApi.getOrderList(1,{}).then(res => {
      //     if (res.ret == 0) {
      //         this.orders = res.data;
      //         this.loading = false;
      //         this.scrollTop();
      //     } else {
      //         this.errMsg = "服务端异常";
      //         this.show = true;
      //     }
      // });
    }
  },
  mounted: function() {
    this.$nextTick(() => {
      this.orderList();
    });
  }
};
</script>

<style scoped>
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
.tab {
  position: fixed;
  top: 0;
  height: 44px;
  width: 100%;
  z-index: 9999;
}
</style>
