import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import objectAssign from 'object-assign'
import './registerServiceWorker'
import './utils/rem'
import wx from 'weixin-js-sdk';

import auth from './auth'

import vuexI18n from 'vuex-i18n'
Vue.use(vuexI18n.plugin, store)

const vuxLocales = require('json-loader!yaml-loader!@/locales/all.yml')
const componentsLocales = require('json-loader!yaml-loader!@/locales/components.yml')
const finalLocales = {
  'en': objectAssign(vuxLocales['en'], componentsLocales['en']),
  'zh-CN':objectAssign(vuxLocales['zh-CN'], componentsLocales['zh-CN'])
}

for (let i in finalLocales) {
  Vue.i18n.add(i, finalLocales[i])
}

Vue.i18n.set('zh-CN')


router.beforeEach((to, from, next) => {
  if (to.meta.checkLogin && to.meta.type && !auth.isLogin(to.meta.type)) {
    if (to.meta.type == 'sales') {
      next({path: '/sales/login?to=' + to.path})
    } else if (to.meta.type == 'patient') {
      next({path: '/patient/login?to=' + to.path})
    } else if (to.meta.type == 'lab') {
      next({path: '/lab/?to=' + to.path})
    }
  } else {
    if (to.meta.content) {
      let head = document.getElementsByTagName('head');
      let meta = document.createElement('meta');
      meta.content = to.meta.content;
      head[0].appendChild(meta)
    }

    if (to.meta.title) {
      document.title = to.meta.title
    }

    let locationUrl = window.location.href
    let code = ''
    if (locationUrl.indexOf("code") >= 0) {
      let reg = new RegExp("(^|\\?|&)"+ 'code' +"=([^&|#]*)(\\s|&|#|$)", "i");  // 因为vue有添加“#”的特点，所以这里的正则表达式会匹配 & -- &/#
      if (reg.test(locationUrl)) {
         code = unescape(RegExp.$2.replace(/\+/g, " "))
         to.query.code = code
      }
    }
    next()
  }
})



import { Button, Row, Col, Tabs, Form, Input, DatePicker, Icon, Checkbox, Alert, Card, Steps, Radio, InputNumber, Select, Upload, Modal, Divider, Popover, Menu, Dropdown, Pagination, message, Tag, Popconfirm, Cascader, Table, Avatar } from 'ant-design-vue'

Vue.component(Button.name, Button)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(DatePicker.name, DatePicker)
Vue.component(Tabs.name, Tabs)
Vue.component(Tabs.TabPane.name, Tabs.TabPane)
Vue.component(Form.name, Form)
Vue.component(Form.Item.name, Form.Item)
Vue.component(Input.name, Input)
Vue.component(Icon.name, Icon)
Vue.component(Alert.name, Alert)
Vue.component(Checkbox.name, Checkbox)
Vue.component(Card.name, Card)
Vue.component(Card.Meta.name, Card.Meta)
Vue.component(Steps.name, Steps)
Vue.component(Steps.Step.name, Steps.Step)
Vue.component(Radio.name, Radio)
Vue.component(Radio.Group.name, Radio.Group)
Vue.component(Radio.Button.name, Radio.Button)
Vue.component(InputNumber.name, InputNumber)
Vue.component(Select.name, Select)
Vue.component(Select.Option.name, Select.Option)
Vue.component(Upload.name, Upload)
Vue.component(Modal.name, Modal)
Vue.component(Divider.name, Divider)
Vue.component(Popover.name, Popover)
Vue.component(Dropdown.name, Dropdown)
Vue.component(Menu.name, Menu)
Vue.component(Menu.Item.name, Menu.Item)
Vue.component(Pagination.name, Pagination)
Vue.component(Tag.name, Tag)
Vue.component(Popconfirm.name, Popconfirm)
Vue.component(Cascader.name, Cascader)
Vue.component(Table.name, Table)
Vue.component(Input.Group.name, Input.Group)
Vue.component(Avatar.name, Avatar)



const confirm = Modal.confirm;
const success = Modal.success
const info = Modal.info;
const error = Modal.error
const warning = Modal.warning


Vue.prototype.$message = message
message.config({
  // top: `100px`,
  duration: 1,
  maxCount: 3,
});

Vue.prototype.$confirm = confirm
Vue.prototype.$success = success
Vue.prototype.$info = info
Vue.prototype.$error = error
Vue.prototype.$warning = warning
Vue.prototype.$wx = wx
// console.log(wx)

Vue.config.productionTip = false

new Vue({
  router,
  store: store,
  render: h => h(App)
}).$mount('#app')
