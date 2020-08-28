import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Admin from '../views/Admin.vue'
import Welcome from '../components/Welcome.vue'
import Users from "../components/Users.vue";
import Roles from '../components/Roles.vue'
import Rights from '../components/Rights.vue'
import Cookies from 'js-cookie'
Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin',
    component: Admin,
    redirect:'/welcome',
    children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:Users},
      {path:'/roles',component:Roles},
      {path:'/rights',component:Rights}
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/register'){
      return next();
  }
  const token=Cookies.get('token');
  if (!token){
      return next('/login');
  }
  return next()
})

export default router
