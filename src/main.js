import Vue from 'vue'
// eslint-disable-next-line no-unused-vars
import  './plugins/axios'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import store from './store'
import router from './router'

Vue.config.productionTip = false
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
