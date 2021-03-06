import Vue from 'vue'
import App from '../apps/LabApp.vue'
import router from '../router/lab'
import store from '../store/lab'
import '../registerServiceWorker'
import '../utils/rem'

// import auth from '../auth'

router.beforeEach((to, from, next) => {
  
    if (to.meta.content) {
      let head = document.getElementsByTagName('head');
      let meta = document.createElement('meta');
      meta.content = to.meta.content;
      head[0].appendChild(meta)
    }

    if (to.meta.title) {
      document.title = to.meta.title
    }

    next()
})

import VueDraggableResizable from 'vue-draggable-resizable'
// optionally import default styles
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
Vue.component('vue-draggable-resizable', VueDraggableResizable)


import { Button, Row, TreeSelect, Col, Tabs, Form, Input, DatePicker, Icon, Checkbox, Alert, Card, Steps, Radio, InputNumber, Select, Upload, Modal, Divider, Popover, Menu, Dropdown, Pagination, message, Tag, Popconfirm, Cascader, Table, Avatar } from 'ant-design-vue'

Vue.component(TreeSelect.name, TreeSelect)
Vue.component(Button.name, Button)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(DatePicker.name, DatePicker)  
Vue.component(DatePicker.RangePicker.name, DatePicker.RangePicker)
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
  duration: 1,
  maxCount: 1,
});

Vue.prototype.$confirm = confirm
Vue.prototype.$success = success
Vue.prototype.$info = info
Vue.prototype.$error = error
Vue.prototype.$warning = warning

Vue.config.productionTip = false

new Vue({
  router,
  store: store,
  render: h => h(App)
}).$mount('#app')
