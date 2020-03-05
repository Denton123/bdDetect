<template>
  <div class="layout">
    <router-view></router-view>
  </div>
</template>
<script>
import auth from "@/auth";
import BaseService from "@/services/BaseService";
const BaseServiceApi = new BaseService();
export default {
  methods: {
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
  created() {
    // this.getPostMsg();
  },
  mounted() {
    this.hasLogin();
  }
};
</script>
<style>
.layout {
  height: 100%;
  width: 100%;
  overflow: auto;
}
</style>
