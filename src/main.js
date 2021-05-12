import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Constants from './constants'
import vuetify from './plugins/vuetify'

import ApiService from './services/api.service'
import TokenService from './services/token.service'

// Global Styles
import './styles/styles.scss'

Vue.config.productionTip = false

Vue.use(Constants)

// Set axios default auth header
if (TokenService.getAccessToken()) {
  const accessToken = TokenService.getAccessToken()
  ApiService.setTokenHeader(accessToken)
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
