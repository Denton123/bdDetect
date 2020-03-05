<template>
  <div style="background-color:#F4F5FA;min-height:100vh;">
    <div style="background:white;">
      <SalesHeaderComponent></SalesHeaderComponent>
    </div>

    <div class="bgcover">
      <div style="padding-top:1.5rem;">
        <a-row>
          <!-- <a-col :lg="{span:24}" :xs="{span:0}"><div style="font-size:32px;line-height:45px;"><b>北斗生命科学服务中心</b></div></a-col> -->
          <a-col :lg="{span:24}" :xs="{span:24}">
            <div style="font-size:21px;">
              <b>北斗生命科学服务中心</b>
            </div>
          </a-col>
        </a-row>
        <a-row style="margin-top:10px;margin-bottom:10px;">
          <a-col :lg="{span:2, offset:11}" :xs="{span:6, offset:9}">
            <div style="padding:0 25%;">
              <div style="border:1.5px solid #1890FF"></div>
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-col :lg="{span:24}" :xs="{span:24}">
            <div>为您提供优质的基因测序服务</div>
          </a-col>
        </a-row>
      </div>
    </div>

    <div class="content" style="max-width:1200px;width:100%;">
      <a-row>
        <a-col :lg="{span:20, offset:2}" :xs="{span:24, offset:0}">
          <a-row :key="index" v-for="index in 1" style="text-align:left;">
            <a-col :xs="{span:24, offset:0}" style="background-color:white;">
              <div style="padding:25px 23px 25px 23px">
                <a-row>
                  <a-col :lg="{span:16}" :xs="{span:16}">
                    <div style="font-size:18px;">
                      <b>{{tabs[2 * index - 2]['title']}}</b>
                    </div>
                    <div style="margin-top:10px;">{{tabs[2 * index - 2].descr}}</div>
                    <a-button
                      type="primary"
                      style="margin-top:16px;"
                      @click="goto(tabs[2 * index - 2]['path'])"
                    >{{tabs[2 * index - 2]['btn']}}</a-button>
                  </a-col>

                  <a-col :lg="{span:8}" :xs="{span:8}">
                    <div style="text-align:right;padding-top:13px;">
                      <img :src="tabs[2 * index - 2]['img']" />
                    </div>
                  </a-col>
                </a-row>
              </div>
            </a-col>
            <a-col :xs="{span:24}" style="height:12px;"></a-col>

            <a-col :xs="{span:24, offset:0}" style="background-color:white;">
              <div style="padding:25px 23px 25px 23px">
                <a-row>
                  <a-col :lg="{span:16}" :xs="{span:16}">
                    <div style="font-size:18px;">
                      <b>{{tabs[2 * index - 1].title}}</b>
                    </div>
                    <div style="margin-top:10px;">{{tabs[2 * index - 1].descr}}</div>
                    <a-button
                      type="primary"
                      style="margin-top:16px;"
                      @click="goto(tabs[2 * index - 1]['path'])"
                    >{{tabs[2 * index - 1].btn}}</a-button>
                  </a-col>

                  <a-col :lg="{span:8}" :xs="{span:8}">
                    <div style="text-align:right;padding-top:13px;">
                      <img :src="tabs[2 * index - 1]['img']" />
                    </div>
                  </a-col>
                </a-row>
              </div>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>

    <a-row>
      <!-- <a-col :lg="{span:24}" :xs="{span:0}" style="height:360px;"></a-col> -->
    </a-row>
  </div>
</template>

<script>
// import auth from '../../auth.js'
import SalesHeaderComponent from "../../components/sales/Header.vue";

export default {
  components: {
    SalesHeaderComponent
  },
  data() {
    return {
      type: "sales",
      name: "首页",
      displayName: "",
      isLogin: false,
      tabs: [
        {
          title: "测序预约",
          descr: "预约测序项目，填写相关信息",
          img: require("../../assets/h2.png"),
          btn: "开始填单",
          path: "/projects"
        },
        {
          title: "我的订单",
          descr: "在这您可以查看与您相关的订单",
          img: require("../../assets/h3.png"),
          btn: "查看详情",
          path: "/orderList"
        }
      ]
    };
  },
  methods: {
    goto(path) {
      this.$router.push({ path: path });
    }
  },
  mounted: function() {}
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bgcover {
  background-image: url("/img/sales_home.png");
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  height: 180px;
}

/* @media only screen and (min-width: 768px) {
    .whole-page {
      height:100vh
    }
  } */

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
  padding: 12px 12px;
  margin: 0 auto;
}
</style>
