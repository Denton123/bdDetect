import Vue from 'vue'
import Router from 'vue-router'

// Lazy Loading and grouped by chunkName
const FinanceApp = () => import(/* webpackChunkName: "Finance" */ '../views/finance/App.vue')
// const FinanceLogin = () => import(/* webpackChunkName: "Finance" */ '../views/finance/Login.vue')
const FinanceOrderList = () => import(/* webpackChunkName: "Finance" */ '../views/finance/OrderList.vue')
const FinanceInvoice = () => import(/* webpackChunkName: "Finance" */ '../views/finance/Invoice.vue')
// const FinancePersonalCenter = () => import(/* webpackChunkName: "Finance" */ '../views/finance/PersonalCenter.vue')
// const FinanceChangePwd = () => import(/* webpackChunkName: "Finance" */ '../views/finance/ChangePwd.vue')
// const FinanceChangeName = () => import(/* webpackChunkName: "Finance" */ '../views/finance/ChangeName.vue')


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/reception/finance',
  // base: 'http://detection.bdlife.com',
  routes: [
    {
      path: "/",
      component: FinanceApp,
      redirect: '/orderList',
      children: [
        // {
        //   path: '',
        //   component: FinanceLogin,
        //   meta: {
        //     checkLogin: false,
        //     type: 'finance',
        //     title: '登录'
        //   },
        // },
        {
          path: 'orderList',
          component: FinanceOrderList,
          name: 'orderlist',
          meta: {
            checkLogin: true,
            type: 'finance',
            title: '订单列表'
          },
        },
        {
          path: 'invoiceInfo/:id',
          component: FinanceInvoice,
          name: 'invoice',
          meta: {
            checkLogin: true,
            type: 'finance',
            title: '发票信息'
          },
        },
        // {
        //   path: 'personalCenter',
        //   component: FinancePersonalCenter,
        //   meta: {
        //     checkLogin: true,
        //     type: 'finance',
        //     title: '个人中心'
        //   },
        // },
        // {
        //   path: 'changePwd',
        //   component: FinanceChangePwd,
        //   meta: {
        //     checkLogin: true,
        //     type: 'finance',
        //     title: '修改密码'
        //   },
        // },
        // {
        //   path: 'changeName',
        //   component: FinanceChangeName,
        //   meta: {
        //     checkLogin: true,
        //     type: 'finance',
        //     title: '修改用户名'
        //   },
        // },
      ]
    },
  ]
})
