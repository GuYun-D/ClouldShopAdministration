import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import {getToken} from './utils/user'

// 引入全局样式
import './assets/css/global.css'

// 配置elementui
import './plugins/element-ui'

// 配置vue-table-with-tree-grid
import './plugins/vueTableWidthTreeGrid'

// 引入字体图标
import './assets/fonts/iconfont.css'

// axios配置
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器
axios.interceptors.request.use((config) => {
  config.headers.Authorization = getToken()
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
