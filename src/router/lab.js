import Vue from 'vue'
import Router from 'vue-router'

// Lazy Loading and grouped by chunkName
const LabApp = () => import(/* webpackChunkName: "Lab" */ '../views/lab/App.vue')
const LabOrderList = () => import(/* webpackChunkName: "Lab" */ '../views/lab/OrderList.vue')
const LabOrderConfirm = () => import(/* webpackChunkName: "Lab" */ '../views/lab/OrderConfirm.vue')
const LabOrderDetail = () => import(/* webpackChunkName: "Lab" */ '../views/lab/OrderDetail.vue')
const LabGuide = () => import(/* webpackChunkName: "Lab" */ '../views/lab/Guide.vue')


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/reception/lab',
  // base: 'http://detection.bdlife.com',
  routes: [
    {
      path: "/",
      component: LabApp,
      redirect: '/orderList',
      children: [
        // {
        //   path: '',
        //   component: LabLogin,
        //   meta: {
        //     checkLogin: false,
        //     type: 'lab',
        //     title: '登录'
        //   },
        // },
        {
          path: 'orderList',
          component: LabOrderList,
          meta: {
            checkLogin: true,
            type: 'lab',
            title: '订单列表'
          },
        },
        {
          path: 'orderConfirm/:id',
          component: LabOrderConfirm,
          meta: {
            checkLogin: true,
            type: 'lab',
            title: '订单审核'
          },
        },
        {
          path: 'orderDetail/:id',
          component: LabOrderDetail,
          meta: {
            checkLogin: true,
            type: 'lab',
            title: '订单详情'
          },
        },
        // {
        //   path: 'personalCenter',
        //   component: LabPersonalCenter,
        //   meta: {
        //     checkLogin: true,
        //     type: 'lab',
        //     title: '个人中心'
        //   },
        // },
        // {
        //   path: 'changePwd',
        //   component: LabChangePwd,
        //   meta: {
        //     checkLogin: true,
        //     type: 'lab',
        //     title: '修改密码'
        //   },
        // },
        // {
        //   path: 'changeName',
        //   component: LabChangeName,
        //   meta: {
        //     checkLogin: true,
        //     type: 'lab',
        //     title: '修改用户名'
        //   },
        // },
        {
          path: 'guide',
          component: LabGuide,
          meta: {
            checkLogin: true,
            type: 'lab',
            title: '拍照指导'
          },
        }
      ]
    },
  ]
})
