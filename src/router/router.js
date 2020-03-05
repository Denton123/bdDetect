import Vue from 'vue'
import Router from 'vue-router'

// import WechatLogin from './views/Wechat.vue'
const Index = () => import(/* webpackChunkName: "Detection" */  './views/Index.vue')


// Lazy Loading and grouped by chunkName
const LabApp = () => import(/* webpackChunkName: "Lab" */ './views/lab/App.vue')
const LabLogin = () => import(/* webpackChunkName: "Lab" */ './views/lab/Login.vue')
const LabOrderList = () => import(/* webpackChunkName: "Lab" */ './views/lab/OrderList.vue')
const LabOrderConfirm = () => import(/* webpackChunkName: "Lab" */ './views/lab/OrderConfirm.vue')
const LabOrderDetail = () => import(/* webpackChunkName: "Lab" */ './views/lab/OrderDetail.vue')
const LabPersonalCenter = () => import(/* webpackChunkName: "Lab" */ './views/lab/PersonalCenter.vue')
const LabChangePwd = () => import(/* webpackChunkName: "Lab" */ './views/lab/ChangePwd.vue')
const LabChangeName = () => import(/* webpackChunkName: "Lab" */ './views/lab/ChangeName.vue')
const LabGuide = () => import(/* webpackChunkName: "Lab" */ './views/lab/Guide.vue')


const SalesApp = () => import(/* webpackChunkName: "Detection" */  './views/sales/App.vue')

//
// const SalesAppTest = () => import(/* webpackChunkName: "Detection" */  './views/sales/AppTest.vue')
// const SalesDetectionTest = () => import(/* webpackChunkName: "Detection" */  './views/sales/DetectionTest.vue')



const SalesApp1 = () => import(/* webpackChunkName: "Detection" */  './views/sales/App1.vue')
const SalesPersonalCenter = () => import(/* webpackChunkName: "Detection" */  './views/sales/PersonalCenter.vue')
const SalesChangeName = () => import(/* webpackChunkName: "Detection" */  './views/sales/ChangeName.vue')
const SalesChangePwd = () => import(/* webpackChunkName: "Detection" */  './views/sales/ChangePwd.vue')
const SalesLogin = () => import(/* webpackChunkName: "Detection" */  './views/sales/Login.vue')
const SalesForgetPwd = () => import(/* webpackChunkName: "Detection" */  './views/sales/ForgetPwd.vue')
const SalesIndex = () => import(/* webpackChunkName: "Detection" */  './views/sales/Index.vue')
const SalesProjects = () => import(/* webpackChunkName: "Detection" */  './views/sales/Projects.vue')
const SalesUnpaidDetection = () => import(/* webpackChunkName: "Detection" */  './views/sales/UnpaidDetection.vue')
const SalesDetection = () => import(/* webpackChunkName: "Detection" */  './views/sales/Detection.vue')
const SalesPayment = () => import(/* webpackChunkName: "Detection" */  './views/sales/Payment.vue')

const SalesOrderList = () => import(/* webpackChunkName: "Detection" */  './views/sales/OrderList.vue')
const SalesOrderDetail = () => import(/* webpackChunkName: "Detection" */  './views/sales/OrderDetail.vue')
const SalesGuide = () => import(/* webpackChunkName: "Detection" */  './views/sales/Guide.vue')


const PatientApp = () => import(/* webpackChunkName: "Detection" */  './views/patient/App.vue')
const PatientIndex = () => import(/* webpackChunkName: "Detection" */  './views/patient/Index.vue')
const PatientLogin = () => import(/* webpackChunkName: "Detection" */  './views/patient/Login.vue')
const PatientReports = () => import(/* webpackChunkName: "Detection" */  './views/patient/Reports.vue')
const PatientPersonalCenter = () => import(/* webpackChunkName: "Detection" */  './views/patient/PersonalCenter.vue')
const PatientChangeName = () => import(/* webpackChunkName: "Detection" */  './views/patient/ChangeName.vue')
const PatientChangePwd = () => import(/* webpackChunkName: "Detection" */  './views/patient/ChangePwd.vue')
const PatientInvoice = () => import(/* webpackChunkName: "Detection" */  './views/patient/Invoice.vue')
const PatientProjects = () => import(/* webpackChunkName: "Detection" */  './views/patient/Projects.vue')
const PatientDetection = () => import(/* webpackChunkName: "Detection" */  './views/patient/Detection.vue')
const PatientOrderList = () => import(/* webpackChunkName: "Detection" */  './views/patient/OrderList.vue')
const PatientOrderDetail = () => import(/* webpackChunkName: "Detection" */  './views/patient/OrderDetail.vue')
const PatientForgetPwd = () => import(/* webpackChunkName: "Detection" */  './views/patient/ForgetPwd.vue')
const WechatLogin = () => import(/* webpackChunkName: "Detection" */  './views/Wechat.vue')
const WechatBind = () => import(/* webpackChunkName: "Detection" */  './views/patient/WechatBind.vue')


