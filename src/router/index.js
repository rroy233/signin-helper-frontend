import Vue from 'vue'
import VueRouter from 'vue-router'
import User from "../views/User.vue"
import Admin from "../views/Admin.vue"
import Error from "../components/Error.vue"
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:"/user"
  },
  {
    path:"/user",
    component:User,
    meta: {
      title: '用户 | 签到系统'
    }
  },
  {
    path:"/admin",
    component:Admin,
    meta: {
      title: '管理员 | 签到系统'
    }
  },
  {
    path:"/error/:info",
    component:Error,
    meta: {
      title: '错误 | 签到系统'
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
