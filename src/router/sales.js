import Vue from 'vue'
import Router from 'vue-router'

// const Index = () => import(/* webpackChunkName: "Sales" */  '../views/SalesIndex.vue')
const SalesApp = () =>
    import ( /* webpackChunkName: "Sales" */ '../views/sales/App.vue')
const SalesApp1 = () =>
    import ( /* webpackChunkName: "Sales" */ '../views/sales/App1.vue')
    // const SalesPersonalCenter = () => import(/* webpackChunkName: "Sales" */  '../views/sales/PersonalCenter.vue')
    // const SalesChangeName = () => import(/* webpackChunkName: "Sales" */  '../views/sales/ChangeName.vue')
    // const SalesChangePwd = () => import(/* webpackChunkName: "Sales" */  '../views/sales/ChangePwd.vue')
    // const SalesLogin = () => import(/* webpackChunkName: "Sales" */  '../views/sales/Login.vue')
    // const SalesForgetPwd = () => import(/* webpackChunkName: "Sales" */  '../views/sales/ForgetPwd.vue')
const SalesIndex = () =>
    import ( /* webpackChunkName: "Sales" */ '../views/sales/Index.vue')
const SalesProjects = () =>
    import ( /* webpackChunkName: "Sales" */ '../views/sales/Projects.vue')
const SalesSupplyDetection = () =>
    import ( /* webpackChunkName: "Sales" */ '../views/sales/SupplyDetection.vue')
const SalesDetection = () =>
    import ( /* webpackChunkName: "Sales" */ '../views/sales/Detection.vue')
const SalesPayment = () =>
    import ( /* webpackChunkName: "Sales" */ '../views/sales/Payment.vue')
const SalesRefund = () =>
    import ( /* webpackChunkName: "Patient" */ '../views/sales/Refund.vue')

const SalesOrderList = () =>
    import ( /* webpackChunkName: "Sales" */ '../views/sales/OrderList.vue')
const SalesOrderDetail = () =>
    import ( /* webpackChunkName: "Sales" */ '../views/sales/OrderDetail.vue')
const SalesGuide = () =>
    import ( /* webpackChunkName: "Sales" */ '../views/sales/Guide.vue')

const payType = () =>
    import ( /* webpackChunkName: "payType" */ '../views/sales/payType.vue')
const payInfo = () =>
    import ( /* webpackChunkName: "payInfo" */ '../views/sales/payInfo.vue')
Vue.use(Router)

export default new Router({
    mode: 'history',
    base: '/reception/sales',
    // base: 'http://detection.bdlife.com',
    routes: [
        // {
        //   path: '/',
        //   name: 'index',
        //   component: Index,
        // },
        {
            path: "/detection",
            component: SalesApp1,
            children: [{
                    path: ':id',
                    component: SalesDetection,
                    meta: {
                        checkLogin: true,
                        type: 'sales',
                        content: '"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"',
                        title: '预约填写',
                        keepAlive: true
                    }
                },
                {
                    path: 'supply/:id',
                    component: SalesSupplyDetection,
                    meta: {
                        checkLogin: true,
                        type: 'sales',
                        content: '"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"',
                        title: '预约信息补充'
                    }
                },
            ]
        },
        {
            path: "/",
            component: SalesApp,
            redirect: '/sales',
            children: [{
                    path: '/sales',
                    component: SalesIndex,
                    meta: {
                        checkLogin: false,
                        type: 'sales',
                        title: '首页'
                    },
                },
                {
                    path: 'projects',
                    component: SalesProjects,
                    meta: {
                        checkLogin: true,
                        type: 'sales',
                        title: '检测项目'
                    },
                },
                {
                    path: 'refund/:id',
                    component: SalesRefund,
                    meta: {
                        checkLogin: true,
                        type: 'sales',
                        title: '取消订单'
                    },
                },
                {
                    path: 'payment/:id',
                    component: SalesPayment,
                    meta: {
                        checkLogin: true,
                        type: 'sales',
                        title: '支付'
                    }
                },
                // {
                //   path: 'login',
                //   component: SalesLogin,
                //   title: '登录'
                // },
                // {
                //   path: 'personalCenter',
                //   component: SalesPersonalCenter,
                //   meta: {
                //     checkLogin: true,
                //     type: 'sales',
                //     title: '个人中心'
                //   },
                // },
                // {
                //   path: 'changeName',
                //   component: SalesChangeName,
                //   meta: {
                //     checkLogin: true,
                //     type: 'sales',
                //     title: '个人中心'
                //   },
                // },
                // {
                //   path: 'changePwd',
                //   component: SalesChangePwd,
                //   meta: {
                //     checkLogin: true,
                //     type: 'sales',
                //     title: '个人中心'
                //   },
                // },
                // {
                //   path: 'forgetPwd',
                //   component: SalesForgetPwd,
                //   meta: {
                //     checkLogin: false,
                //     type: 'sales',
                //     title: '找回密码'
                //   },
                // },
                {
                    path: 'orderList',
                    component: SalesOrderList,
                    meta: {
                        checkLogin: true,
                        type: 'sales',
                        title: '订单列表'
                    },
                },
                {
                    path: 'orderDetail/:id',
                    component: SalesOrderDetail,
                    meta: {
                        checkLogin: true,
                        type: 'sales',
                        title: '订单详情'
                    },
                },
                {
                    path: 'guide',
                    component: SalesGuide,
                    meta: {
                        checkLogin: true,
                        type: 'sales',
                        title: '拍照指引'
                    },
                },
                {
                    path: 'payType/:id',
                    component: payType,
                    meta: {
                        checkLogin: true,
                        type: 'payType',
                        title: '线下支付方式',
                        keepAlive: true
                    },
                },
                {
                    path: 'payInfo/:id',
                    component: payInfo,
                    meta: {
                        checkLogin: true,
                        type: 'payInfo',
                        title: '线下支付方式',
                        keepAlive: true
                    },
                },
            ]
        },
    ]
})