Vue.use(Router)

export default new Router({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
    },
    {
      path: "/lab",
      component: LabApp,
      children: [
        {
          path: '',
          component: LabLogin,
          meta: {
            checkLogin: false,
            type: 'lab',
            title: '登录'
          },
        },
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
        {
          path: 'personalCenter',
          component: LabPersonalCenter,
          meta: {
            checkLogin: true,
            type: 'lab',
            title: '个人中心'
          },
        },
        {
          path: 'changePwd',
          component: LabChangePwd,
          meta: {
            checkLogin: true,
            type: 'lab',
            title: '修改密码'
          },
        },
        {
          path: 'changeName',
          component: LabChangeName,
          meta: {
            checkLogin: true,
            type: 'lab',
            title: '修改用户名'
          },
        },
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
    {
      path: "/sales/detection",
      component: SalesApp1,
      children: [
        {
          path: ':id',
          component: SalesDetection,
          meta: {
            checkLogin: true,
            type: 'sales',
            content: '"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"',
            title: '预约填写'
          }
        },
        {
          path: 'unpaid/:id',
          component: SalesUnpaidDetection,
          meta: {
            checkLogin: true,
            type: 'sales',
            content: '"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"',
            title: '预约填写'
          }
        },
      ]
    },
    {
      path: "/sales",
      component: SalesApp,
      children: [
        {
          path: '',
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
          path: 'payment/:id',
          component: SalesPayment,
          meta: {
            checkLogin: true,
            type: 'sales',
            title: '支付'
          }
        },
        {
          path: 'login',
          component: SalesLogin,
          title: '登录'
        },
        {
          path: 'personalCenter',
          component: SalesPersonalCenter,
          meta: {
            checkLogin: true,
            type: 'sales',
            title: '个人中心'
          },
        },
        {
          path: 'changeName',
          component: SalesChangeName,
          meta: {
            checkLogin: true,
            type: 'sales',
            title: '个人中心'
          },
        },
        {
          path: 'changePwd',
          component: SalesChangePwd,
          meta: {
            checkLogin: true,
            type: 'sales',
            title: '个人中心'
          },
        },
        {
          path: 'forgetPwd',
          component: SalesForgetPwd,
          meta: {
            checkLogin: false,
            type: 'sales',
            title: '找回密码'
          },
        },
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
      ]
    },
    {
      path: "/patient",
      component: PatientApp,
      children: [
        {
          path: '',
          component: PatientIndex,
          meta: {
            checkLogin: false,
            type: 'patient',
            title: '首页'
          }
        },
        {
          path: 'projects',
          component: PatientProjects,
          meta: {
            checkLogin: true,
            type: 'patient',
            title: '检测项目'
          },
        },
        {
          path: 'invoice/:id',
          component: PatientInvoice,
          meta: {
            checkLogin: true,
            type: 'patient',
            title: '开发票'
          },
        },
        {
          path: 'detection',
          component: PatientDetection,
          meta: {
            checkLogin: false,
            type: 'patient',
            title: '测序预约'
          }
        },
        {
          path: 'auth/wechat/:type',
          name: 'wechatLogin',
          component: WechatLogin,
          meta: {
            checkLogin: false,
            type: 'patient',
            title: '登录'
          }
        },
        {
          path: 'wechat/bind',
          name: 'wechatBind',
          component: WechatBind,
          meta: {
            checkLogin: false,
            type: 'patient',
            title: '微信登录手机号码绑定'
          }
        },
        {
          path: 'login',
          component:PatientLogin,
          meta: {
            checkLogin: false,
            type: 'patient',
            title: '登录'
          }
        },
        {
          path: 'forgetPwd',
          component: PatientForgetPwd,
          meta: {
            checkLogin: false,
            type: 'patient',
            title: '找回密码'
          }
        },
        {
          path: 'reports',
          component: PatientReports,
          meta: {
            checkLogin: true,
            type: 'patient',
            title: '报告'
          }
        },
        {
          path: 'orderList',
          component: PatientOrderList,
          meta: {
            checkLogin: true,
            type: 'patient',
            title: '订单列表'
          }
        },
        {
          path: 'orderDetail/:id',
          component: PatientOrderDetail,
          meta: {
            checkLogin: true,
            type: 'patient',
            title: '订单详情'
          }
        },
        {
          path: 'personalCenter',
          component: PatientPersonalCenter,
          meta: {
            checkLogin: true,
            type: 'patient',
            title: '个人中心'
          }
        },
        {
          path: 'changePwd',
          component: PatientChangePwd,
          meta: {
            checkLogin: true,
            type: 'patient',
            title: '个人中心'
          }
        },
        {
          path: 'changeName',
          component: PatientChangeName,
          meta: {
            checkLogin: true,
            type: 'patient',
            title: '个人中心'
          }
        },
      ]
    },
  ]
})
