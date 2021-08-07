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

// 引入富文本
import './plugins/vue-quill-editor'

// axios配置
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器
axios.interceptors.request.use((config) => {
  config.headers.Authorization = getToken()
  return config
})
Vue.prototype.$http = axios

// 时间过滤器
Vue.filter('dataFormat', function (originValue){
  const dt = new Date(originValue)
  const year = dt.getFullYear()
  const month = (dt.getMonth() + '').padStart(2, '0')
  const day = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${year}-${month}-${day} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
