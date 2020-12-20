import Vue from 'vue'
import App from './App.vue'
import router from './router/router';
import store from './store/store';
import Constants from './constants/constants'
import vuetify from './plugins/vuetify'
import './styles/styles.scss'

Vue.config.productionTip = false

Vue.use(Constants)

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  return next();
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
