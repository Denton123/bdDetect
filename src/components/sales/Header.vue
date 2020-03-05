<template>
  <div>
    <a-row type="flex" justify="space-between">
      <a-col :lg="{ span: 4, offset: 0 }" :xs="{ span: 10, offset: 0 }">
        <div
          @click="goto('/sales')"
          style="font-size:18px;line-height:31px;text-align:left;padding:21px 0 18px 24px;cursor: pointer;"
        >
          <b>北斗生命科学</b>
        </div>
      </a-col>
      <a-col :lg="{ span: 20, offset: 0 }" :xs="{ span: 14, offset: 0 }">
        <div style="text-align:right;padding:21px 24px 11px 0;">
          <!-- <img @click="personalCenter" style="height:31px;width:31px;vertical-align:middle;margin-right:16px;" :src="userIcon" />
          <div style="with:120px;overflow:hidden;display:inline-block;border:1px solid red;">{{displayName}}</div>
          <span style="margin-left:16px;cursor: pointer;" @click="logout">退出</span>-->
          <!-- <a-row>
            <a-col :xs="{span:6}"><div><img @click="personalCenter" style="height:31px;width:31px;vertical-align:middle;margin-right:16px;" :src="userIcon" /></div></a-col>
            <a-col :xs="{span:12}"  style="overflow:hidden;text-overflow: ellipsis;white-space: nowrap;line-height:31px;"><div>{{displayName}}</div></a-col>
            <a-col :xs="{span:6}"><div style="margin-left:16px;cursor: pointer;line-height:31px;" @click="logout">退出</div></a-col>
          </a-row>-->
          <div>
            <div
              style="display:inline-block;vertical-align:top;"
              @click="toMain"
            >
              <img style="height:31px;width:31px;" :src="userIcon" />
            </div>
            <div
              @click="toMain"
              style="display:inline-block;overflow:hidden;text-overflow: ellipsis;white-space: nowrap;line-height:31px;max-width:3.5rem;padding:0 5px;"
            >
              {{ username }}
            </div>
            <!-- <div style="display:inline-block;margin-left:0px;cursor: pointer;line-height:31px;vertical-align:top;" @click="logout">退出</div> -->
          </div>
        </div>
      </a-col>

      <!-- <a-col :lg="{span:20, offset:0}" :xs="{span:14, offset:0}" v-if="!isLogin">
        <div style="text-align:right;padding: 27px 24px 16px 0;">
      <span style="cursor: pointer;" @click="toLogin">登录</span>-->
      <!-- / <span style="cursor: pointer;" @click="goto('/register')">注册</span> -->
      <!-- </div>
      </a-col>-->
    </a-row>
  </div>
</template>

<script>
import auth from "../../auth.js";
import SalesService from "../../services/SalesService";
const SalesServiceApi = new SalesService();
import BaseService from "@/services/BaseService";
const BaseServiceApi = new BaseService();
export default {
  data() {
    return {
      type: "sales",
      name: "首页",
      userIcon: "",
      isLogin: false,
      username: "",
      timer: null
    };
  },
  methods: {
    toMain() {
      let loginUrl = "";
      loginUrl =
        window.location.href.indexOf("dev") !== -1
          ? "http://dev.work.bdlifescience.com"
          : window.location.href.indexOf("test") !== -1
          ? "http://test.work.bdlifescience.com"
          : "http://work.bdlifescience.com";
      window.location.href = `${loginUrl}`
    },
    // 头像
    handleUser(gender) {
      switch (gender) {
        case "0":
          this.userIcon = require("../../assets/user0.png");
          break;
        case "1":
          this.userIcon = require("../../assets/user1.png");
          break;
        case "2":
          this.userIcon = require("../../assets/user2.png");
      }
    }
  },
  beforeCreate() {
    BaseServiceApi.getApi("/user/api/getUserInfo", {}, "").then(res => {
      if (res.ret == 0) {
        this.username = res.data.name;
        this.handleUser(`${res.data.gender}`);
      }
    });
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bgcover {
  background-image: url("/img/hbg.png");
  background-size: 100%, auto;
  background-repeat: no-repeat;
}

.hide {
  display: none;
}
.show {
  display: block;
}
.t180 {
  margin: 0 auto;
  margin-top: 180px;
}

.t240 {
  margin: 0 auto;
  margin-top: 240px;
}

.content {
  width: 100%;
  /* max-width: 380px; */
  margin: 0 auto;
}
</style>
