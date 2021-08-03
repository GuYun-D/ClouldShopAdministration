import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import { getToken } from '../utils/user'

Vue.use(Router)

const router = new Router({
  routes
})

/**
 * 全局路由守卫
 */
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  if (!getToken()) return next('/login')
  next()
})


export default router
