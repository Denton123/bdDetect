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
    <div v-if="!loading">
      <LabOrderDetailComponent :orderInfo="orderInfo" :defaultStep="step" @on-confirm="doConfirm"></LabOrderDetailComponent>
    </div>

    <div>
      <a-row>
        <a-col :lg="24" :xs="0" style="height:52px;"></a-col>
      </a-row>
    </div>
  </div>
</template>


<script>
// import auth from '../../auth.js'
import LabOrderDetailComponent from "../../components/lab/OrderDetail.vue";
import LabHeaderComponent from "../../components/lab/Header.vue";
import LabService from "../../services/LabService";
const LabServiceApi = new LabService();

export default {
  components: {
    LabOrderDetailComponent,
    LabHeaderComponent
  },
  data() {
    return {
      step: "",
      type: "lab",
      orderID: "",
      loading: true,
      name: "订单详情",
      orderInfo: {}
    };
  },
  methods: {
    OrderDetail(oid) {
      LabServiceApi.orderDetail(oid).then(res => {
        if (res.ret == 0) {
          // console.log(res)
          this.orderInfo = res.data;
          this.loading = false;
        } else {
          this.$message.error = res.msg;
          this.loading = false;
        }
      });
    },
    doConfirm(step) {
      LabServiceApi.orderAccept(this.orderID, step).then(res => {
        if (res.ret === 0) {
          if (step == 1) {
            this.$confirm({
              title: "状态已更新",
              okText: "继续样本校验",
              okType: "default",
              cancelText: "返回列表页",
              iconType: "check-circle",
              content: `订单 ${this.orderInfo.order.orderID} 基本信息已确认'`,
              onOk: () => {
                this.goto(
                  `/orderConfirm/${this.orderInfo.order.orderID}?step=2`
                );
              },
              onCancel: () => {
                this.goto("/orderList");
              }
            });
          } else {
            this.$success({
              title: "状态已更新",
              okText: "确定",
              content: `订单 ${this.orderInfo.order.orderID} 样本信息已确认'`,
              onOk: () => {
                this.goto("/orderList");
              }
            });
          }
        } else {
          this.$error({
            title: "状态更新失败",
            okText: "确认",
            content: "服务端状态更新失败, 请稍后重试",
            onOk: () => {
              this.goto("/orderList");
            }
          });
        }
      });
    },
    backto() {
      this.goto("/orderList");
    },
    goto(path) {
      this.$router.push({ path: path });
    }
  },
  mounted: function() {
    this.orderID = this.$route.params.id;
    this.step = this.$route.query.step;
    if (!this.orderID || !this.step) {
      this.goto("/orderList");
    }

    this.OrderDetail(this.orderID);
  }
};
</script>

<style scoped>
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
