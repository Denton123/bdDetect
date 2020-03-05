<template>
  <div style="background-color:#F4F5FA;min-height:100vh;">
    <div style="background:white;height:64px;">
      <SalesHeaderComponent></SalesHeaderComponent>
    </div>

    <div>
      <a-row>
        <a-col :lg="24" :xs="0" style="height:24px;"></a-col>
      </a-row>
    </div>

    <div class="content" style="width:100%;">
      <div class="bottom-pad">
        <a-row type="flex" justify="space-between" class="text-left">
          <a-col :lg="{span:20, offset:2}" :xs="{span:24, offset:0}"  style="background-color:white;padding:12px 0;border-bottom:1px solid #F7F7F7;">
            <a-row>
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}"><span class="font-size:14px;font-weight:900;line-height:20px;"><span style="cursor:pointer;"  @click="goto()">测序信息填写</span> > 拍照指南</span></a-col>
            </a-row>
          </a-col>
        </a-row>

        <a-row class="text-left">
          <a-col :lg="{span:20, offset:2}" :xs="{span:24, offset:0}" type="flex" style="background-color:white;">
            <a-row style="margin-top:24px;">
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}"><span style="font-size:24px;">X光片、CT、核磁共振（MRI）</span></a-col>
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}" style="margin-top:16px;">拍摄上传清晰有效的影像资料，帮助医生判断病情。下面介绍一些方法。</a-col>
            </a-row>

            <a-row style="margin-top:24px;">
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}"><b>影像资料主要指以下几种</b></a-col>
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}" style="margin-top:16px;">X光片、CT、核磁共振（MRI）。</a-col>
            </a-row>

            <a-row style="margin-top:24px;">
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}"><b>拍照步骤</b></a-col>
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}" style="margin-top:16px;">1.将片子贴在背景干净的窗户上，利用阳光作为光源；</a-col>
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}" style="margin-top:12px;">2.根据胶片上的字确认胶片的方向和正反面。</a-col>
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}" style="margin-top:16px;">胶片方向可通过以下几种方式识别：</a-col>
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}">1）确保胶片上的文字是由左到右顺的；</a-col>
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}">2）在片子上找到字母L和R，确保L在你的右侧，R在你的左侧；</a-col>
            </a-row>

            <a-row style="margin-top:24px;">
              <a-col :lg="{span:3, offset:1}" :xs="{span:10, offset:2}">
                <img src="/img/guide1.png" />
              </a-col>
              <a-col :lg="{span:3, offset:0}" :xs="{span:12, offset:0}">
                <img src="/img/guide2.png" />
              </a-col>
            </a-row>

            <a-row style="margin-top:24px;">
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}">3.关闭闪光灯，将手机照相机的焦点对准胶片上的字拍照，不要歪斜。</a-col>
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}" style="margin-top:16px;">通常，一张CT或核磁共振片子上会显示20个小格，最好以1-4格为单位，按照从左到右、从上到下的先后顺序将片子拍成多张照片。</a-col>
            </a-row>

            <a-row style="margin-top:24px;">
              <a-col :lg="{span:3, offset:1}" :xs="{span:10, offset:2}">
                <img src="/img/guide3.png" />
              </a-col>
              <a-col :lg="{span:3, offset:0}" :xs="{span:12, offset:0}">
                <img src="/img/guide4.png" />
              </a-col>
            </a-row>

            <a-row style="margin-top:24px;">
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}"><b>温馨提示</b></a-col>
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}" style="margin-top:16px;">请调节屏幕亮度到最高以拍出最清晰的照片。</a-col>
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}" style="margin-top:12px;">请在黑暗的环境中拍摄，以免胶片反光。</a-col>
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}" style="margin-top:16px;">您也可以利用智能手机或PAD替代电脑作为光源获得同样的效果。</a-col>
            </a-row>

            <a-row style="margin-top:24px;">
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}"><span style="font-size:24px;"><b>常规资料</b></span></a-col>
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}" style="margin-top:16px;">一般注意事项</a-col>

              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}" style="margin-top:16px;">请尽量选择纯背景来拍摄，且背景色需与被拍照物的颜色反差较大；</a-col>
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}">请确保在光线充足的环境下进行拍照，并使被拍照物上不要被任何阴影遮挡，且没有反光；</a-col>
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}">请确保图片清晰不要出现重影、模糊等情况，以免对医生判断造成影响；</a-col>
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}">请尽量使被拍照物中的重点信息在照片中占有较大面积；  </a-col>
            </a-row>

            <a-row style="margin-top:24px;">
              <a-col :lg="{span:3, offset:1}" :xs="{span:10, offset:2}">
                <img src="/img/guide5.png" />
              </a-col>
              <a-col :lg="{span:3, offset:0}" :xs="{span:12, offset:0}">
                <img src="/img/guide6.png" />
              </a-col>
            </a-row>

            <a-row style="margin-top:24px;">
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}"><span style="font-size:24px;"><b>患处拍照</b></span></a-col>
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}" style="margin-top:16px;"><b>先拍一张整体图</b></a-col>
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}" style="margin-top:16px;">为了使医生对您的患处有整体了解和参考，请拍一张整体图，用来体现出患者相对于全身的部位。如食指有伤口，可先拍一张包含患处的手部照片，使医生把握整体伤口面积、伤口位置等情况。拍照时，尽量把伤口背后的杂物去除，拍照时在肢体或患处下或后放置一块白布作为背景，并将患处位于照片中心位置，以使患处更加清晰可辨。</a-col>
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}" style="margin-top:16px;"><b>再拍局部特写图</b></a-col>
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}">用微距摄影给患处拍摄特写镜头，尽量确保患处占照片面积的较大部分</a-col>
              <a-col :lg="{span:22, offset:1}" :xs="{span:20, offset:2}">拍照后务必检查图像质量，是否对焦清晰，如果影像模糊，需要重新拍摄。</a-col>
            </a-row>

            <a-row style="margin-top:24px;padding-bottom:76px;">
              <a-col :lg="{span:3, offset:1}" :xs="{span:10, offset:2}">
                <img src="/img/guide7.png" />
              </a-col>
              <a-col :lg="{span:3, offset:0}" :xs="{span:12, offset:0}">
                <img src="/img/guide8.png" />
              </a-col>
            </a-row>

          </a-col>
        </a-row>



      </div>
    </div>

  </div>

</template>

<script>
  // import HeaderComponent from '../../components/Header.vue'
  import SalesHeaderComponent from '../../components/sales/Header.vue'

  export default {
    components: {
      SalesHeaderComponent
    },
    data() {
      return {
        id: '',
      }
    },
    methods: {
      goto() {
        this.$router.go(-1)
        // this.$router.push({path:'/orderDetection/' + this.id})
      }
    },
    mounted: function() {
      // let id = this.$route.params.id
      // this.id = id
    }
  }

</script>

<style scoped>

  @media only screen and (min-width: 768px){
    .bottom-pad {
      padding-bottom:48px;
    }
  }

  .text-left {
    text-align:left;
  }

  .text-right {
    text-align: right;
  }
</style>
