import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Constants from './constants'
import vuetify from './plugins/vuetify'

import ApiService from './services/api.service'

// Global Styles
import './styles/styles.scss'

Vue.config.productionTip = false

Vue.use(Constants)

ApiService.mount401Interceptor()

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
