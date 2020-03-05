<template>
  <div>
    <a-row type="flex" justify="space-between">
      <a-col :lg="{span:5, offset:0}" :xs="{span:9, offset:0}">
        <div
          @click="titleClick"
          style="font-size:18px;line-height:25px;text-align:left;padding:19px 0 20px 24px;cursor: pointer;"
        >
          <b>北斗检测预约系统-实验室</b>
        </div>
      </a-col>
      <a-col :lg="{span:19, offset:0}" :xs="{span:15, offset:0}">
        <div style="text-align:right;padding:17px 24px 16px 0;">
          <img
            style="height:31px;width:31px;vertical-align:middle;margin-right:16px;cursor:pointer;"
            :src="userIcon"
          />
          <!-- <a-avatar :src="getUserIcon" /> -->
          <span>{{username}}</span>
          <!-- <span style="margin-left:16px;cursor: pointer;" @click="logout">退出</span> -->
        </div>
      </a-col>

      <!-- <a-col  :lg="{span:20, offset:0}" :xs="{span:15, offset:0}" v-if="!isLogin">
        <div style="text-align:right;padding:17px 24px 16px 0;">
          <span style="cursor: pointer;" @click="loginClick">登录</span>
        </div>
      </a-col>-->
    </a-row>
  </div>
</template>

<script>
import auth from "../../auth.js";
import LabService from "../../services/LabService";
const LabServiceApi = new LabService();
import BaseService from "@/services/BaseService";
const BaseServiceApi = new BaseService();
export default {
  // props:['userIcon', 'username'],
  data() {
    return {
      type: "lab",
      name: "实验室PC",
      isLogin: true,
      userIcon: "",
      username: "",
      timer: null
    };
  },
  methods: {
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
    },
    goto(path) {
      this.$router.push({ path: path });
    },
    titleClick() {
      this.goto("/");
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
