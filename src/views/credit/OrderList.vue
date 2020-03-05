<template>
  <div class="body">
    <div v-if="loading">
      <div style="height:10vh;"></div>
      <p style="text-align:center;">
        <inline-loading></inline-loading>
      </p>
    </div>

    <div v-transfer-dom>
        <confirm
          v-model="showAccept"
          confirm-text="确认"
          cancel-text="关闭"
          @on-confirm="creditAccept"
          title='是否确认'
        >
            <p style="text-align:center;">您是否确认该订单，我们将默认确认授信的订单为已支付</p>
        </confirm>
      </div>

      <div v-transfer-dom>
        <confirm
          v-model="showRefuse"
          confirm-text="确认"
          cancel-text="关闭"
          @on-confirm="creditRefuse"
          title='是否拒绝'
        >
            <p style="text-align:center;">您是否拒绝该订单，被拒绝的订单将被退回</p>
        </confirm>
      </div>

    <div v-if="!loading">
      <tab v-model="step" bar-active-color="#108EE9" active-color="#108EE9" :line-width="2">
        <tab-item @on-item-click="stepChange(0)">待办</tab-item>
        <tab-item @on-item-click="stepChange(1)">已办</tab-item>
      </tab>

      <div v-for="(item, index) in orders[step]" :key="item.orderID + index" >
        <div class="itemTag">
          <div style="border-bottom:1px solid #E5E5E5;padding: 13px 0 8px 0;">
            <flexbox>
             <flexbox-item :span="9"><div class="textleft" style="font-size:16px;">订单号：{{item.orderID}}</div></flexbox-item>
             <flexbox-item>
               <div class="textright pr15">
                 {{item.orderStatus == 3 && item.subStatus != 0 ? subStatusText(item.subStatus) : orderStatusText(item.orderStatus)}}
              </div>
              </flexbox-item>
           </flexbox>
          </div>

          <div style="margin-top:18px;">
            <flexbox>
              <flexbox-item><div class="textleft">下单时间</div></flexbox-item>
              <flexbox-item><div class="textright pr15">{{item.orderDate}}</div></flexbox-item>
            </flexbox>
            <flexbox class="mt6">
              <flexbox-item><div class="textleft">产品</div></flexbox-item>
              <flexbox-item><div class="textright pr15">{{item.itemName}}</div></flexbox-item>
            </flexbox>
            <flexbox class="mt6">
              <flexbox-item><div class="textleft">姓名</div></flexbox-item>
              <flexbox-item><div class="textright pr15">{{item.name}}</div></flexbox-item>
            </flexbox>
            <flexbox class="mt6">
              <flexbox-item><div class="textleft">医院</div></flexbox-item>
              <flexbox-item><div class="textright pr15">{{item.hospital}}</div></flexbox-item>
            </flexbox>
            <flexbox class="mt6">
              <flexbox-item><div class="textleft">业务员</div></flexbox-item>
              <flexbox-item><div class="textright pr15">{{item.salesman}}</div></flexbox-item>
            </flexbox>
          </div>

          <div class="mt12">
            <div class="pr15 textright">
              <span v-if="item.creditStatus == 1">
                <x-button mini style="width:70px;margin-right:10px;" @click.native="accept(item.orderID)"><span style="font-size:13px;">确认</span></x-button>
                <x-button mini style="width:70px;margin-right:10px;" @click.native="refuse(item.orderID)"><span style="font-size:13px;">拒绝</span></x-button>
              </span>
              <x-button mini v-if="item.creditStatus == 2" style="width:90px;background-color:#1890FF!important;margin-right:10px;"><span style="font-size:13px;color:white;">已同意</span></x-button>
              <x-button mini v-if="item.creditStatus == 3" style="width:90px;background-color:#FF7774!important;margin-right:10px;" ><span style="font-size:13px;color:white;">已拒绝</span></x-button>
              <x-button mini style="width:90px;background-color:#F8F8F8!important;border-right:0.5px solid #D8D8D8;" @click.native="showDetail(item.orderID)"><span style="font-size:13px;">查看详情</span></x-button>
            </div>
          </div>
        </div>
      </div>
      <toast v-model="show" type="text" width="5.4rem" :time="1200"><div style="padding: 0 0.5rem;text-align:center;">{{errMsg}}</div></toast>
    </div>
  </div>
