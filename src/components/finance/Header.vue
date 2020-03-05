<template>
  <div>
    <a-row type="flex" justify="space-between">
      <a-col :lg="{span:4, offset:0}" :xs="{span:9, offset:0}">
        <div
          @click="titleClick"
          style="font-size:18px;line-height:25px;text-align:left;padding:19px 0 20px 24px;cursor: pointer;"
        >
          <b>北斗检测预约系统-财务</b>
        </div>
      </a-col>
      <a-col :lg="{span:20, offset:0}" :xs="{span:15, offset:0}" v-if="isLogin">
        <div style="text-align:right;padding:17px 24px 16px 0;">
          <!-- <img
            @click="personalCenter"
            style="height:31px;width:31px;vertical-align:middle;margin-right:16px;cursor:pointer;"
            :src="getUserIcon"
          />-->
          <img
            style="height:31px;width:31px;vertical-align:middle;margin-right:16px;cursor:pointer;"
            :src="userIcon"
          />
          <!-- <span @click="personalCenter">{{getUsername}}</span> -->
          <span>{{username}}</span>
          <!-- <span style="margin-left:16px;cursor: pointer;" @click="logout">退出</span> -->
        </div>
      </a-col>

      <!-- <a-col :lg="{span:20, offset:0}" :xs="{span:15, offset:0}" v-if="!isLogin">
        <div style="text-align:right;padding:17px 24px 16px 0;">
          <span style="cursor: pointer;" @click="loginClick">登录</span>
        </div>
      </!-->
    </a-row>
  </div>
</template>

<script>
import auth from "../../auth.js";
import BaseService from "@/services/BaseService";
const BaseServiceApi = new BaseService();
export default {
  // props: ["userIcon", "username"],
  data() {
    return {
      type: "finance",
      name: "财务端",
      isLogin: true,
      userIcon: "",
      username: "",
      timer: null
    };
  },
  methods: {
    goto(path) {
      this.$router.push({ path: path });
    },
    titleClick() {
      if (auth.isLogin()) {
        this.goto("/orderList");
      } else {
        this.goto("/finance");
      }
    },
    // 头像
    handleUser(type) {
      switch (type) {
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
  },
  mounted: function() {
    if (auth.isLogin()) {
      this.isLogin = true;
    }
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
