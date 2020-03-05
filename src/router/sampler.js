import Vue from 'vue'
import Router from 'vue-router'

// const Index = () => import(/* webpackChunkName: "Sampler" */  '../views/SamplerIndex.vue')

const SamplerApp = () => import(/* webpackChunkName: "Sampler" */  '../views/sampler/App.vue')
// const SamplerLogin = () => import(/* webpackChunkName: "Sampler" */  '../views/sampler/Login.vue')
const SamplerBind = () => import(/* webpackChunkName: "Sampler" */  '../views/sampler/Bind.vue')
const SamplerOrderList = () => import(/* webpackChunkName: "Sampler" */  '../views/sampler/OrderList.vue')
// const SamplerForgetPwd = () => import(/* webpackChunkName: "Sampler" */  '../views/sampler/ForgetPwd.vue')
const SamplerOrderDetail = () => import(/* webpackChunkName: "Credit" */  '../views/sampler/OrderDetail.vue')


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/reception/sampler',
  routes: [
    {
      path: "/",
      component: SamplerApp,
      // redirect: '/sampler',
      children: [
        {
          path: '/',
          component: SamplerOrderList,
          meta: {
            checkLogin: true,
            type: 'sampler',
            title: '订单列表'
          }
        },
        // {
        //   path: 'login',
        //   component:SamplerLogin,
        //   meta: {
        //     checkLogin: false,
        //     type: 'sampler',
        //     title: '登录'
        //   }
        // },
        {
          path: 'bind/:id',
          component: SamplerBind,
          meta: {
            checkLogin: true,
            type: 'sampler',
            title: '样本绑定'
          }
        },
        {
          path: 'detail/:id',
          component: SamplerBind,
          meta: {
            checkLogin: true,
            type: 'sampler',
            title: '样本信息'
          }
        },
        // {
        //   path: 'forgetPwd',
        //   component: SamplerForgetPwd,
        //   meta: {
        //     checkLogin: false,
        //     type: 'sampler',
        //     title: '找回密码'
        //   }
        // },
        {
          path: 'orderList',
          component: SamplerOrderList,
          meta: {
            checkLogin: true,
            type: 'sampler',
            title: '订单列表'
          }
        },
        {
          path: 'orderDetail/:id',
          component: SamplerOrderDetail,
          meta: {
            checkLogin: true,
            type: 'sampler',
            title: '订单详情'
          }
        },
      ]
    },
  ]
})
