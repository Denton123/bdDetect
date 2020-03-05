<template>
  <div class="body">
    <div v-if="loading">
      <div style="height:10vh;"></div>
      <p style="text-align:center;">
        <inline-loading></inline-loading>
      </p>
    </div>

    <div v-if="!loading">
      <div v-if="show">
        <OrderDetailComponent
          :data="detailData"
          :order="{detail: true, orderID: order.orderID, orderDate: order.orderDate}"
        ></OrderDetailComponent>
      </div>
      <div class="mt25" style="padding-bottom:16px;">
        <box gap="16px 20px 0px">
          <x-button type="primary" @click.native="ok" style="background-color:#1890FF!important;">确认</x-button>
        </box>
      </div>
    </div>
  </div>
</template>


<script>
import { InlineLoading, XButton, Box } from "vux";

import OrderDetailComponent from "../../components/sampler/OrderDetail";
import SamplerService from "../../services/SamplerService";
const SamplerServiceApi = new SamplerService();

export default {
  components: {
    OrderDetailComponent,
    XButton,
    Box,
    InlineLoading
  },
  data() {
    return {
      show: false,
      orderID: "",
      loading: true,
      detailData: {},
      order: {
        orderID: "",
        orderDate: ""
      }
    };
  },
  methods: {
    ok() {
      this.goto("/orderList");
    },
    cancel() {
      this.goto("/orderList");
    },
    goto(path) {
      this.$router.push({ path: path });
    },
    getOrderInfo() {
      SamplerServiceApi.getOrderInfo(this.orderID, {}).then(res => {
        if (res.ret == 0) {
          this.detailData = res.data;
          this.order = res.data.order;
          this.show = true;
          this.loading = false;
        } else {
          this.cancel();
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
    this.orderID = this.$route.params.id;
    if (!this.orderID) {
      this.cancel();
    }
    this.getOrderInfo();
    this.hasLogin();
  }
};
</script>

<style scoped>
.body {
  background-color: #f4f5fa;
  min-height: 100vh;
}

.mt25 {
  margin-top: 25px;
}
</style>
