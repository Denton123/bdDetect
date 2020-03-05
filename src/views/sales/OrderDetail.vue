<template>
  <div class="body">
    <div v-if="loading">
      <div style="height:10vh;"></div>
      <p style="text-align:center;">
        <inline-loading></inline-loading>
      </p>
    </div>
    <div v-transfer-dom v-if="showConfirm">
      <confirm
        v-model="showConfirm"
        :show-cancel-button="false"
        title="提示"
        confirm-text="知道了"
        @on-confirm="showConfirm=false">
          <p style="text-align:center;">订单已取消。</p>
      </confirm>
    </div>

    <div v-show="!loading">
      <div v-if="show">
        <!-- <div v-if="[5, 6, '5', '6'].includes(this.orderStatus)">
          <OrderBaseComponent :data="detailData" :order="{detail: true, payType: this.payType, orderID: order.orderID, orderDate: order.orderDate}"></OrderBaseComponent>
        </div> -->
        <div>
          <OrderDetailComponent :data="detailData" :order="{detail: true, payType: this.payType, orderID: order.orderID, status: order.status, orderDate: order.orderDate}"></OrderDetailComponent>
        </div>
      </div>
      <div class="mt25" style="padding-bottom:16px;">
        <box gap="16px 20px 0px" >
          <x-button type="primary" @click.native="ok" style="background-color:#1890FF!important;">确认</x-button>
          <x-button type="default" @click.native="cancelOrder">取消订单</x-button>
        </box>
      </div>
    </div>

  </div>

</template>


<script>

  import { InlineLoading, XButton, Box, TransferDom, Confirm } from 'vux'

  import OrderDetailComponent from '../../components/sales/OrderDetail'
  // import OrderBaseComponent from '../../components/sales/OrderBase'
  import SalesService from '../../services/SalesService'
  const SalesServiceApi = new SalesService()


  export default {
    directives: {
      TransferDom
    },
    components: {
      OrderDetailComponent,
      // OrderBaseComponent,
      XButton,
      Box,
      InlineLoading,
      Confirm
    },
    data () {
      return {
        showConfirm: false,
        loading:true,
        show: false,
        orderID: '',
        payType: '',
        orderStatus: '',
        detailData: {},
        order: {
          orderID: '',
          orderDate: '',
        }
      }
    },
    methods: {
      ok () {
        this.goto('/orderList')
      },
      cancel() {
        this.goto('/orderList')
      },
      cancelOrder() {
        if (this.order.status == 5) {
          this.showConfirm = true
        } else {
          if (this.order.payStatus == 2) {
            this.goto(`/refund/${this.orderID}?itemName=${this.detailData.item.name}&amount=${this.order.price}`)
          } else {
            this.goto(`/refund/${this.orderID}?itemName=${this.detailData.item.name}`)

          }
        }
      },
      goto(path) {
        this.$router.push({path: path})
      },
      getOrderInfo() {
        SalesServiceApi.getOrderInfo(this.orderID, {}).then(res => {
          if (res.ret == 0) {
            this.detailData = res.data
            this.payType = res.data.payType
            this.orderStatus = res.data.order.status
            this.order = res.data.order
            this.show = true
            this.loading = false
          } else {
            this.cancel()
          }
        })
      }
    },
    mounted: function() {
      this.orderID = this.$route.params.id
      if (!this.orderID) {
        this.cancel()
      }
      this.getOrderInfo()
    }
  }

</script>

<style scoped>

  .body {
    background-color:#F4F5FA;
    min-height:100vh;
  }

  .mt25 {
    margin-top: 25px;
  }

</style>