</template>

<script>

  import auth from '../../auth.js'

  import { Toast, Tab, TransferDom, Confirm, TabItem, Flexbox, FlexboxItem, XButton, InlineLoading } from 'vux'

  import CreditService from '../../services/CreditService'
  // import { locale } from 'moment';
  const CreditServiceApi = new CreditService()

  export default {
    directives: {
      TransferDom,
      Confirm,
    },
    components: {
      Tab,
      TabItem,
      Flexbox,
      FlexboxItem,
      XButton,
      Toast,
      InlineLoading,
      Confirm,
    },
    data () {
      return {
        showAccept: false,
        showRefuse: false,
        currentOrderID: '',
        loading: true,
        type: 'credit',
        step: 0,
        show: false,
        errMsg: '',
        paginate: {
          page: 1,
          pageSize: 5,
        },
        orders: {
          0: [],
          1: [],
        }
      }
    },
    methods: {
      stepChange(step) {
        this.step = step
        this.orderList()
      },
      orderStatusText(status) {
        if (status == 1) {
          return '已下单'
        } else if (status == 2) {
          return '已受理'
        } else if (status == 3) {
          return '检测中'
        } else if (status == 4) {
          return '已完成'
        } else if (status == 5) {
          return '已取消'
        } else {
          return '未知 #' + status
        }
      },
      subStatusText(ss) {
        let text = '' 
        switch(ss) {
          case 1:
            text =  '样本已验收'
            break
          case 2:
            text =  '上机'
            break
          case 3:
            text =  '下机'
            break
          case 4:
            text =  '开始分析'
            break
          case 5:
            text =  '完成分析'
            break
          case 6:
            text =  '报告准备中'
            break
          default:
            text =  ''
        }
        return text
      },
      showDetail(orderID) {
        this.goto('/orderDetail/' + orderID)
      },
      goto(path) {
        this.$router.push({path:path})
      },
      accept(orderID) {
        this.currentOrderID = orderID
        this.showAccept = true
      },
      creditAccept() {
        CreditServiceApi.creditAccept(this.currentOrderID).then(res => {
          if (res.ret == 0) {
            this.errMsg = '授信成功'
            this.show = true
            this.orderList()
          } else {
            this.errMsg = res.msg
            this.show = true
          }
        })
      },
      refuse(orderID) {
        this.currentOrderID = orderID
        this.showRefuse = true
      },
      creditRefuse() {
        CreditServiceApi.creditRefuse(this.currentOrderID).then(res => {
          if (res.ret == 0) {
            this.errMsg = '授信已拒绝'
            this.show = true
          } else {
            this.errMsg = res.msg
            this.show = true
          }
        })
      },
      orderList() {
        CreditServiceApi.orderList(this.step, this.paginate).then(res => {
          if (res.ret == 0 ) {
            this.orders[this.step] = res.data
            this.loading = false
          } else {
            this.loading = false
            this.errMsg = res.msg
            this.show = true
          }
        })
      }
    },
    mounted: function() {
      // if(!auth.isLogin()) {
      //   window.location.href = 'http://dev.work.bdlifescience.com/login'
      // }
      this.orderList()
    }
  }

</script>

<style>

  .body {
    background-color:#F4F5FA;
    min-height:100vh;
  }

  .itemTag {
    padding-left:15px;
    padding-bottom: 15px;
    margin-top: 12px;
    background-color: white;
  }

  .textleft {
    text-align: left;
  }

  .textright {
    text-align: right;
  }

  .pr15 {
    padding-right: 15px;
  }
  .mt12 {
    margin-top: 12px;
  }

  .mt6 {
    margin-top: 6px;
  }

</style>
