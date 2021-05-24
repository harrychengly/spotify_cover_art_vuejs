import Vue from 'vue'
import Router from 'vue-router'

import HomePage from './layout/HomePage.vue'
import ResultPage from './layout/ResultPage.vue'
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
    },
    {
      path: '/result',
      name: 'result',
      component: ResultPage,
      meta: {
        title: 'Artify'
      },
    }
  ]
})

router.beforeEach((to, from, next) => {
  const queryParams = to.query
  const accessToken = queryParams.access_token

  // Check if user is newly logged in from Spotify service
  if (accessToken) {
    TokenService.saveAccessToken(accessToken)
    store.dispatch('home/setUserIsLoggedIn')

    return next({ path: '/' })
  }

  // If token exists, set user as logged in
  const isLoggedIn = TokenService.getAccessToken()
  if (isLoggedIn) {
    // To indicate that a user has logged in
    store.dispatch('home/setUserIsLoggedIn')
  }

  next()
})

// Set web page title
router.afterEach((to) => {
  document.title = to.meta.title
})

export default router