<template>
  <div class="layout">
    <router-view></router-view>
    <div style="height:50px;line-height:50px;">
        备案号：
        <a href="http://www.beian.miit.gov.cn" target="_blank" class="provider">粤ICP备18156081号-1</a>
      </div>
  </div>
</template>
<script>
import auth from "@/auth";
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
  mounted() {
    this.hasLogin();
  }
};
</script>

<style>
.provider {
  color: rgba(0, 0, 0, 0.65);
}
.provider:hover,
.provider:active,
.provider:focus,
.provider:visited {
  text-decoration: none;
}
.layout {
  height: 100%;
  width: 100%;
  position: absolute;
  overflow: auto;
  min-width: 1280px;
}

body {
  overflow-x: auto;
  overflow-y: hidden;
}

/* Customize website's scrollbar like Mac OS
Not supports in Firefox and IE */

/* total width */
body::-webkit-scrollbar {
  background-color: #fff;
  width: 16px;
}

/* background of the scrollbar except button or resizer */
body::-webkit-scrollbar-track {
  background-color: #fff;
}

/* scrollbar itself */
body::-webkit-scrollbar-thumb {
  background-color: #babac0;
  border-radius: 16px;
  border: 5px solid #fff;
}

/* set button(top and bottom of the scrollbar) */
body::-webkit-scrollbar-button {
  display: none;
}
</style>
