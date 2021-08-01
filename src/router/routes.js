import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/welcome.vue'
import User from "../components/user/user.vue"

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
        },{
          path: '/users',
          component: User
        }
      ]
    }
  ]