import Vue from 'vue'
import Router from 'vue-router'

const Index = () => import(/* webpackChunkName: "Credit" */  '../views/credit/Index.vue')

const CreditApp = () => import(/* webpackChunkName: "Credit" */  '../views/credit/App.vue')
// const CreditLogin = () => import(/* webpackChunkName: "Credit" */  '../views/credit/Login.vue')
const CreditOrderList = () => import(/* webpackChunkName: "Credit" */  '../views/credit/OrderList.vue')
const CreditOrderDetail = () => import(/* webpackChunkName: "Credit" */  '../views/credit/OrderDetail.vue')
// const CreditForgetPwd = () => import(/* webpackChunkName: "Credit" */  '../views/credit/ForgetPwd.vue')


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/reception/credit',
  routes: [
    {
      path: "/",
      component: CreditApp,
      redirect: '/creditIndex',
      children: [
        {
          path: '/creditIndex',
          component: Index,
          meta: {
            checkLogin: true,
            type: 'credit',
            title: '首页'
          }
        },
        {
          path: 'orderList',
          component: CreditOrderList,
          meta: {
            checkLogin: true,
            type: 'credit',
            title: '订单列表'
          }
        },
        {
          path: 'orderDetail/:id',
          component: CreditOrderDetail,
          meta: {
            checkLogin: true,
            type: 'credit',
            title: '订单详情'
          }
        },
      ]
    },
  ]
})
