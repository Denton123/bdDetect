<template>
  <div class="layout appDiv">
    <router-view></router-view>
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
      // console.log(prevLink)
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
/* 禁止ios弹簧滑动 */
.layout {
  position: absolute;
  top: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>


<script>
export default {
  methods: {
    touchBid(el) {
      let startY, endY;
      //记录手指触摸的起点坐标
      el.addEventListener(
        "touchstart",
        e => {
          startY = e.touches[0].pageY;
        },
        { passive: false }
      );

      el.addEventListener(
        "touchmove",
        e => {
          endY = e.touches[0].pageY; //记录手指触摸的移动中的坐标
          //手指上滑，页面到达底部能继续上滑
          if (
            this.$store.state.detectionStep == 1 &&
            this.$store.state.detectionStep2ItemClicked
          ) {
            //手指下滑，页面到达顶端不能继续下滑
            if (endY > startY && el.scrollTop <= 0) {
              e.preventDefault();
            }
            // console.log(el.scrollTop, '-', window.innerHeight, '-', el.scrollHeight)
            if (
              endY < startY &&
              el.scrollTop + window.innerHeight >= el.scrollHeight
            ) {
              // console.log('stop up scroll')
              e.preventDefault();
            }
          }
        },
        { passive: false }
      );
    }
  },
  mounted: function() {
    let el = document.querySelector(".layout");
    this.touchBid(el);
  }
};
</script>
