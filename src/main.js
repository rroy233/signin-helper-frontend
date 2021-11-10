import Vue from 'vue'
// eslint-disable-next-line no-unused-vars
import  './plugins/axios'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import store from './store'
import nProgress from 'nprogress'
import "nprogress/nprogress.css"
import router from './router'
import VueCookies from 'vue-cookies'

Vue.use(VueCookies)
Vue.config.productionTip = false

nProgress.configure({ease:'ease',speed:500})

router.beforeEach((to,from,next)=>{
  nProgress.start()
  next()
})
router.afterEach( () =>{
  nProgress.done()
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
