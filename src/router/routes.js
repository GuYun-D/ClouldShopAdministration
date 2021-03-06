import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/welcome.vue'
import User from "../components/user/user.vue"
import Rights from "../components/power/Rights.vue"
import Roles from "../components/power/Roles.vue"
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/params.vue'
import List from '../components/goods/List.vue'
import Add from '../components/goods/add.vue'
import Order from '../components/order/order.vue'
import Reports from '../components/report/report.vue'


export default
  [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '/',
          redirect: '/welcome'
        },
        {
          path: '/welcome',
          component: Welcome
        }, {
          path: '/users',
          component: User
        }, {
          path: '/rights',
          component: Rights
        }, {
          path: '/roles',
          component: Roles
        }, {
          path: '/categories',
          component: Cate
        }, {
          path: '/params',
          component: Params
        }, {
          path: '/goods',
          component: List
        }, {
          path: '/goods/add',
          component: Add
        }, {
          path: '/orders',
          component: Order
        }, {
          path: '/reports',
          component: Reports
        }
      ]
    }
  ]