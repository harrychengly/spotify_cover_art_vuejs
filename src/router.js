import Vue from 'vue'
import Router from 'vue-router'

import HomePage from './layout/HomePage.vue'
import TokenService from './services/token.service'
import store from './store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: {
        title: 'Artify'
      },
    }
  ]
})

router.beforeEach((to, from, next) => {
  const queryParams = to.query
  const accessToken = queryParams.access_token
  const refreshToken = queryParams.refresh_token

  const isLoggedIn = TokenService.getAccessToken()

  if (isLoggedIn) {
    // To indicate that a user has logged in
    store.dispatch('home/setUserIsLoggedIn')
  }

  if (accessToken && refreshToken) {
    TokenService.saveAccessToken(accessToken)
    TokenService.saveRefreshToken(refreshToken)
    store.dispatch('home/setUserIsLoggedIn')
    return next({ path: '/' })
  }

  next()
})

// Set web page title
router.afterEach((to) => {
  document.title = to.meta.title
})

export default router